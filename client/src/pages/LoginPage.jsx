import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = async (email) => {
        setEmail(email);
        setPassword('Test@1234');
        setError('');
        setLoading(true);
        try {
            await login(email, 'Test@1234');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card fade-in">
                <div className="auth-logo">
                    <img src="/logo.png" alt="TrustEdge" style={{ width: 64, height: 64, marginBottom: 8, borderRadius: 16 }} />
                    <h1>TrustEdge</h1>
                    <p>The Human Banking Platform</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@trustedge.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-link">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>

                {/* Quick Login for Demo */}
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12 }}>
                        DEMO QUICK LOGIN
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickLogin('arjun@trustedge.com')}>
                            👤 Customer
                        </button>

                        <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickLogin('admin@trustedge.com')}>
                            ⚙️ Admin
                        </button>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <a href="https://youtu.be/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', color: 'white', border: 'none', fontWeight: 'bold' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            Watch 2-Minute Demo Video
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
