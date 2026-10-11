import { useState, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const passwordRef = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email.trim(), password);

        if (result.ok) {
            navigate('/admin', { replace: true });
        } else {
            setError(result.error ?? 'Login failed.');
            setIsSubmitting(false);
            passwordRef.current?.focus();
            passwordRef.current?.select();
        }
    }

    return (
        <div className="login-body ly-login">
            <div className="ly-login-shell">
                <section className="ly-login-story">
                    <div className="ly-login-wordmark">BANABET</div>
                    <div><h2>A clear view.<br />A connected team.</h2><p>Your agent network, customer insights, and daily operations. All together in one workspace.</p></div>
                    <small>BANABET · AGENT OPERATIONS</small>
                </section>
                <div className="ly-login-form">
                    <div className="ly-eyebrow">WELCOME TO YOUR WORKSPACE</div>
                    <h1>Welcome back</h1>
                    <p className="lede">Sign in to manage agents and view analytics.</p>

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <label className="form-label" htmlFor="login-email">Email</label>
                            <div className="input-with-icon">
                                <Mail size={16} className="input-icon" />
                                <input
                                    type="email"
                                    id="login-email"
                                    className="form-input"
                                    placeholder="Your admin email"
                                    autoComplete="username"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <label className="form-label" htmlFor="login-password">Password</label>
                            <div className="input-with-icon">
                                <Lock size={16} className="input-icon" />
                                <input
                                    ref={passwordRef}
                                    id="login-password"
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in →'}
                        </button>
                    </form>

                    <div className="security-note">
                        <Lock size={12} aria-hidden="true" /> For authorized Banabet administrators. Use your existing account to sign in.
                    </div>
                </div>
            </div>
        </div>
    );
}
