import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { decodeJwt } from '../utils/jwtHelper';

const Dashboard = () => {
    const [myArticles, setMyArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found in Dashboard, redirecting to login");
            navigate('/login');
            return;
        }

        const fetchMyArticles = async () => {
            try {
                const decoded = decodeJwt(token);
                // Try and log all possible unique identifiers from the token
                const userEmail = decoded?.sub || decoded?.email || decoded?.username;
                console.log("Dashboard Debug - Token Decoded:", decoded);
                console.log("Dashboard Debug - User Identity (Email/Sub):", userEmail);

                const response = await api.get('/articles');
                console.log("Dashboard Debug - All Articles from API:", response.data);

                if (Array.isArray(response.data)) {
                    const filtered = response.data.filter(article => {
                        const authorEmail = article.author?.email;
                        const authorUsername = article.author?.username;

                        // Compare against email OR username found in token
                        const isOwner = (authorEmail && authorEmail === userEmail) ||
                            (authorUsername && authorUsername === userEmail);

                        return isOwner;
                    });
                    console.log("Dashboard Debug - Filtered Articles:", filtered);
                    setMyArticles(filtered);
                } else {
                    setMyArticles([]);
                }
            } catch (error) {
                console.error('Error fetching dashboard articles', error);
                setMyArticles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMyArticles();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
            try {
                await api.delete(`/articles/${id}`);
                setMyArticles(prev => prev.filter(article => article.id !== id));
            } catch (error) {
                console.error("Delete error:", error);
                alert("Failed to delete article. Error: " + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="flex justify-between items-center mb-4">
                <h1>My Dashboard</h1>
                <Link to="/create-article" className="btn btn-primary" id="new-article-btn" style={{ padding: '0.8rem 1.5rem', fontWeight: 'bold' }}>
                    + New Article
                </Link>
            </div>

            <div className="card mb-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '2px solid var(--primary-color)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)' }}>
                <h3 className="mb-2 flex items-center gap-2">🤖 Writing Assistant</h3>
                <p className="text-muted">You have <strong>{myArticles.length}</strong> active article(s) in the system. Use AI tools to enhance your content!</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="text-muted">Loading your workspace...</div>
                </div>
            ) : myArticles.length > 0 ? (
                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                    {myArticles.map((article) => (
                        <div key={article.id} className="card" style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                            <div className="flex justify-between items-center mb-1">
                                <span style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.8rem' }}>{article.category || 'Tech'}</span>
                                <span className="text-muted text-sm">{new Date(article.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                                <Link to={`/article/${article.id}`} style={{ color: 'var(--text-main)' }}>
                                    {article.title}
                                </Link>
                            </h3>

                            <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
                                {article.tags && article.tags.split(',').map((tag, idx) => (
                                    <span key={idx} style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-between mt-auto pt-4 border-t" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                                <Link to={`/article/${article.id}`} className="nav-link" style={{ padding: 0, fontWeight: 'bold' }}>View Live →</Link>
                                <div className="flex gap-2">
                                    <Link to={`/edit-article/${article.id}`} className="btn btn-secondary text-sm" style={{ padding: '0.4rem 0.8rem', borderColor: '#444' }}>Edit</Link>
                                    <button onClick={() => handleDelete(article.id)} className="btn btn-danger text-sm" style={{ padding: '0.4rem 0.8rem' }}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center" style={{ padding: '6rem 2rem', border: '2px dashed var(--border-color)' }}>
                    <h2 className="text-muted mb-2">No Articles Found</h2>
                    <p className="text-muted mb-4">You haven't published any articles yet. Let's change that!</p>
                    <Link to="/create-article" className="btn btn-primary" id="start-writing-btn" style={{ padding: '1rem 2rem' }}>
                        Start Your First Article
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
