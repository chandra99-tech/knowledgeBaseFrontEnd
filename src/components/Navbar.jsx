import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Update auth state whenever the location changes (route switch)
    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('token'));
    }, [location]);

    const handleLogout = () => {
        // Token Invalidation: Remove from localStorage
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand">
                    <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px var(--primary-color))' }}>✨</span>
                    <span style={{ background: 'linear-gradient(to right, #fff, var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
                        KnowledgeBase
                    </span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>My Articles</Link>
                            <Link to="/create-article" className={`nav-link ${location.pathname === '/create-article' ? 'active' : ''}`}>New Article</Link>
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary text-sm"
                                style={{ padding: '0.5rem 1.2rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="btn btn-primary text-sm" style={{ padding: '0.5rem 1.2rem', borderRadius: '2rem', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
