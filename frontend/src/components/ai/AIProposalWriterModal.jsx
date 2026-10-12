import React, { useState } from 'react';
import { sounds } from '../../utils/SoundEffects';
import {
  Sparkles, X, Check, Copy, ArrowRight, Wand2, Sliders,
  ShieldCheck, Clock, DollarSign, Send, CheckCircle2
} from 'lucide-react';

export default function AIProposalWriterModal({ project, isOpen, onClose, onSubmitProposal }) {
  const [tone, setTone] = useState('executive');
  const [proposedRate, setProposedRate] = useState(project?.budget ? Math.round(project.budget * 0.95) : 3500);
  const [deliveryDays, setDeliveryDays] = useState(14);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const handleGenerate = () => {
    sounds.playClick();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      sounds.playSuccess();

      const tones = {
        executive: `Dear Hiring Team,\n\nI reviewed your requirements for "${project.title}" and have delivered comparable high-performance solutions using ${project.skills?.join(', ') || 'modern stacks'}.\n\n🎯 Execution Strategy:\n1. Architecture Setup & Milestone 1 Prototype (Days 1-4)\n2. Core Features & Integration (${project.skills?.slice(0, 2).join(' + ') || 'Fullstack'}) (Days 5-10)\n3. Testing, Security Audit & Staging Deployment (Days 11-14)\n\n🔒 Escrow Safety: All milestones will be securely tied to FreelancerHub smart escrow. Looking forward to discussing details!`,
        technical: `Hi there,\n\nRegarding "${project.title}": I specialize in scalable ${project.skills?.[0] || 'Node.js'} backend systems and responsive ${project.skills?.[1] || 'React'} frontends.\n\n🛠 Proposed Technical Roadmap:\n• Clean architecture with modular separation of concerns\n• Type-safe contracts and optimized database queries\n• 100% test coverage for critical paths\n\nEstimated completion in ${deliveryDays} days with zero regression risk.`,
        rapid: `Hello!\n\nI can start immediately on "${project.title}". With pre-built modules for authentication, payment escrow, and dashboard analytics, I can deliver production-ready milestones in just ${deliveryDays} days at ₹${proposedRate}.\n\nLet's connect on chat to finalize the roadmap!`
      };

      setGeneratedPitch(tones[tone] || tones.executive);
    }, 900);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    sounds.playSuccess();
    if (onSubmitProposal) {
      onSubmitProposal({
        coverLetter: generatedPitch,
        bidAmount: Number(proposedRate),
        deliveryDays: Number(deliveryDays),
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wand2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>AI Proposal Copilot</h2>
              <p style={{ fontSize: 12, color: 'var(--text3)' }}>Generate a high-converting pitch for: <span style={{ fontWeight: 600, color: 'var(--text)' }}>{project.title}</span></p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ padding: 6 }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Options Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <label className="form-label">Strategy / Tone</label>
            <select className="form-select" value={tone} onChange={e => setTone(e.target.value)}>
              <option value="executive">👔 Executive & Confident</option>
              <option value="technical">⚙️ Deep Technical & Architecture</option>
              <option value="rapid">⚡ Rapid Fast-Track Delivery</option>
            </select>
          </div>

          <div>
            <label className="form-label">Proposed Bid (₹)</label>
            <input
              type="number"
              className="form-input"
              value={proposedRate}
              onChange={e => setProposedRate(e.target.value)}
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 18, height: 42 }}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              <span>Analyzing requirements & drafting proposal...</span>
            </div>
          ) : (
            <><Sparkles size={16} /> Generate Tailored Proposal with AI</>
          )}
        </button>

        {/* Pitch Area */}
        {generatedPitch && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>Generated Proposal (Editable)</label>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCopy}
                style={{ fontSize: 11, padding: '4px 8px' }}
              >
                {copied ? <><Check size={12} color="var(--success)" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <textarea
              className="form-textarea"
              style={{ minHeight: 160, fontFamily: 'inherit', fontSize: 13, lineHeight: 1.6 }}
              value={generatedPitch}
              onChange={e => setGeneratedPitch(e.target.value)}
            />
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {generatedPitch && (
            <button className="btn btn-primary" onClick={handleSend}>
              <Send size={15} /> Submit Proposal (₹{proposedRate})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
