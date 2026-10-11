import { useEffect, useState } from 'react';
import { Clock3, Plus } from 'lucide-react';
import type { AgentState } from '../types';
import useCountdown from '../useCountdown';

interface Props { state: AgentState; onSelectDuration: (minutes: number) => void; onGoOffline: () => void; onTimerExpired: () => void; isProcessing: boolean; }
export default function StatusZone({ state, onSelectDuration, onGoOffline, onTimerExpired, isProcessing }: Props) {
  const isLive = state.status.is_live;
  const available = state.available_durations;
  const [duration, setDuration] = useState(state.recommended_duration ?? available[0] ?? 30);
  useEffect(() => { if (!available.includes(duration)) setDuration(state.recommended_duration ?? available[0] ?? 30); }, [available, duration, state.recommended_duration]);
  const { hours, minutes, seconds } = useCountdown(state.status.live_until, state.status.total_duration_minutes, onTimerExpired);
  const remaining = hours * 3600 + minutes * 60 + seconds;
  const percent = state.status.total_duration_minutes ? Math.min(100, Math.max(0, remaining / (state.status.total_duration_minutes * 60) * 100)) : 0;
  return <section className="zone ly-agent-session">
    <div className="st"><span className="dot" />{isLive ? 'YOU’RE ONLINE' : 'YOU’RE OFFLINE'}</div>
    <div className="ly-agent-timer">{isLive ? `${hours ? `${hours}:` : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : 'Offline'}</div>
    <p className="ly-agent-session-note">{isLive ? 'Remaining in your current session' : 'Choose a duration to become visible to players'}</p>
    {isLive && <div className="ly-agent-progress" role="progressbar" aria-label="Session time remaining" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}><span style={{ width: `${percent}%` }} /></div>}
    <div className="ly-agent-duration" aria-label="Availability duration">{[15, 30, 45, 60, 120].map(value => <button key={value} type="button" aria-pressed={duration === value} disabled={!available.includes(value) || isProcessing} onClick={() => setDuration(value)}>{value >= 60 ? `${value / 60} ${value === 60 ? 'hour' : 'hours'}` : `${value} min`}</button>)}</div>
    <button className="ly-agent-primary" disabled={isProcessing || !available.includes(duration)} onClick={() => onSelectDuration(duration)}>{isProcessing ? 'Updating…' : isLive ? <><Plus size={17} />Extend availability</> : <><Clock3 size={17} />Go online</>}</button>
    {isLive && <button className="offbtn" disabled={isProcessing} onClick={onGoOffline}>Go offline</button>}
    <p className="ly-agent-session-note">{isLive ? 'Extension sets the remaining time to your selected duration.' : 'Your session ends automatically when the time runs out.'}</p>
    <div className="ly-agent-metrics"><div><b>{state.metrics.clicks_today ?? '—'}</b><small>Clicks today</small></div><div><b>{Math.floor(state.metrics.live_time_today_minutes / 60)}h {state.metrics.live_time_today_minutes % 60}m</b><small>Online today</small></div><div><b>{state.metrics.sessions_today}</b><small>Sessions</small></div></div>
  </section>;
}
