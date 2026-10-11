import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Clock3, Download, MousePointer2, RefreshCw, Users, Zap } from 'lucide-react';
import api from '@/api';

interface Agent { id: number; display_number: number; telegram_username: string; status: string; computed_status: 'live' | 'offline' | 'disabled'; live_until: string | null; clicks_today: number; }
interface Overview { total_visits: number; unique_visitors: number; deposit_clicks: number; chat_clicks: number; ctr: number; }
interface Event { id: number; agent_id: number; agent: { display_number: number } | null; event_type: string; created_at: string; }
interface Performer { agent_id: number; display_number: number; telegram_username: string; deposit_clicks: number; minutes_live: number; }
function eatDate(dayOffset = 0) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Addis_Ababa', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Date.now() + dayOffset * 86400000)); }
function remaining(until: string | null, now: number) { if (!until) return 'Offline'; const m = Math.max(0, Math.ceil((new Date(until).getTime() - now) / 60000)); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; }
function csvCell(v: string | number) { const s = String(v); return `"${s.replace(/"/g, '""')}"`; }
export function StatCard({ label, value, delta, deltaType, children }: { label: string; value: string; delta: string; deltaType: string; accent?: string; children?: React.ReactNode }) { return <div className="ly-metric"><small>{label}</small><strong>{children ?? value}</strong><span className={deltaType}>{delta}</span></div>; }

export default function DashboardPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [overview, setOverview] = useState<Overview | null>(null);
    const [previous, setPrevious] = useState<Overview | null>(null);
    const [activity, setActivity] = useState<Event[]>([]);
    const [performers, setPerformers] = useState<Performer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [updatedAt, setUpdatedAt] = useState<number | null>(null);
    const [now, setNow] = useState(Date.now());
    const busy = useRef(false);
    const alive = useRef(true);
    const fetchLive = useCallback(async () => {
        if (busy.current) return;
        busy.current = true; setRefreshing(true);
        try {
            const today = eatDate(), yesterday = eatDate(-1);
            const results = await Promise.allSettled([
                api.get('/api/admin/agents?per_page=100'),
                api.get(`/api/admin/stats/overview?range=custom&from=${today}&to=${today}`),
                api.get('/api/admin/activity?per_page=8'),
                api.get(`/api/admin/stats/leaderboard?range=custom&from=${today}&to=${today}&sort=deposit_clicks&limit=5`),
                api.get(`/api/admin/stats/overview?range=custom&from=${yesterday}&to=${yesterday}`),
            ]);
            if (!alive.current) return;
            const [a, o, e, p, y] = results;
            if (a.status === 'fulfilled') setAgents(a.value.data.data);
            if (o.status === 'fulfilled') setOverview(o.value.data.data);
            if (e.status === 'fulfilled') setActivity(e.value.data.data);
            if (p.status === 'fulfilled') setPerformers(p.value.data.data);
            if (y.status === 'fulfilled') setPrevious(y.value.data.data);
            setError(results.slice(0, 4).some(r => r.status === 'rejected') ? 'Some workspace data could not be refreshed. Retry to update it.' : '');
            if (results.slice(0, 4).every(r => r.status === 'fulfilled')) setUpdatedAt(Date.now());
        } finally { busy.current = false; if (alive.current) { setLoading(false); setRefreshing(false); } }
    }, []);
    useEffect(() => {
        alive.current = true; void fetchLive();
        const timer = setInterval(() => { if (!document.hidden) void fetchLive(); }, 30000);
        const tick = setInterval(() => setNow(Date.now()), 1000);
        const onVisible = () => { if (!document.hidden) void fetchLive(); };
        document.addEventListener('visibilitychange', onVisible);
        return () => { alive.current = false; clearInterval(timer); clearInterval(tick); document.removeEventListener('visibilitychange', onVisible); };
    }, [fetchLive]);
    const active = agents.filter(a => a.status === 'active');
    const live = active.filter(a => a.computed_status === 'live' && a.live_until && new Date(a.live_until).getTime() > now).sort((a, b) => new Date(a.live_until!).getTime() - new Date(b.live_until!).getTime());
    const expiring = live.filter(a => new Date(a.live_until!).getTime() - now <= 15 * 60000);
    const disabled = agents.filter(a => a.status === 'disabled');
    const clicks = overview?.deposit_clicks ?? 0;
    const delta = previous ? clicks - previous.deposit_clicks : null;
    function exportSnapshot() {
        const rows = [['Agent', 'Telegram', 'Status', 'Clicks today', 'Live until'], ...agents.map(a => [a.display_number, a.telegram_username, a.computed_status, a.clicks_today, a.live_until ?? ''])];
        const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
        const a = document.createElement('a'); a.href = url; a.download = `banabet-agent-snapshot-${eatDate()}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    return <div className="ly-overview">
        <div className="page-head"><div><div className="ly-eyebrow">YOUR OPERATIONS, AT A GLANCE</div><h1>Today’s overview</h1><div className="subtitle">{new Intl.DateTimeFormat('en', { timeZone: 'Africa/Addis_Ababa', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())} · EAT</div></div><div className="page-actions"><button className="btn btn-secondary" onClick={exportSnapshot} disabled={loading || !agents.length}><Download size={16} />Export CSV</button><Link className="btn btn-primary" to="/admin/agents?create=1">Add agent <ArrowRight size={16} /></Link></div></div>
        {error && <div className="alert alert-error" role="alert">{error}<button className="btn btn-secondary btn-sm" disabled={refreshing} onClick={() => void fetchLive()}>Retry</button></div>}
        <section className="ly-hero"><div><span className="ly-eyebrow"><span className="ly-live-dot" />AGENT NETWORK</span><h2>{loading ? 'Loading dashboard…' : live.length ? `${live.length} agents ready to help.` : 'Your network is quiet.'}</h2><p>{loading ? 'Gathering today’s activity.' : expiring.length ? `${expiring.length} ${expiring.length === 1 ? 'session ends' : 'sessions end'} in the next 15 minutes.` : 'Monitor availability, customer interest, and your team in one place.'}</p><Link to="/admin/agents?status=live">Open live agents <ArrowRight size={16} /></Link></div><div className="ly-hero-count"><strong>{loading ? '—' : live.length}</strong><span>online / {active.length} enabled</span></div></section>
        <div className="ly-metrics"><StatCard label="Live Agents" value={loading ? '—' : String(live.length)} delta={`${active.length - live.length} enabled agents offline`} deltaType="neutral" /><StatCard label="Visitors Today" value={loading ? '—' : (overview?.total_visits ?? 0).toLocaleString()} delta={`${overview?.unique_visitors ?? 0} unique visitors`} deltaType="neutral" /><StatCard label="Deposit / withdrawal clicks" value={loading ? '—' : clicks.toLocaleString()} delta={delta === null ? 'Today’s recorded interest' : `${delta >= 0 ? '+' : ''}${delta} vs yesterday`} deltaType={delta && delta > 0 ? 'up' : 'neutral'} /><StatCard label="Click-Through Rate" value={overview ? `${overview.ctr.toFixed(1)}%` : '—'} delta="Clicks ÷ visits · not completed payments" deltaType="neutral" /></div>
        <div className="ly-overview-grid"><section className="panel"><div className="panel-head"><div><div className="ly-eyebrow">AVAILABILITY</div><h2 className="panel-title">Currently Live</h2></div><button className="ly-icon" aria-label="Refresh dashboard" disabled={refreshing} onClick={() => void fetchLive()}><RefreshCw size={17} className={refreshing ? 'loader-spin' : ''} /></button></div><div className="ly-live-list">{loading ? <p className="ly-empty">Loading agents…</p> : !live.length ? <div className="ly-empty"><Users size={28} /><h3>No agents currently live</h3><p>Online agents will appear here automatically.</p><Link to="/admin/agents">Manage your agent network</Link></div> : live.map(a => <Link className="ly-live-row" key={a.id} to={`/admin/agents?search=${a.display_number}`}><span className="ly-agent-avatar">{String(a.display_number).padStart(2, '0')}</span><div><b>Agent {a.display_number}</b><small>@{a.telegram_username}</small></div><span className={`ly-time${expiring.includes(a) ? ' urgent' : ''}`}><Clock3 size={14} />{remaining(a.live_until, now)}</span><span className="ly-click-count">{a.clicks_today ?? 0}<small>clicks</small></span><ArrowRight size={16} /></Link>)}</div><div className="ly-panel-footer"><span>{updatedAt ? `Updated ${new Intl.DateTimeFormat('en', { timeZone: 'Africa/Addis_Ababa', hour: '2-digit', minute: '2-digit' }).format(updatedAt)}` : 'Waiting for a complete refresh'}</span><Link to="/admin/agents">View all agents →</Link></div></section>
        <section className="ly-attention"><div className="ly-eyebrow">NEXT UP</div><h2>Keep things moving.</h2><Link to="/admin/agents?status=live"><span><Clock3 size={19} />Sessions ending soon</span><b>{expiring.length}</b></Link><Link to="/admin/agents?status=offline"><span><Users size={19} />Offline agents</span><b>{active.length - live.length}</b></Link><Link to="/admin/agents?status=disabled"><span><Zap size={19} />Disabled accounts</span><b>{disabled.length}</b></Link><div className="ly-attention-note">Availability is based on active session times. Telegram clicks indicate interest, not payment completion.</div><Link className="btn btn-primary" to="/admin/notices">Create a notice <ArrowRight size={16} /></Link></section></div>
        <div className="ly-overview-grid"><section className="panel"><div className="panel-head"><h2 className="panel-title"><Activity size={17} />Recent Activity</h2><Link to="/admin/activity">View all →</Link></div><div className="panel-body">{activity.length ? activity.map(e => <div className="ly-event" key={e.id}><span className={`ly-event-dot ${e.event_type}`} /><div><b>Agent {e.agent?.display_number ?? e.agent_id}</b><small>{e.event_type.replace(/_/g, ' ')}</small></div><time>{new Intl.DateTimeFormat('en', { timeZone: 'Africa/Addis_Ababa', hour: '2-digit', minute: '2-digit' }).format(new Date(e.created_at))}</time></div>) : <p className="ly-empty">No recent activity</p>}</div></section><section className="panel"><div className="panel-head"><h2 className="panel-title"><MousePointer2 size={17} />Top Performers Today</h2><Link to="/admin/analytics/agents">Insights →</Link></div><div className="panel-body">{performers.length ? performers.map((p, i) => <div className="ly-event" key={p.agent_id}><span className="ly-rank">{i + 1}</span><div><b>Agent {p.display_number}</b><small>@{p.telegram_username} · {Math.floor(p.minutes_live / 60)}h {p.minutes_live % 60}m online</small></div><strong>{p.deposit_clicks}<small>clicks</small></strong></div>) : <p className="ly-empty">No clicks today</p>}</div></section></div>
    </div>;
}
