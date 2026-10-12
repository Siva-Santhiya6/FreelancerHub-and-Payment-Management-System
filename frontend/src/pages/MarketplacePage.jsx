import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjects } from '../store/slices/projectSlice';
import Pagination from '../components/common/Pagination';
import { useTranslation } from '../i18n/translations';
import {
  Search, Filter, Star, ShieldCheck, Clock, DollarSign, Tag,
  Bookmark, BookmarkCheck, Grid, List, Sparkles, ArrowRight,
  SlidersHorizontal, CheckCircle2, ChevronRight, X, User, Send,
  RefreshCw, Layers
} from 'lucide-react';

const CATEGORIES = ['All', 'Web Development', 'Mobile App', 'AI / ML', 'Design & UI/UX', 'DevOps & Cloud', 'Data Science', 'Marketing & SEO'];

const BUDGET_TIERS = [
  { label: 'All Budgets', min: 0, max: 9999999 },
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 – ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 – ₹50,000', min: 25000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: 9999999 },
];

export default function MarketplacePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: projects, loading, total, pagination } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBudgetTier, setSelectedBudgetTier] = useState(0);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Saved bookmark state
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('saved_projects') || '[]'); } catch (e) { return []; }
  });
  const [savedOnly, setSavedOnly] = useState(false);
  const [previewProject, setPreviewProject] = useState(null);

  // Fetch projects from backend API with full search, filter, sort, and pagination
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      sort: sortBy,
    };
    if (search.trim()) params.search = search.trim();
    if (selectedCategory !== 'All') params.category = selectedCategory;

    const tier = BUDGET_TIERS[selectedBudgetTier];
    if (tier.min > 0) params.minBudget = tier.min;
    if (tier.max < 9999999) params.maxBudget = tier.max;

    dispatch(fetchProjects(params));
  }, [dispatch, search, selectedCategory, selectedBudgetTier, sortBy, currentPage, pageSize]);

  const toggleSave = (id, e) => {
    e.stopPropagation();
    let updated;
    if (savedIds.includes(id)) {
      updated = savedIds.filter(i => i !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    localStorage.setItem('saved_projects', JSON.stringify(updated));
  };

  // AI match score algorithm
  const getMatchScore = (project) => {
    if (!user?.skills?.length || !project.skills?.length) return 80;
    const match = user.skills.filter(s =>
      project.skills.map(ps => ps.toLowerCase()).includes(s.toLowerCase())
    );
    const score = Math.round((match.length / project.skills.length) * 100);
    return Math.max(score, 60);
  };

  // Client-side refined filtering (for quick bookmark / verified client / client AI filter)
  const displayProjects = projects.filter(p => {
    if (verifiedOnly && !p.clientId?.isVerified) return false;
    if (savedOnly && !savedIds.includes(p._id)) return false;
    if (user?.role === 'FREELANCER' && getMatchScore(p) < minMatchScore) return false;
    return true;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedBudgetTier(0);
    setMinMatchScore(0);
    setVerifiedOnly(false);
    setSavedOnly(false);
    setSortBy('-createdAt');
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Sparkles size={13} /> {t('mainnetLive', 'AI-Powered Freelance Marketplace')}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>{t('marketplace', 'Explore Projects & Verified Contracts')}</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13.5 }}>{t('marketplaceSubtitle', 'Browse active client projects with guaranteed escrow milestone protection')}</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View mode toggle */}
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: 3, border: '1px solid var(--border)' }}>
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 10px', border: 'none' }}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 10px', border: 'none' }}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>

          {user?.role === 'CLIENT' && (
            <Link to="/projects/create" className="btn btn-primary">
              <Sparkles size={15} /> {t('postProject', 'Post New Project')}
            </Link>
          )}
        </div>
      </div>

      {/* Main Search and Query Controls Bar */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 16,
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Real-time Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search
              size={17}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by project title, keyword, required skills, or category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: 42, paddingRight: search ? 36 : 14, height: 42, fontSize: 13.5 }}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setCurrentPage(1); }}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Budget Range Dropdown */}
          <div style={{ minWidth: 160 }}>
            <select
              className="form-input"
              value={selectedBudgetTier}
              onChange={(e) => {
                setSelectedBudgetTier(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ height: 42, fontSize: 13, cursor: 'pointer' }}
            >
              {BUDGET_TIERS.map((tier, idx) => (
                <option key={idx} value={idx}>{tier.label}</option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div style={{ minWidth: 160 }}>
            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              style={{ height: 42, fontSize: 13, cursor: 'pointer' }}
            >
              <option value="-createdAt">✨ Newest First</option>
              <option value="createdAt">⏳ Oldest First</option>
              <option value="-budget">💰 Budget: High to Low</option>
              <option value="budget">💵 Budget: Low to High</option>
              <option value="title">🔤 Title (A - Z)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="btn btn-secondary btn-sm"
            style={{ height: 42, padding: '0 14px', gap: 6, fontSize: 12.5 }}
            title="Reset All Filters"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? 'none' : '1px solid var(--border)',
                  background: isActive ? 'var(--primary)' : 'var(--bg3)',
                  color: isActive ? '#fff' : 'var(--text2)',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px var(--primary-glow)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Toggles: Verified Clients, Bookmarked, AI Score Threshold */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', paddingTop: 6, borderTop: '1px solid var(--border)', fontSize: 12.5 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--text)' }}>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <ShieldCheck size={15} color="var(--primary)" /> Verified Clients Only
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--text)' }}>
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(e) => setSavedOnly(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <Bookmark size={15} color="#eab308" /> Saved Only ({savedIds.length})
          </label>

          {user?.role === 'FREELANCER' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
              <Sparkles size={14} color="var(--primary)" />
              <span style={{ color: 'var(--text3)' }}>Min AI Match: <strong>{minMatchScore}%</strong></span>
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                style={{ width: 100, accentColor: 'var(--primary)' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Projects Listing View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>Fetching marketplace projects & contracts...</p>
        </div>
      ) : displayProjects.length === 0 ? (
        <div className="empty-state" style={{ padding: 48, background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <Layers size={48} style={{ color: 'var(--text3)', margin: '0 auto 14px', opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>No Projects Matching Your Filter Criteria</h3>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4, maxWidth: 420, margin: '6px auto 16px' }}>
            Try adjusting your search query, selecting 'All' categories, or clearing budget constraints.
          </p>
          <button onClick={resetFilters} className="btn btn-primary btn-sm">
            <RefreshCw size={14} /> Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {displayProjects.map((project) => {
            const isSaved = savedIds.includes(project._id);
            const matchScore = getMatchScore(project);
            return (
              <div
                key={project._id}
                className="card project-card"
                onClick={() => navigate(`/projects/${project._id}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  padding: 20,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative',
                }}
              >
                {/* Card Header: Category & Save Bookmark */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    {project.category || 'General'}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {user?.role === 'FREELANCER' && (
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 10,
                          background: matchScore >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg3)',
                          color: matchScore >= 80 ? '#22c55e' : 'var(--text3)',
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        ⚡ {matchScore}% Match
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => toggleSave(project._id, e)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? '#eab308' : 'var(--text3)' }}
                    >
                      {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>
                </div>

                {/* Project Title & Description */}
                <h3 style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.3, marginBottom: 8, color: 'var(--text)' }}>
                  {project.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, flex: 1, marginBottom: 14 }}>
                  {project.description?.length > 130 ? project.description.substring(0, 130) + '...' : project.description}
                </p>

                {/* Skills Tags */}
                {project.skills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {project.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'var(--bg3)',
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--text2)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 4 && (
                      <span style={{ fontSize: 11, color: 'var(--text3)', alignSelf: 'center' }}>
                        +{project.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Card Footer: Budget & Client info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '1px solid var(--border)',
                    marginTop: 'auto',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text3)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                      Fixed Budget
                    </span>
                    <strong style={{ fontSize: 16, color: 'var(--primary)', fontWeight: 800 }}>
                      ₹{project.budget?.toLocaleString() || 0}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                        {project.clientId?.name || 'Verified Client'}
                        {project.clientId?.isVerified && <ShieldCheck size={13} color="var(--primary)" />}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                        ⭐ {project.clientId?.rating || 5.0} • {project.status || 'OPEN'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {displayProjects.map((project) => {
            const isSaved = savedIds.includes(project._id);
            const matchScore = getMatchScore(project);
            return (
              <div
                key={project._id}
                className="card"
                onClick={() => navigate(`/projects/${project._id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 8, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 700 }}>
                      {project.category}
                    </span>
                    {user?.role === 'FREELANCER' && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>
                        ⚡ {matchScore}% Match
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: '2px 0 4px', color: 'var(--text)' }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: 12.5, color: 'var(--text2)', margin: 0, lineClamp: 2 }}>
                    {project.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)', display: 'block', fontWeight: 600 }}>Budget</span>
                    <strong style={{ fontSize: 16, color: 'var(--primary)', fontWeight: 800 }}>
                      ₹{project.budget?.toLocaleString()}
                    </strong>
                  </div>

                  <button
                    onClick={(e) => toggleSave(project._id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? '#eab308' : 'var(--text3)' }}
                  >
                    {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                  </button>

                  <Link to={`/projects/${project._id}`} className="btn btn-secondary btn-sm" onClick={(e) => e.stopPropagation()}>
                    View Details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls Component */}
      <Pagination
        currentPage={pagination?.page || currentPage}
        totalPages={pagination?.totalPages || Math.ceil((total || displayProjects.length) / pageSize) || 1}
        totalItems={total || displayProjects.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        pageSizeOptions={[6, 12, 24, 48]}
      />
    </div>
  );
}
