import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ArticleCard = ({ article }) => {
    const [summary, setSummary] = useState(article.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.post('/articles/ai/summary', { content: article.content });
                setSummary(response.data.summary);
            } catch (error) {
                // Fallback already set
            }
        };
        if (article.content) fetchSummary();
    }, [article.content]);

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="flex justify-between items-center mb-1">
                <span className="text-muted text-sm" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{article.category}</span>
                <span className="text-muted text-sm">{new Date(article.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>
                <Link to={`/article/${article.id}`} style={{ color: 'var(--text-main)' }}>
                    {article.title}
                </Link>
            </h3>
            <p className="text-muted" style={{ flexGrow: 1, marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {summary}
            </p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                        {article.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-muted">{article.author?.username || 'User'}</span>
                </div>
                <Link to={`/article/${article.id}`} className="nav-link" style={{ padding: 0, fontWeight: 'bold' }}>Read →</Link>
            </div>
        </div>
    );
};

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await api.get('/articles');
                setArticles(response.data);
            } catch (error) {
                console.error('Error fetching articles', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const filteredArticles = articles.filter(article => {
        const matchesCategory = categoryFilter === '' || article.category === categoryFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === '' ||
            (article.title && article.title.toLowerCase().includes(searchLower)) ||
            (article.content && article.content.toLowerCase().includes(searchLower)) ||
            (article.tags && article.tags.toLowerCase().includes(searchLower));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Public Feed</h1>
                    <p className="text-muted">Explore knowledge from the community</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        style={{ width: '300px' }}
                    />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="category-select"
                        style={{ width: '180px' }}
                    >
                        <option value="">All Categories</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="DevOps">DevOps</option>
                        <option value="AI">AI & Machine Learning</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-muted">Loading articles...</p>
            ) : filteredArticles.length > 0 ? (
                <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {filteredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="card text-center" style={{ padding: '6rem 2rem', border: '1px dashed var(--border-color)' }}>
                    <h3 className="text-muted">No articles found</h3>
                    <p className="text-muted">Try a different search term or category.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
