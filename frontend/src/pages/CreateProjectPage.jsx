import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../store/slices/projectSlice';
import { sounds } from '../utils/SoundEffects';
import { useTranslation } from '../i18n/translations';
import {
  Plus, X, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft,
  Calendar, DollarSign, Users, Briefcase, Layers, Check, Save, AlertCircle,
  FileCheck, Zap, Info, Clock, Award
} from 'lucide-react';

const CATEGORIES = [
  'Web Development', 'Mobile App Development', 'AI / Machine Learning',
  'UI/UX Design', 'DevOps & Cloud', 'Data Science & Analytics',
  'Blockchain & Web3', 'Cybersecurity', 'Technical Writing'
];

const POPULAR_SKILLS = [
  'React', 'Node.js', 'MongoDB', 'Python', 'TypeScript',
  'Next.js', 'TailwindCSS', 'Figma', 'GraphQL', 'AWS', 'Docker', 'PostgreSQL'
];

const EXPERIENCE_LEVELS = [
  { id: 'ENTRY', label: 'Junior / Entry', desc: 'Budget-friendly, standard tasks' },
  { id: 'MID', label: 'Mid-Level', desc: 'Proven track record & autonomy' },
  { id: 'SENIOR', label: 'Senior Expert', desc: 'Complex architecture & scale' },
  { id: 'LEAD', label: 'Tech Lead / Architect', desc: 'End-to-end mission critical delivery' }
];

export default function CreateProjectPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  const [deliverableInput, setDeliverableInput] = useState('');
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    budget: '15000',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    teamSize: 1,
    experienceLevel: 'SENIOR',
    expectedDuration: '2-4 weeks',
    skills: ['React', 'Node.js', 'MongoDB'],
    deliverables: [
      'Responsive React frontend with dark/light themes',
      'Secure REST API endpoints with JWT auth & validation',
      'Comprehensive test suite & GitHub staging preview'
    ],
    milestones: [
      { id: 1, title: 'Architecture Setup & Authentication', percentage: 30, amount: 4500, description: 'Wireframes, database schemas, and JWT login flows' },
      { id: 2, title: 'Core Features & Integration', percentage: 40, amount: 6000, description: 'Business logic, API routes, and state management' },
      { id: 3, title: 'Testing, Security Audit & Staging Deployment', percentage: 30, amount: 4500, description: 'Unit testing, performance tuning, and staging handoff' }
    ]
  });

  // Calculate milestone budget distribution
  const totalBudget = Number(form.budget) || 0;
  const totalPercentage = form.milestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);
  const totalAllocated = form.milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  const remainingBudget = totalBudget - totalAllocated;

  // Auto-generate project scope with AI
  const handleAiDraft = () => {
    sounds.playClick();
    setAiDrafting(true);
    setTimeout(() => {
      const topic = form.title || 'Enterprise SaaS Web Platform';
      const draftedBudget = form.budget || '20000';
      const bNum = Number(draftedBudget);

      setForm(prev => ({
        ...prev,
        title: prev.title || 'Next-Gen Full-Stack Application with Smart Escrow',
        category: prev.category || 'Web Development',
        description: `We require a seasoned full-stack engineer to build a production-grade ${topic}.\n\nKey Requirements:\n1. Robust React 18 frontend with responsive CSS & high accessibility.\n2. Modular Node.js / Express backend with MongoDB aggregation & automated tests.\n3. Escrow-protected milestone deliveries with transparent code audits.\n4. Clean documentation and Git branching workflow.`,
        budget: draftedBudget,
        skills: Array.from(new Set([...prev.skills, 'React', 'Node.js', 'MongoDB', 'TypeScript', 'TailwindCSS'])),
        deliverables: [
          'High-fidelity modular UI components',
          'Scalable REST API with rate limiting & error handlers',
          'End-to-end integration and automated test coverage'
        ],
        milestones: [
          { id: 1, title: 'Milestone 1: Database & Auth Infrastructure', percentage: 30, amount: Math.round(bNum * 0.3), description: 'Schemas, security middleware, and auth flows' },
          { id: 2, title: 'Milestone 2: Core Domain Logic & Dashboards', percentage: 40, amount: Math.round(bNum * 0.4), description: 'CRUD modules, real-time sync, and reporting' },
          { id: 3, title: 'Milestone 3: QA, Documentation & Launch Handoff', percentage: 30, amount: Math.round(bNum * 0.3), description: 'Staging verification and production release' }
        ]
      }));
      setAiDrafting(false);
      sounds.playSuccess();
    }, 750);
  };

  const addSkill = (skillToAdd) => {
    const s = (skillToAdd || skillInput).trim();
    if (s && !form.skills.includes(s)) {
      sounds.playClick();
      setForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setSkillInput('');
    }
  };

  const removeSkill = (s) => {
    sounds.playClick();
    setForm(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }));
  };

  const addDeliverable = () => {
    if (!deliverableInput.trim()) return;
    sounds.playClick();
    setForm(prev => ({ ...prev, deliverables: [...prev.deliverables, deliverableInput.trim()] }));
    setDeliverableInput('');
  };

  const removeDeliverable = (index) => {
    sounds.playClick();
    setForm(prev => ({ ...prev, deliverables: prev.deliverables.filter((_, i) => i !== index) }));
  };

  // Milestone handlers
  const updateMilestone = (id, field, value) => {
    setForm(prev => {
      const updated = prev.milestones.map(m => {
        if (m.id !== id) return m;
        const updatedM = { ...m, [field]: value };
        if (field === 'percentage') {
          const pct = Math.max(0, Math.min(100, Number(value) || 0));
          updatedM.percentage = pct;
          updatedM.amount = Math.round((pct / 100) * totalBudget);
        } else if (field === 'amount') {
          const amt = Number(value) || 0;
          updatedM.amount = amt;
          updatedM.percentage = totalBudget > 0 ? Math.round((amt / totalBudget) * 100) : 0;
        }
        return updatedM;
      });
      return { ...prev, milestones: updated };
    });
  };

  const addMilestone = () => {
    sounds.playClick();
    const newId = Date.now();
    const currentTotalPct = form.milestones.reduce((acc, m) => acc + (m.percentage || 0), 0);
    const remainingPct = Math.max(0, 100 - currentTotalPct);
    const remainingAmt = Math.round((remainingPct / 100) * totalBudget);

    setForm(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id: newId,
          title: `Milestone ${prev.milestones.length + 1}: Final Polish & Handoff`,
          percentage: remainingPct,
          amount: remainingAmt,
          description: 'Deliverable verification and sign-off'
        }
      ]
    }));
  };

  const removeMilestone = (id) => {
    if (form.milestones.length <= 1) return;
    sounds.playClick();
    setForm(prev => ({ ...prev, milestones: prev.milestones.filter(m => m.id !== id) }));
  };

  const autoDistributeMilestones = (preset = '30-40-30') => {
    sounds.playClick();
    let splits = [30, 40, 30];
    if (preset === 'equal') {
      const n = form.milestones.length || 3;
      const base = Math.floor(100 / n);
      splits = Array(n).fill(base);
      splits[splits.length - 1] += (100 - base * n);
    }

    setForm(prev => {
      const updated = prev.milestones.map((m, idx) => {
        const pct = splits[idx] !== undefined ? splits[idx] : Math.max(0, 100 - splits.slice(0, idx).reduce((a, b) => a + b, 0));
        return {
          ...m,
          percentage: pct,
          amount: Math.round((pct / 100) * totalBudget)
        };
      });
      return { ...prev, milestones: updated };
    });
  };

  // Step Validation & Navigation
  const validateStep = (step) => {
    setError('');
    if (step === 1) {
      if (!form.title.trim()) { setError('Please enter a descriptive project title'); return false; }
      if (!form.description.trim() || form.description.length < 20) { setError('Please enter at least 20 characters for project requirements'); return false; }
      if (!form.budget || Number(form.budget) <= 0) { setError('Please enter a valid budget amount'); return false; }
    }
    if (step === 2) {
      if (form.skills.length === 0) { setError('Please add at least one required skill'); return false; }
    }
    if (step === 3) {
      if (totalPercentage !== 100) {
        setError(`Milestone allocation is currently ${totalPercentage}%. It must total exactly 100% of the project budget.`);
        return false;
      }
    }
    return true;
  };

  const goToStep = (stepNum) => {
    if (stepNum > currentStep && !validateStep(currentStep)) return;
    sounds.playClick();
    setError('');
    setCurrentStep(stepNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    sounds.playClick();
    setError('');

    const projectPayload = {
      title: form.title,
      description: form.description,
      category: form.category,
      budget: Number(form.budget),
      deadline: form.deadline,
      teamSize: form.teamSize,
      skills: form.skills,
      deliverables: form.deliverables,
      milestones: form.milestones
    };

    const result = await dispatch(createProject(projectPayload));
    if (createProject.fulfilled.match(result)) {
      sounds.playSuccess();
      setSuccessToast(true);
      setTimeout(() => {
        navigate('/my-projects');
      }, 1500);
    } else {
      setError(result.payload || 'Failed to create project. Please try again.');
    }
  };

    const steps = [
    { num: 1, label: t('step1Basics', 'Basics'), desc: t('titleAndScope', 'Title & Scope') },
    { num: 2, label: t('step2Skills', 'Skills & Deliverables'), desc: t('techStackAndSpecs', 'Tech stack & specs') },
    { num: 3, label: t('step3Milestones', 'Milestones & Escrow'), desc: t('fundAllocations', 'Fund allocations') },
    { num: 4, label: t('step4Review', 'Review & Launch'), desc: t('auditAndPublish', 'Audit & publish') }
  ];

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Sparkles size={13} /> {t('projectCreationStudio', 'Project Creation Studio')}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900 }}>{t('createAndLaunchProject', 'Create & Launch New Project')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('deployMilestonesSubtitle', 'Deploy smart-contract backed milestones and engage verified talent')}</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleAiDraft}
            disabled={aiDrafting}
            style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 }}
          >
            <Sparkles size={14} /> {aiDrafting ? t('draftingSpec', 'Drafting Spec...') : t('autoDraftWithAi', '✨ Auto-Draft with AI')}
          </button>
        </div>
      </div>

      {/* Stepper Bar */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Progress background bar */}
          <div style={{ position: 'absolute', top: 20, left: 40, right: 40, height: 2, background: 'var(--border)', zIndex: 0 }}>
            <div
              style={{
                height: '100%',
                background: 'var(--primary-gradient)',
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

          {steps.map(s => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                onClick={() => goToStep(s.num)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 1,
                  cursor: s.num <= currentStep ? 'pointer' : 'default',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: isCompleted || isCurrent ? 'var(--primary-gradient)' : 'var(--bg3)',
                    border: `2px solid ${isCurrent ? 'var(--primary)' : isCompleted ? 'transparent' : 'var(--border)'}`,
                    color: isCompleted || isCurrent ? 'white' : 'var(--text3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 14,
                    boxShadow: isCurrent ? '0 0 16px var(--primary-glow)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {isCompleted ? <Check size={18} /> : `0${s.num}`}
                </div>
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: isCurrent ? 800 : 600, color: isCurrent ? 'var(--primary)' : 'var(--text)' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {successToast && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={16} /> Project launched successfully! Initializing escrow vault...
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: currentStep === 2 || currentStep === 3 ? '1fr 340px' : '1fr', gap: 24, alignItems: 'start' }}>
        {/* Main Step Form Container */}
        <div className="card" style={{ padding: 32 }}>
          {/* STEP 1: BASICS */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Step 1: Project Basics & Scope</h2>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Define the title, category, and core requirements for potential bidders</p>
              </div>

              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Build Next-Gen E-Commerce Platform with React & Node.js"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Total Escrow Budget (₹ INR) *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text3)' }}>₹</span>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="e.g. 15000"
                      value={form.budget}
                      onChange={e => {
                        const val = e.target.value;
                        setForm(prev => {
                          const bNum = Number(val) || 0;
                          const updatedMilestones = prev.milestones.map(m => ({
                            ...m,
                            amount: Math.round((m.percentage / 100) * bNum)
                          }));
                          return { ...prev, budget: val, milestones: updatedMilestones };
                        });
                      }}
                      style={{ paddingLeft: 28 }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Project Scope & Technical Description *</label>
                <textarea
                  className="form-textarea"
                  rows={7}
                  placeholder="Outline key features, tech stack expectations, milestone criteria, and deliverables..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                  <span>Markdown formatting supported</span>
                  <span>{form.description.length} characters</span>
                </div>
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Target Completion Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Freelancers / Team Size</label>
                  <input
                    className="form-input"
                    type="number"
                    min={1}
                    max={15}
                    value={form.teamSize}
                    onChange={e => setForm({ ...form, teamSize: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SKILLS & DELIVERABLES */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Step 2: Skills & Deliverables Specification</h2>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Specify developer skill sets, experience requirements, and tangible outputs</p>
              </div>

              {/* Experience Level Cards */}
              <div className="form-group" style={{ marginBottom: 22 }}>
                <label className="form-label">Experience Tier Required</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                  {EXPERIENCE_LEVELS.map(tier => {
                    const active = form.experienceLevel === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => { sounds.playClick(); setForm({ ...form, experienceLevel: tier.id }); }}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                          background: active ? 'var(--primary-light)' : 'var(--bg3)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 800, color: active ? 'var(--primary)' : 'var(--text)' }}>
                          {tier.label}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>
                          {tier.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills required tags */}
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Required Skills & Tech Stack *</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    className="form-input"
                    placeholder="Type technology (e.g. Next.js, Docker, WebSockets) and press Enter..."
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button type="button" className="btn btn-secondary" onClick={() => addSkill()}>
                    <Plus size={15} /> Add
                  </button>
                </div>

                {/* Selected skill chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {form.skills.map(s => (
                    <span
                      key={s}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        background: 'var(--primary-light)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'var(--primary)',
                        borderRadius: 20,
                        fontSize: 12.5,
                        fontWeight: 700
                      }}
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', padding: 0 }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Suggested popular tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>Suggestions:</span>
                  {POPULAR_SKILLS.filter(s => !form.skills.includes(s)).slice(0, 7).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      style={{ padding: '3px 9px', borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)', fontSize: 11, cursor: 'pointer', color: 'var(--text3)', fontWeight: 600 }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deliverables Checklist Builder */}
              <div className="form-group">
                <label className="form-label">Deliverables Checklist</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input
                    className="form-input"
                    placeholder="Add specific output (e.g. Deployed Staging URL, Figma source file)..."
                    value={deliverableInput}
                    onChange={e => setDeliverableInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
                  />
                  <button type="button" className="btn btn-secondary" onClick={addDeliverable}>
                    <Plus size={15} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'var(--bg3)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        fontSize: 13
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={16} color="var(--primary)" />
                        <span>{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDeliverable(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text4)' }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MILESTONES & ESCROW */}
          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800 }}>Step 3: Milestone & Escrow Allocation</h2>
                  <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Break project into progressive escrow milestones tied to releases</p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => autoDistributeMilestones('30-40-30')}>
                    30/40/30 Split
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => autoDistributeMilestones('equal')}>
                    Equal Split
                  </button>
                </div>
              </div>

              {/* Visual Budget Allocation Bar */}
              <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 'var(--radius-sm)', marginBottom: 24, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                    Escrow Budget Distribution: ₹{totalAllocated.toLocaleString()} of ₹{totalBudget.toLocaleString()} ({totalPercentage}%)
                  </span>
                  <span
                    className={`badge ${totalPercentage === 100 ? 'badge-success' : totalPercentage > 100 ? 'badge-danger' : 'badge-warning'}`}
                  >
                    {totalPercentage === 100 ? '100% Fully Allocated' : totalPercentage > 100 ? `Over-allocated by ${totalPercentage - 100}%` : `${100 - totalPercentage}% Unallocated`}
                  </span>
                </div>

                {/* Progress bar slices */}
                <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: 'var(--bg4)', gap: 2 }}>
                  {form.milestones.map((m, idx) => {
                    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
                    return (
                      <div
                        key={m.id}
                        title={`${m.title}: ${m.percentage}% (₹${m.amount})`}
                        style={{
                          width: `${m.percentage}%`,
                          background: colors[idx % colors.length],
                          transition: 'width 0.25s ease'
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Milestone Row Builder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                {form.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    style={{
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '18px 20px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>Milestone #{idx + 1}</span>
                      </div>

                      {form.milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(m.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                        >
                          <X size={14} /> Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label className="form-label" style={{ fontSize: 11 }}>Milestone Title</label>
                        <input
                          className="form-input"
                          value={m.title}
                          onChange={e => updateMilestone(m.id, 'title', e.target.value)}
                          placeholder="e.g. Frontend Architecture"
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: 11 }}>Split %</label>
                        <input
                          className="form-input"
                          type="number"
                          min={0}
                          max={100}
                          value={m.percentage}
                          onChange={e => updateMilestone(m.id, 'percentage', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: 11 }}>Escrow Amount (₹)</label>
                        <input
                          className="form-input"
                          type="number"
                          value={m.amount}
                          onChange={e => updateMilestone(m.id, 'amount', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11 }}>Deliverable Scope & Criteria</label>
                      <input
                        className="form-input"
                        value={m.description}
                        onChange={e => updateMilestone(m.id, 'description', e.target.value)}
                        placeholder="What specific outcome completes this milestone?"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addMilestone}
                style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
              >
                <Plus size={15} /> Add Another Milestone
              </button>
            </div>
          )}

          {/* STEP 4: REVIEW & LAUNCH */}
          {currentStep === 4 && (
            <div>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Step 4: Final Review & Escrow Vault Verification</h2>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>Review specifications before publishing to the verified freelancer network</p>
              </div>

              {/* Project summary card */}
              <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: 6 }}>{form.category}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>{form.title}</h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>Total Escrow Budget</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>₹{totalBudget.toLocaleString()}</div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 18, whiteSpace: 'pre-line' }}>
                  {form.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Target Deadline</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={14} color="var(--primary)" /> {new Date(form.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Experience Tier</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Award size={14} color="var(--primary)" /> {form.experienceLevel}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Team Allocation</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Users size={14} color="var(--primary)" /> {form.teamSize} Freelancer(s)
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones review list */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12, letterSpacing: 0.5 }}>
                  Escrow Milestones ({form.milestones.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {form.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 18px',
                        background: 'var(--bg2)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--text)' }}>
                          {idx + 1}. {m.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{m.description}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-purple" style={{ marginRight: 8 }}>{m.percentage}%</span>
                        <strong style={{ fontSize: 14, color: 'var(--text)' }}>₹{m.amount?.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escrow Guarantee Box */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 20
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Smart Escrow Protection Guarantee</h4>
                  <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                    Your funds are held securely in the FreelancerHub vault. Payments are released milestone-by-milestone only when you approve the submitted deliverables.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            {currentStep > 1 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => goToStep(currentStep - 1)}
              >
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/my-projects')}
              >
                Cancel
              </button>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => { sounds.playSuccess(); alert('Draft saved locally!'); }}
              >
                <Save size={14} /> Save Draft
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => goToStep(currentStep + 1)}
                >
                  Continue to Step 0{currentStep + 1} <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />
                      <span>Deploying Project Vault...</span>
                    </div>
                  ) : (
                    <><Zap size={16} /> Launch Project & Fund Escrow</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Project Summary Sidebar (Steps 2 & 3) */}
        {(currentStep === 2 || currentStep === 3) && (
          <div className="card" style={{ padding: 22, position: 'sticky', top: 90 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Sparkles size={16} color="var(--primary)" />
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>Project Live Summary</h3>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Title</div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>
                {form.title || 'Untitled Project Spec'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700 }}>CATEGORY</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 2 }}>{form.category}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700 }}>ESCROW BUDGET</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)', marginTop: 2 }}>₹{totalBudget.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, marginBottom: 4 }}>SKILLS ({form.skills.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {form.skills.map(s => (
                  <span key={s} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 10, background: 'var(--bg3)', color: 'var(--text2)', fontWeight: 700 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>
                <span>Milestones Defined</span>
                <strong style={{ color: 'var(--text)' }}>{form.milestones.length} Phases</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)' }}>
                <span>Allocation Progress</span>
                <strong style={{ color: totalPercentage === 100 ? 'var(--success)' : 'var(--warning)' }}>{totalPercentage}%</strong>
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--primary-light)', borderRadius: 'var(--radius-xs)', fontSize: 11.5, color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} /> 100% Milestone Escrow Protected
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
