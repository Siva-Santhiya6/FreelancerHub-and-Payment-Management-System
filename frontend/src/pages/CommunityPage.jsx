import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import {
  MessageSquare, ThumbsUp, Plus, Sparkles, User, Tag,
  Clock, Share2, HelpCircle, ArrowRight, CheckCircle2, X
} from 'lucide-react';

const samplePosts = [
  {
    id: 1,
    author: 'Raj Freelancer',
    role: 'Lead Architect',
    title: 'Best practices for securing Node.js APIs & JWT tokens in 2026',
    category: 'Architecture',
    content: 'When designing multi-tenant freelance platforms, always sign JWT with short expiration and implement refresh token rotation in HTTP-only cookies with helmet security.',
    upvotes: 42,
    replies: 12,
    time: '2 hours ago',
    tags: ['Node.js', 'Security', 'JWT']
  },
  {
    id: 2,
    author: 'Ananya Sharma',
    role: 'UI/UX Lead',
    title: 'How to build Dark Mode design systems with CSS Variables & HSL colors',
    category: 'Design Systems',
    content: 'Using CSS custom properties with data-theme attributes allows instant theme toggling without flickering or duplicate stylesheet downloads.',
    upvotes: 38,
    replies: 9,
    time: '5 hours ago',
    tags: ['CSS', 'Design', 'Dark Mode']
  },
  {
    id: 3,
    author: 'Sarah Client',
    role: 'Startup Founder',
    title: 'What clients look for in a winning freelance proposal',
    category: 'Client Insights',
    content: 'A winning proposal doesn’t just copy paste. It highlights the exact milestone roadmap and demonstrates clear understanding of the business problem.',
    upvotes: 56,
    replies: 18,
    time: '1 day ago',
    tags: ['Freelancing', 'Proposals', 'Tips']
  }
];

export default function CommunityPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [posts, setPosts] = useState(samplePosts);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', category: 'Architecture', content: '', tags: '' });
  const [upvotedIds, setUpvotedIds] = useState([]);

  const handleUpvote = (id, e) => {
    e.stopPropagation();
    if (upvotedIds.includes(id)) {
      setUpvotedIds(upvotedIds.filter(i => i !== id));
      setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes - 1 } : p));
    } else {
      setUpvotedIds([...upvotedIds, id]);
      setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    const post = {
      id: Date.now(),
      author: user?.name || 'Community Member',
      role: user?.role || 'FREELANCER',
      title: newPost.title,
      category: newPost.category,
      content: newPost.content,
      upvotes: 1,
      replies: 0,
      time: 'Just now',
      tags: newPost.tags ? newPost.tags.split(',').map(t => t.trim()) : ['Discussion']
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', category: 'Architecture', content: '', tags: '' });
    setModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Sparkles size={12} /> {t('freelanceNetwork', 'Freelance Knowledge & Network')}
          </div>
          <h1>{t('communityForum', 'Community & Developer Hub')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('communitySubtitle', 'Connect with top engineers, share architectural tips, discuss project leads, and collaborate')}</p>
        </div>

        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={15} /> {t('startDiscussion', 'Start Discussion')}
        </button>
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.map(post => {
          const isUpvoted = upvotedIds.includes(post.id);
          return (
            <div key={post.id} className="card card-hover" style={{ padding: '22px 26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{post.author}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{post.role} • {post.time}</div>
                  </div>
                </div>

                <span className="badge badge-purple">{post.category}</span>
              </div>

              <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>
                {post.title}
              </h2>

              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>
                {post.content}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <button
                    onClick={(e) => handleUpvote(post.id, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: isUpvoted ? 'var(--primary-light)' : 'var(--bg3)',
                      border: `1px solid ${isUpvoted ? 'var(--primary)' : 'var(--border)'}`,
                      color: isUpvoted ? 'var(--primary)' : 'var(--text2)',
                      borderRadius: 20,
                      padding: '5px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <ThumbsUp size={13} fill={isUpvoted ? 'var(--primary)' : 'none'} /> {post.upvotes} {t('upvotes', 'Upvotes')}
                  </button>

                  <span style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MessageSquare size={13} /> {post.replies} {t('replies', 'Replies')}
                  </span>
                </div>

                <button className="btn btn-outline btn-sm" onClick={() => alert('Reply thread opened!')}>
                  {t('joinDiscussion', 'Join Discussion')} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>{t('startCommunityDiscussion', 'Start Community Discussion')}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">{t('discussionTitle', 'Discussion Title')}</label>
                <input className="form-input" required placeholder="e.g. Best state management pattern in React 18" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t('category', 'Category')}</label>
                <select className="form-select" value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}>
                  <option value="Architecture">Architecture</option>
                  <option value="Design Systems">Design Systems</option>
                  <option value="Client Insights">Client Insights</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Career & Bidding">Career & Bidding</option>
                </select>
              </div>

              <div>
                <label className="form-label">{t('contentAndInsights', 'Content & Insights')}</label>
                <textarea className="form-textarea" required rows={4} placeholder="Share your experience, solution, or question..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} />
              </div>

              <div>
                <label className="form-label">{t('tagsCommaSeparated', 'Tags (comma separated)')}</label>
                <input className="form-input" placeholder="e.g. React, Node, Cloud" value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>{t('cancel', 'Cancel')}</button>
                <button type="submit" className="btn btn-primary"><MessageSquare size={14} /> {t('publishPost', 'Publish Post')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
