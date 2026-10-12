import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import {
  Award, CheckCircle2, Clock, Sparkles, BookOpen, AlertCircle,
  HelpCircle, ArrowRight, ShieldCheck, Star, RefreshCw, Trophy, X
} from 'lucide-react';

const availableTests = [
  { id: 'react', title: 'React.js & State Management Mastery', category: 'Frontend', questions: 5, duration: '5 mins', badge: 'Verified React Architect', scoreNeeded: 80 },
  { id: 'node', title: 'Node.js & Express Enterprise Backend', category: 'Backend', questions: 5, duration: '5 mins', badge: 'Certified Node Engineer', scoreNeeded: 80 },
  { id: 'mongo', title: 'MongoDB Aggregations & Schema Design', category: 'Database', questions: 5, duration: '5 mins', badge: 'MongoDB Specialist', scoreNeeded: 80 },
  { id: 'ai', title: 'Generative AI & Multilingual NLP Engineering', category: 'AI/ML', questions: 5, duration: '5 mins', badge: 'AI & NLP Specialist', scoreNeeded: 80 },
];

const questionBank = {
  react: [
    { q: 'What is the purpose of useEffect dependency array in React?', options: ['Controls when the effect re-runs', 'Sets initial state', 'Defines CSS styles', 'Binds event handlers'], correct: 0 },
    { q: 'How does Redux Toolkit simplify state management?', options: ['Using createSlice and Immer automatically', 'Removing actions completely', 'By replacing React', 'By deleting CSS'], correct: 0 },
    { q: 'What prevents unnecessary re-renders of functional components?', options: ['React.memo and useMemo', 'setInterval', 'document.write', 'Inline functions'], correct: 0 },
    { q: 'Which hook manages side-effects and cleanup in React 18?', options: ['useEffect', 'useState', 'useRef', 'useContext'], correct: 0 },
    { q: 'What is Virtual DOM diffing in React?', options: ['Reconciliation algorithm comparing virtual nodes', 'Direct DOM mutation', 'A database query', 'A webpack plugin'], correct: 0 },
  ],
  node: [
    { q: 'What is the purpose of Express middleware next() function?', options: ['Passes control to the next middleware', 'Terminates the request', 'Renders HTML', 'Connects to database'], correct: 0 },
    { q: 'Which HTTP status code indicates unauthorized access in JWT auth?', options: ['401 Unauthorized', '200 OK', '404 Not Found', '500 Internal Error'], correct: 0 },
    { q: 'How does Node.js handle concurrency?', options: ['Single-threaded Event Loop with non-blocking I/O', 'Multi-threaded CPU locking', 'Synchronous blocking', 'Apache threads'], correct: 0 },
    { q: 'Which package securely hashes passwords with salt?', options: ['bcryptjs', 'express', 'cors', 'morgan'], correct: 0 },
    { q: 'What is process.env used for in Node.js?', options: ['Accessing environment variables', 'Writing CSS files', 'Creating React components', 'Sending SMS'], correct: 0 },
  ]
};

export default function SkillsAssessmentPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [activeTest, setActiveTest] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAns, setSelectedAns] = useState({});
  const [testResult, setTestResult] = useState(null);

  const startQuiz = (test) => {
    setActiveTest(test);
    setCurrentQ(0);
    setSelectedAns({});
    setTestResult(null);
  };

  const handleSelectOption = (idx) => {
    setSelectedAns({ ...selectedAns, [currentQ]: idx });
  };

  const handleSubmitQuiz = () => {
    const questions = questionBank[activeTest.id] || questionBank.react;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAns[idx] === q.correct) correctCount++;
    });
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= activeTest.scoreNeeded;
    setTestResult({
      score: percentage,
      correctCount,
      total: questions.length,
      passed,
      badge: activeTest.badge
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', background: 'var(--primary-light)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
            <Award size={12} /> {t('verifiedSkillCredentials', 'Verified Skill Credentials')}
          </div>
          <h1>{t('skillsAssessment', 'Skill Assessment & Verification Hub')}</h1>
          <p style={{ color: 'var(--text3)' }}>{t('skillsSubtitle', 'Take interactive skill evaluations, unlock verified talent badges, and boost your platform trust score')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('verifiedBadges', 'Verified Badges')}</span>
            <div className="stat-icon stat-icon-purple"><Trophy size={20} /></div>
          </div>
          <div className="stat-value">3 {t('earned', 'Earned')}</div>
          <div className="stat-footer stat-up"><ShieldCheck size={14} /> {t('highlightedOnMarketplace', 'Highlighted on Marketplace')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('currentTrustScore', 'Current Trust Score')}</span>
            <div className="stat-icon stat-icon-emerald"><ShieldCheck size={20} /></div>
          </div>
          <div className="stat-value">{user?.trustScore || 95} / 100</div>
          <div className="stat-footer stat-up">+15 {t('boostedByAssessments', 'Boosted by verified assessments')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">{t('proposalWinRate', 'Proposal Win Rate')}</span>
            <div className="stat-icon stat-icon-blue"><Sparkles size={20} /></div>
          </div>
          <div className="stat-value">88.5%</div>
          <div className="stat-footer stat-up">3.2x {t('higherClientAcceptance', 'higher client acceptance')}</div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid-auto" style={{ marginBottom: 30 }}>
        {availableTests.map(test => (
          <div key={test.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="badge badge-info">{test.category}</span>
                <span className="badge badge-purple" style={{ gap: 4 }}>
                  <Clock size={11} /> {test.duration}
                </span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>
                {test.title}
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 16 }}>
                Score at least {test.scoreNeeded}% to unlock the official <strong>{test.badge}</strong> credential.
              </p>
            </div>

            <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)' }}>{test.questions} {t('questions', 'Questions')}</span>
              <button className="btn btn-primary btn-sm" onClick={() => startQuiz(test)}>
                {t('startTest', 'Start Test')} <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {activeTest && (
        <div className="modal-overlay" onClick={() => setActiveTest(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span className="badge badge-purple">{activeTest.category}</span>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{activeTest.title}</h2>
              </div>
              <button onClick={() => setActiveTest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><X size={18} /></button>
            </div>

            {!testResult ? (
              <div>
                {/* Question Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 12, fontWeight: 700, color: 'var(--text3)' }}>
                  <span>{t('question', 'Question')} {currentQ + 1} of {(questionBank[activeTest.id] || questionBank.react).length}</span>
                  <span>{t('passingScore', 'Passing Score')}: {activeTest.scoreNeeded}%</span>
                </div>

                <div style={{ background: 'var(--bg3)', height: 6, borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                  <div style={{ width: `${((currentQ + 1) / (questionBank[activeTest.id] || questionBank.react).length) * 100}%`, height: '100%', background: 'var(--primary)' }} />
                </div>

                {/* Question */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
                  {(questionBank[activeTest.id] || questionBank.react)[currentQ].q}
                </h3>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {(questionBank[activeTest.id] || questionBank.react)[currentQ].options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: `1.5px solid ${selectedAns[currentQ] === optIdx ? 'var(--primary)' : 'var(--border)'}`,
                        background: selectedAns[currentQ] === optIdx ? 'var(--primary-light)' : 'var(--bg3)',
                        cursor: 'pointer',
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: 'var(--text)',
                        transition: 'all 0.15s'
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    className="btn btn-outline"
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ(currentQ - 1)}
                  >
                    {t('previous', 'Previous')}
                  </button>

                  {currentQ < (questionBank[activeTest.id] || questionBank.react).length - 1 ? (
                    <button
                      className="btn btn-primary"
                      disabled={selectedAns[currentQ] === undefined}
                      onClick={() => setCurrentQ(currentQ + 1)}
                    >
                      {t('nextQuestion', 'Next Question')} <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      disabled={selectedAns[currentQ] === undefined}
                      onClick={handleSubmitQuiz}
                    >
                      <CheckCircle2 size={14} /> {t('submitAssessment', 'Submit Assessment')}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Test Result View */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: testResult.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: testResult.passed ? 'var(--success)' : 'var(--danger)' }}>
                  {testResult.passed ? <Trophy size={32} /> : <AlertCircle size={32} />}
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 800 }}>
                  {testResult.passed ? `🎉 ${t('assessmentPassed', 'Assessment Passed!')}` : t('assessmentIncomplete', 'Assessment Incomplete')}
                </h2>
                <p style={{ color: 'var(--text3)', marginTop: 4, marginBottom: 20 }}>
                  You scored <strong>{testResult.score}%</strong> ({testResult.correctCount} / {testResult.total} {t('correct', 'correct')}).
                </p>

                {testResult.passed && (
                  <div style={{ padding: 16, background: 'var(--primary-light)', borderRadius: 12, border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <ShieldCheck size={20} color="var(--primary)" />
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{t('badgeUnlocked', 'Badge Unlocked')}: {testResult.badge}</span>
                  </div>
                )}

                <div>
                  <button className="btn btn-primary" onClick={() => setActiveTest(null)}>
                    {t('doneAndReturn', 'Done & Return to Assessments')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
