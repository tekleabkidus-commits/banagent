import { Component, type ErrorInfo, type ReactNode } from 'react';
export default class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    componentDidCatch(error: Error, info: ErrorInfo) { console.error('Workspace page failed', error, info.componentStack); }
    render() {
        if (!this.state.failed) return this.props.children;
        return <section className="panel"><div className="ly-empty" role="alert"><h2>This page couldn’t open.</h2><p>Your account is still signed in. Reload this page or choose another section.</p><button className="btn btn-primary" onClick={() => window.location.reload()}>Reload page</button></div></section>;
    }
}
