import PageBoundary from './PageBoundary';
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Activity, ArrowUpRight, BarChart3, CreditCard, LayoutDashboard, LogOut, Menu, Megaphone, Moon, Search, Settings, Sun, Users, X, Banknote, Grid, Globe, UsersRound } from 'lucide-react';

const sections = [
    { label: 'Operations', items: [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/agents', label: 'Agent network', icon: Users },
        { path: '/admin/notices', label: 'Communications', icon: Megaphone },
        { path: '/admin/activity', label: 'Activity log', icon: Activity },
    ] },
    { label: 'Insights', items: [
        { path: '/admin/analytics/overview', label: 'Performance', icon: BarChart3 },
        { path: '/admin/analytics/agents', label: 'Agent insights', icon: UsersRound },
        { path: '/admin/analytics/customers', label: 'Customer traffic', icon: Globe },
        { path: '/admin/analytics/coverage', label: 'Coverage', icon: Grid },
        { path: '/admin/analytics/withdrawals', label: 'Withdrawals', icon: Banknote },
    ] },
    { label: 'Configuration', items: [
        { path: '/admin/payment-methods', label: 'Payment methods', icon: CreditCard },
        { path: '/admin/settings', label: 'Settings & account', icon: Settings },
    ] },
];
const destinations = sections.flatMap(s => s.items);

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [logoutError, setLogoutError] = useState('');
    const [loggingOut, setLoggingOut] = useState(false);
    const [theme, setTheme] = useState(() => { try { return localStorage.getItem('banabet-admin-theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; } });
    const menuRef = useRef<HTMLElement>(null);
    const menuButton = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);
    const displayName = user?.name === 'Kidus' ? 'Liyu' : user?.name ?? 'Liyu';
    const current = destinations.find(d => d.path === location.pathname);
    const analyticsSearch = location.pathname.startsWith('/admin/analytics') ? location.search : '';
    useEffect(() => { setMenuOpen(false); setSearchOpen(false); setQuery(''); }, [location.pathname]);
    useEffect(() => {
        document.documentElement.dataset.adminTheme = theme;
        try { localStorage.setItem('banabet-admin-theme', theme); } catch { /* Private browsing may block storage. */ }
    }, [theme]);
    useEffect(() => {
        function keydown(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchInput.current?.focus(); setSearchOpen(true); }
            if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); }
        }
        function outside(e: MouseEvent) { if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false); }
        document.addEventListener('keydown', keydown); document.addEventListener('click', outside);
        return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('click', outside); };
    }, []);
    useEffect(() => {
        if (!menuOpen) return;
        const previous = document.activeElement as HTMLElement | null;
        const oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
        function trap(e: KeyboardEvent) {
            if (e.key !== 'Tab') return;
            const items = menuRef.current?.querySelectorAll<HTMLElement>('a, button:not(:disabled)');
            if (!items?.length) return;
            const first = items[0], last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
        document.addEventListener('keydown', trap);
        return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', trap); previous?.focus(); };
    }, [menuOpen]);
    async function signOut() {
        setLoggingOut(true); setLogoutError('');
        try { await logout(); navigate('/admin/login', { replace: true }); }
        catch { setLogoutError('Could not sign out. Please try again.'); }
        finally { setLoggingOut(false); }
    }
    function openResult(path: string) { navigate(path); setSearchOpen(false); setQuery(''); }
    const matches = destinations.filter(d => d.label.toLowerCase().includes(query.toLowerCase()));
    return <div className="app ly-office">
        <a className="ly-skip" href="#workspace-content">Skip to content</a>
        {menuOpen && <button className="ly-nav-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
        <aside ref={menuRef} className={`sidebar ly-sidebar${menuOpen ? ' is-open' : ''}`} aria-label="Backoffice navigation" aria-modal={menuOpen || undefined} role={menuOpen ? 'dialog' : undefined}>
            <div className="ly-brand"><NavLink to="/admin" aria-label="Banabet overview">BANA<span>BET</span><small>OPERATIONS</small></NavLink><button className="ly-mobile-close ly-icon" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
            <div className="ly-workspace"><span className="ly-workspace-dot" /><div><b>Agent operations</b><small>Banabet workspace</small></div></div>
            <nav>{sections.map(section => <div className="ly-nav-group" key={section.label}><div className="nav-label">{section.label}</div>{section.items.map(({ path, label, icon: Icon }) => <NavLink key={path} to={path + (path.startsWith('/admin/analytics') ? analyticsSearch : '')} end={path === '/admin'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><Icon size={18} /><span>{label}</span></NavLink>)}</div>)}</nav>
            <div className="ly-sidebar-footer"><div className="ly-user"><span className="ly-user-avatar">{displayName.charAt(0).toUpperCase()}</span><div><b>{displayName}</b><small>Administrator</small></div></div><button className="ly-signout" disabled={loggingOut} onClick={signOut}><LogOut size={16} />{loggingOut ? 'Signing out…' : 'Sign out'}</button>{logoutError && <p className="ly-error" role="alert">{logoutError}</p>}</div>
        </aside>
        <div className="ly-workspace-main">
            <header className="ly-topbar"><div className="ly-breadcrumb"><button ref={menuButton} className="ly-icon ly-menu" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={21} /></button><span>Workspace</span><span className="ly-slash">/</span><b>{current?.label ?? 'Overview'}</b></div><div className="ly-top-actions"><div className="ly-search" ref={searchRef} onClick={() => { searchInput.current?.focus(); setSearchOpen(true); }}><Search size={16} /><input ref={searchInput} value={query} onFocus={() => setSearchOpen(true)} onChange={e => { setQuery(e.target.value); setSearchOpen(true); }} onKeyDown={e => { if (e.key === 'Enter' && matches[0]) openResult(matches[0].path); }} aria-label="Find a backoffice page" placeholder="Find a page…" aria-expanded={searchOpen} aria-controls="ly-search-results" /><kbd>Ctrl K</kbd>{searchOpen && <div id="ly-search-results" className="ly-search-results"><small>GO TO PAGE</small>{matches.length ? matches.map(d => <button key={d.path} onClick={() => openResult(d.path)}><d.icon size={16} />{d.label}<ArrowUpRight size={14} /></button>) : <p>No pages found.</p>}</div>}</div><button className="ly-icon" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button></div></header>
            <main id="workspace-content" className="main ly-content"><PageBoundary key={location.pathname}><Outlet /></PageBoundary></main>
            <footer className="ly-workspace-footer"><span>Banabet · Agent operations</span><span>Africa/Addis Ababa · EAT</span></footer>
        </div>
        <nav className="ly-bottom-nav" aria-label="Quick navigation"><NavLink to="/admin" end><LayoutDashboard size={20} /><span>Overview</span></NavLink><NavLink to="/admin/agents"><Users size={20} /><span>Agents</span></NavLink><NavLink to="/admin/analytics/overview"><BarChart3 size={20} /><span>Insights</span></NavLink><button onClick={() => setMenuOpen(true)}><Menu size={20} /><span>More</span></button></nav>
    </div>;
}
