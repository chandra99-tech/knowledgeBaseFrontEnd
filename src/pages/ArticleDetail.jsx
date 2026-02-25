import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { decodeJwt } from '../utils/jwtHelper';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/articles/${id}`);
                setArticle(response.data);

                // Check if current user is owner
                const token = localStorage.getItem('token');
                if (token && response.data.author) {
                    const decoded = decodeJwt(token);
                    const userEmail = decoded?.sub || decoded?.email;
                    if (userEmail && userEmail === response.data.author.email) {
                        setIsOwner(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching article', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await api.delete(`/articles/${id}`);
                navigate('/dashboard');
            } catch (error) {
                alert("Failed to delete article.");
            }
        }
    };

    if (loading) return <div className="text-center mt-4">Loading article...</div>;
    if (!article) return <div className="text-center mt-4 card">Article not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>

            <div className="mb-4">
                <Link to="/" className="nav-link" style={{ padding: 0 }}>← Back to Home</Link>
            </div>

            <div className="card mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.2rem 0.8rem', borderRadius: '1rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 500 }}>
                        {article.category || 'Tech'}
                    </span>
                    <span className="text-muted text-sm">
                        {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>{article.title}</h1>

                <div className="flex justify-between items-center pb-4 mb-4 border-b" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-2">
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {(article.author?.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>{article.author?.username || 'Unknown Author'}</div>
                            <div className="text-muted text-sm">{article.author?.email || 'Anonymous'}</div>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="flex gap-2">
                            <Link to={`/edit-article/${article.id}`} className="btn btn-secondary text-sm">Edit</Link>
                            <button onClick={handleDelete} className="btn btn-danger text-sm">Delete</button>
                        </div>
                    )}
                </div>

                {/* AI Action Area */}
                {isOwner && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: '0.5rem', border: '1px dashed var(--primary-color)' }}>
                        <span className="flex items-center gap-2" style={{ color: 'var(--primary-color)' }}>🤖 <strong>AI Toolkit is active.</strong> You can improve this content from the <Link to={`/edit-article/${article.id}`} style={{ textDecoration: 'underline' }}>Edit Mode</Link></span>
                    </div>
                )}

                <div className="article-content" style={{ fontSize: '1.125rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: article.content }} />

                <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <strong className="text-muted" style={{ marginRight: '0.5rem', alignSelf: 'center' }}>Tags:</strong>
                    {article.tags && article.tags.split(',').map((tag, idx) => (
                        <span key={idx} style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.875rem' }}>
                            {tag.trim()}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
