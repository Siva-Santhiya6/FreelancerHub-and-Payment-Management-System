import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../i18n/translations';
import { sounds } from '../utils/SoundEffects';
import {
  Send, Search, Paperclip, Smile, Phone, Video, MoreVertical,
  Check, CheckCheck, Sparkles, User, ShieldCheck, Briefcase,
  Wallet, FileText, Image as ImageIcon, Circle, Clock
} from 'lucide-react';

const initialThreads = [
  {
    id: 1,
    name: 'Sarah Client',
    role: 'CLIENT',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    project: 'E-Commerce Platform with React',
    online: true,
    unread: 1,
    messages: [
      { id: 101, sender: 'them', text: 'Hi! How is the checkout and payment integration coming along?', time: '10:30 AM', status: 'read' },
      { id: 102, sender: 'me', text: 'Hey Sarah! We just finished the Stripe escrow webhooks. Testing milestone 2 now.', time: '10:32 AM', status: 'read' },
      { id: 103, sender: 'them', text: 'Awesome! Please push the staging build once ready so I can approve the milestone.', time: '10:35 AM', status: 'delivered' }
    ]
  },
  {
    id: 2,
    name: 'Raj Freelancer',
    role: 'FREELANCER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    project: 'AI Chatbot for Customer Support',
    online: true,
    unread: 0,
    messages: [
      { id: 201, sender: 'them', text: 'I completed the NLP intent classification module with Tamil and English support!', time: 'Yesterday', status: 'read' },
      { id: 202, sender: 'me', text: 'Great work Raj! Can you share the API documentation for the webhook?', time: 'Yesterday', status: 'read' },
      { id: 203, sender: 'them', text: 'Shared in the project workspace. Tested with 98% accuracy.', time: 'Yesterday', status: 'read' }
    ]
  },
  {
    id: 3,
    name: 'Payment & Escrow Desk',
    role: 'PAYMENT_MANAGER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    project: 'Smart Escrow Vault',
    online: false,
    unread: 0,
    messages: [
      { id: 301, sender: 'them', text: 'Smart Escrow vault #ESC-8921 is funded and locked for ₹5,000.', time: '2 days ago', status: 'read' },
      { id: 302, sender: 'them', text: 'Milestone 1 funds can be released immediately upon client sign-off.', time: '2 days ago', status: 'read' }
    ]
  },
  {
    id: 4,
    name: 'AI Matchmaker Bot',
    role: 'AI_BOT',
    avatar: null,
    project: 'Smart Assistant',
    online: true,
    unread: 0,
    messages: [
      { id: 401, sender: 'them', text: '🤖 Hello! I can help you draft high-converting proposals, estimate project budgets, and match with verified talent.', time: '3 days ago', status: 'read' }
    ]
  }
];

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useSelector(s => s.auth);
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isTyping]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    sounds.playClick();
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return { ...t, messages: [...t.messages, newMsg] };
      }
      return t;
    }));

    setInputText('');

    // Simulate smart auto-reply after 1.5s
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        sounds.playMessagePop();
        const autoReplies = {
          1: "Got it! Reviewing the updates right now. Will approve shortly! 👍",
          2: "Thanks for the feedback! Pushing the commit right away. 🚀",
          3: "Escrow ledger updated. Transaction recorded on smart vault. 🔒",
          4: "🤖 Analysis complete! Recommendation: High match score with estimated 4-day delivery."
        };
        const replyText = autoReplies[activeThreadId] || "Sounds great, let's proceed!";

        const replyMsg = {
          id: Date.now() + 1,
          sender: 'them',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered'
        };

        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            return { ...t, messages: [...t.messages, replyMsg] };
          }
          return t;
        }));
      }, 1400);
    }, 800);
  };

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
    setShowEmoji(false);
    sounds.playClick();
  };

  const filteredThreads = threads.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: 'calc(100vh - 134px)', display: 'flex', gap: 20 }}>
      {/* Sidebar: Threads List */}
      <div className="card" style={{ width: 340, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 18px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>{t('directMessages', 'Direct Messages')}</h2>
            <span className="badge badge-primary" style={{ fontSize: 11 }}>{t('live247', 'Live 24/7')}</span>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: 36, height: 38, fontSize: 13 }}
              placeholder={t('searchConversations', 'Search conversations...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Thread items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {filteredThreads.map(thread => {
            const isActive = thread.id === activeThreadId;
            const lastMsg = thread.messages[thread.messages.length - 1];
            return (
              <div
                key={thread.id}
                onClick={() => {
                  setActiveThreadId(thread.id);
                  sounds.playClick();
                }}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
                  marginBottom: 4,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ position: 'relative' }}>
                  {thread.avatar ? (
                    <img src={thread.avatar} alt={thread.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Sparkles size={20} />
                    </div>
                  )}
                  {thread.online && (
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg-card)' }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: isActive ? 'var(--primary)' : 'var(--text)' }}>
                      {thread.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text4)' }}>{lastMsg?.time}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lastMsg?.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-glass-strong)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              {activeThread.avatar ? (
                <img src={activeThread.avatar} alt={activeThread.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Sparkles size={22} />
                </div>
              )}
              {activeThread.online && (
                <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg-card)' }} />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>{activeThread.name}</h3>
                <span className="badge badge-primary" style={{ fontSize: 10 }}>{activeThread.role}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                Project: <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{activeThread.project}</span> • {activeThread.online ? '🟢 Online' : '⚪ Offline'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => sounds.playClick()}><Phone size={14} /> Call</button>
            <button className="btn btn-secondary btn-sm" onClick={() => sounds.playClick()}><Video size={14} /> Video</button>
          </div>
        </div>

        {/* Message Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'center', margin: '8px 0 16px' }}>
            <span style={{ fontSize: 11.5, background: 'var(--bg3)', padding: '5px 14px', borderRadius: 999, color: 'var(--text3)', border: '1px solid var(--border)' }}>
              🔒 End-to-End Escrow Protected Workspace
            </span>
          </div>

          {activeThread.messages.map(msg => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: 8
                }}
              >
                {!isMe && (
                  activeThread.avatar ? (
                    <img src={activeThread.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>
                      <Sparkles size={14} />
                    </div>
                  )
                )}

                <div
                  style={{
                    maxWidth: '68%',
                    padding: '12px 16px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isMe ? 'var(--primary-gradient)' : 'var(--bg3)',
                    color: isMe ? '#ffffff' : 'var(--text)',
                    boxShadow: isMe ? '0 4px 14px var(--primary-glow)' : 'var(--shadow-xs)',
                    border: isMe ? 'none' : '1px solid var(--border)',
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    wordBreak: 'break-word'
                  }}
                >
                  <p>{msg.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4, fontSize: 10.5, opacity: 0.8 }}>
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck size={13} />}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Clock size={14} />
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 14, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', gap: 4, alignItems: 'center' }}>
                <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{activeThread.name} is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-glass-strong)', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          {showEmoji && (
            <div className="card" style={{ position: 'absolute', bottom: 68, left: 20, display: 'flex', gap: 8, padding: 10, zIndex: 30, background: 'var(--bg-card)' }}>
              {['👍', '🚀', '🔥', '❤️', '🎯', '💯', '✨', '👏'].map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 4 }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ padding: 8 }}
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <Smile size={18} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ padding: 8 }}
            onClick={() => {
              sounds.playClick();
              setInputText(prev => prev + " [Attachment: milestone_demo_v2.zip] ");
            }}
          >
            <Paperclip size={18} />
          </button>

          <input
            className="form-input"
            style={{ flex: 1, height: 42 }}
            placeholder={`Message ${activeThread.name}...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: 42, padding: '0 18px' }}
            disabled={!inputText.trim()}
          >
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
