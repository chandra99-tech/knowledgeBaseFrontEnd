import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const CreateEditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState({ title: false, content: false, tags: false });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (isEditMode) {
            const fetchArticle = async () => {
                try {
                    const response = await api.get(`/articles/${id}`);
                    setTitle(response.data.title || '');
                    setCategory(response.data.category || '');
                    setContent(response.data.content || '');
                    setTags(response.data.tags || '');
                } catch (error) {
                    console.error("Failed to fetch article", error);
                }
            };
            fetchArticle();
        }
    }, [id, isEditMode, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = { title, category, content, tags };

        try {
            if (isEditMode) {
                await api.put(`/articles/${id}`, data);
            } else {
                await api.post('/articles', data);
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save article', error);
            alert('Failed to save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAiImprove = async () => {
        if (!content) return;
        setAiLoading(prev => ({ ...prev, content: true }));
        try {
            const response = await api.post('/articles/ai/improve', { content });
            setContent(response.data.improved);
        } catch (error) {
            alert("Failed to improve content.");
        } finally {
            setAiLoading(prev => ({ ...prev, content: false }));
        }
    };

    const handleAiSuggestTitle = async () => {
        if (!content) {
            alert("Please write some content first.");
            return;
        }
        setAiLoading(prev => ({ ...prev, title: true }));
        try {
            const response = await api.post('/articles/ai/title', { content });
            setTitle(response.data.title);
        } catch (error) {
            alert("Failed to suggest title.");
        } finally {
            setAiLoading(prev => ({ ...prev, title: false }));
        }
    };

    const handleAiSuggestTags = async () => {
        if (!content) return;
        setAiLoading(prev => ({ ...prev, tags: true }));
        try {
            const response = await api.post('/articles/ai/tags', { content });
            setTags(response.data.tags.join(', '));
        } catch (error) {
            alert("Failed to suggest tags.");
        } finally {
            setAiLoading(prev => ({ ...prev, tags: false }));
        }
    };

    const aiButtonStyle = {
        padding: '0.4rem 1rem',
        fontSize: '0.85rem',
        borderRadius: '0.5rem',
        border: '2px solid var(--primary-color)',
        backgroundColor: 'var(--bg-color)',
        color: 'white',
        fontWeight: 'bold',
        marginLeft: '1rem',
        cursor: 'pointer',
        boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
    };

    return (
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto', border: '1px solid #444' }}>
            <h2 className="mb-4" style={{ borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                {isEditMode ? 'Edit Article' : 'Create New Article'}
            </h2>
            <form onSubmit={handleSubmit}>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>ARTICLE TITLE</label>
                        <button type="button" onClick={handleAiSuggestTitle} style={aiButtonStyle} disabled={aiLoading.title} id="ai-title-btn">
                            {aiLoading.title ? 'Thinking...' : '✨ Auto-Generate Title'}
                        </button>
                    </div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter a catchy title..."
                        id="title-input"
                        style={{ fontSize: '1.2rem', padding: '1rem' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="form-label" style={{ fontWeight: 'bold' }}>CATEGORY</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required id="category-select" style={{ padding: '0.8rem' }}>
                        <option value="">Select a category</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="DevOps">DevOps</option>
                        <option value="AI">AI & Machine Learning</option>
                        <option value="Mobile">Mobile Development</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>CONTENT</label>
                        <button type="button" onClick={handleAiImprove} style={aiButtonStyle} disabled={aiLoading.content} id="ai-improve-btn">
                            {aiLoading.content ? 'Polishing...' : '🤖 Improve with AI'}
                        </button>
                    </div>
                    {/* Replaced ReactQuill with textarea temporarily to fix crash */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ height: '400px', width: '100%', padding: '1rem', fontFamily: 'inherit', fontSize: '1.1rem', backgroundColor: '#1e293b', color: 'white' }}
                        placeholder="Start writing your article here... HTML tags are supported."
                        required
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>TAGS</label>
                        <button type="button" onClick={handleAiSuggestTags} style={aiButtonStyle} disabled={aiLoading.tags} id="ai-tags-btn">
                            {aiLoading.tags ? 'Analyzing...' : '🏷️ Suggest AI Tags'}
                        </button>
                    </div>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g. react, nodejs, tutorial"
                        id="tags-input"
                    />
                </div>

                <div className="flex gap-4 mt-8" style={{ marginTop: '3rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading} id="save-article-btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        {loading ? 'Processing...' : (isEditMode ? 'Update Article' : 'Publish Article')}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} id="cancel-btn">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEditArticle;
