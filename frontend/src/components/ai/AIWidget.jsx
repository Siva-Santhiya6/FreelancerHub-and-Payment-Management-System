import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendAIMessage, toggleAI, closeAI, clearMessages } from '../../store/slices/aiSlice';
import { setTheme, increaseFontSize, decreaseFontSize, setLanguage } from '../../store/slices/uiSlice';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import {
  Bot, X, Send, Mic, MicOff, Globe, Maximize2, Minimize2,
  Trash2, Volume2, Sparkles, AudioWaveform, ArrowRight, ExternalLink,
  VolumeX, Check
} from 'lucide-react';

// Web Audio API tone feedback
const playFeedbackTone = (freq = 600, duration = 0.1) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) { /* ignore audio failure */ }
};

export default function AIWidget() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { messages, loading, isOpen } = useSelector(s => s.ai);
  const { language } = useSelector(s => s.ui);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);
  const [expanded, setExpanded] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastExecutedActionKeyRef = useRef(null);
  const usedVoiceInputRef = useRef(false);

  // Sync with global UI language
  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Execute AI actions: Automatic navigation, theme, font adjustments
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const lastIdx = messages.length - 1;
    const last = messages[lastIdx];
    
    if (last?.role === 'assistant') {
      const messageKey = `${lastIdx}_${last.timestamp || Date.now()}_${last.content?.slice(0, 10)}`;
      
      if (lastExecutedActionKeyRef.current !== messageKey) {
        lastExecutedActionKeyRef.current = messageKey;
        
        // 1. Theme toggle action
        if (last.action === 'theme' && last.target) {
          dispatch(setTheme(last.target));
        }
        // 2. Font sizing action
        else if (last.action === 'font' && last.target) {
          last.target === 'increase' ? dispatch(increaseFontSize()) : dispatch(decreaseFontSize());
        }
        // 3. Automatic page navigation action
        else if (last.action === 'navigate' && last.target) {
          const timer = setTimeout(() => {
            navigate(last.target);
          }, 800);
          return () => clearTimeout(timer);
        }

        // 4. Voice narration
        if ((autoSpeak || usedVoiceInputRef.current) && last.content && window.speechSynthesis) {
          speakText(last.content);
          usedVoiceInputRef.current = false;
        }
      }
    }
  }, [messages, dispatch, navigate, autoSpeak]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();

      // Clean markdown stars/emojis for cleaner speech
      const cleanText = text.replace(/[*_#`]/g, '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
      
      const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
      const targetLocale = currentLangObj?.locale || (selectedLang === 'ta' ? 'ta-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-US');
      const utt = new SpeechSynthesisUtterance(cleanText);
      utt.lang = targetLocale;
      utt.rate = speechRate;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang === targetLocale || v.lang.startsWith(selectedLang));
      if (matchedVoice) {
        utt.voice = matchedVoice;
      }

      utt.onstart = () => setIsSpeaking(true);
      utt.onend = () => setIsSpeaking(false);
      utt.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utt);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    dispatch(sendAIMessage({ message: msg, language: selectedLang, context: { currentPath: location.pathname } }));
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is supported in Google Chrome and Microsoft Edge. Please grant microphone access.');
      return;
    }
    stopSpeaking();
    playFeedbackTone(750, 0.12);
    const recognition = new SR();
    recognitionRef.current = recognition;
    const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
    recognition.lang = currentLangObj?.locale || (selectedLang === 'ta' ? 'ta-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-US');
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      playFeedbackTone(520, 0.1);
      usedVoiceInputRef.current = true;
      sendMessage(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      playFeedbackTone(300, 0.15);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    playFeedbackTone(400, 0.1);
  };

  // Helper to render markdown bold and line breaks cleanly
  const renderFormattedMessage = (content) => {
    if (!content) return null;
    return content.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIdx} style={{ margin: lineIdx === 0 ? 0 : '4px 0', lineHeight: 1.5 }}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  // Dynamic context-aware suggestion prompts in active language
  const getContextSuggestions = () => {
    if (selectedLang === 'ta') {
      return [
        'project explanation kudu',
        'சந்தைக்கு போ',
        'விண்ணப்பம் எழுத உதவி',
        'எஸ்க்ரோ எப்படி செயல்படுகிறது?',
        'டார்க் மோட்',
        'கட்டணப் பக்கம்'
      ];
    }
    if (selectedLang === 'hi') {
      return [
        'प्रोजेक्ट्स के बारे में बताओ',
        'मार्केटप्लेस खोलो',
        'प्रपोजल कैसे लिखें?',
        'एस्क्रो कैसे काम करता है?',
        'डार्क मोड',
        'पेमेंट पेज'
      ];
    }
    return [
      'Explain available projects',
      'Go to marketplace',
      'How to write proposal?',
      'How does Escrow work?',
      'Dark mode',
      'Open payments'
    ];
  };

  const localizedContent = {
    en: {
      intro: "Hello! I'm HubAI, your intelligent freelance assistant. Ask me anything, change themes, or tell me to move to any page (e.g. 'Go to marketplace' or 'Create project').",
      placeholder: 'Ask HubAI anything or give a task (voice or text)...',
      navigating: 'Moving to',
      openPage: 'Open Page',
    },
    ta: {
      intro: "வணக்கம்! நான் HubAI. என்னிடம் எஸ்க்ரோ, திட்டங்கள் பற்றி கேட்கலாம் அல்லது 'சந்தைக்கு போ', 'திட்டம் உருவாக்கு' என்று சொல்லி பக்கங்களுக்கு தானாக செல்லலாம்.",
      placeholder: 'எந்த பக்கத்திற்கு செல்ல வேண்டும் அல்லது கேள்வி கேளுங்கள்...',
      navigating: 'செல்கிறது:',
      openPage: 'பக்கம் திற',
    },
    hi: {
      intro: "नमस्ते! मैं HubAI हूं। आप मुझसे एस्क्रो भुगतान के बारे में पूछ सकते हैं या 'मार्केटप्लेस खोलो', 'प्रोजेक्ट बनाओ' कहकर किसी भी पेज पर जा सकते हैं।",
      placeholder: 'किस पेज पर जाना है या अपना सवाल टाइप करें...',
      navigating: 'ले जाया जा रहा है:',
      openPage: 'पेज खोलें',
    }
  };

  const activeLocale = localizedContent[selectedLang] || localizedContent.en;

  const getRouteLabel = (target) => {
    switch (target) {
      case '/dashboard': return 'Dashboard';
      case '/marketplace': return 'Marketplace';
      case '/projects/create': return 'Post Project';
      case '/my-projects': return 'My Projects';
      case '/proposals': return 'Proposals';
      case '/payments': return 'Payments & Escrow';
      case '/profile': return 'My Profile';
      case '/settings': return 'Settings';
      case '/admin': return 'Admin Panel';
      default: return target;
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className={`ai-fab ${isListening ? 'listening' : ''}`}
        onClick={() => dispatch(toggleAI())}
        title="HubAI Voice & Smart Assistant"
      >
        <Bot size={26} />
      </button>

      {/* AI Panel */}
      {isOpen && (
        <div className={`ai-panel ${expanded ? 'expanded' : ''}`}>
          {/* Header */}
          <div className="ai-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Bot size={16} />
              </div>
              <div>
                <h3>HubAI Assistant</h3>
                <span style={{ fontSize: 10, color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} /> Live Multilingual AI
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Auto Speak Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setAutoSpeak(!autoSpeak);
                }}
                title={autoSpeak ? 'Auto Voice Speech: ON (Click to Mute)' : 'Auto Voice Speech: OFF (Click to Enable)'}
                style={{
                  background: autoSpeak ? 'var(--primary-light)' : 'none',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px',
                  cursor: 'pointer',
                  color: autoSpeak ? 'var(--primary)' : 'var(--text3)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Language Selector */}
              <select
                value={selectedLang}
                onChange={e => {
                  setSelectedLang(e.target.value);
                  dispatch(setLanguage(e.target.value));
                }}
                style={{ fontSize: 11, padding: '3px 6px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontWeight: 700, maxWidth: 110 }}
                title="AI Language & Speech Locale"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} style={{ background: 'var(--card-bg)', color: 'var(--text)' }}>
                    {lang.flag} {lang.native} ({lang.code.toUpperCase()})
                  </option>
                ))}
              </select>

              {/* Clear chat */}
              <button onClick={() => { stopSpeaking(); dispatch(clearMessages()); }} title="Clear conversation" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4 }}>
                <Trash2 size={15} />
              </button>

              {/* Maximize / Minimize */}
              <button onClick={() => setExpanded(!expanded)} title={expanded ? 'Minimize' : 'Expand'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4 }}>
                {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              {/* Close */}
              <button onClick={() => { stopSpeaking(); dispatch(closeAI()); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4 }}>
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Voice Wave Visualizer Status Bar */}
          {(isListening || isSpeaking) && (
            <div style={{
              background: isListening ? 'rgba(239, 68, 68, 0.12)' : 'var(--primary-light)',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
              minHeight: 32
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AudioWaveform size={15} color={isListening ? 'var(--danger)' : 'var(--primary)'} />
                <span style={{ fontSize: 11, fontWeight: 700, color: isListening ? 'var(--danger)' : 'var(--primary)' }}>
                  {isListening ? (selectedLang === 'ta' ? 'கேட்கிறது...' : selectedLang === 'hi' ? 'सुन रहा है...' : 'Listening to speech...') : (selectedLang === 'ta' ? 'பேசுகிறது...' : selectedLang === 'hi' ? 'बोल रहा है...' : 'Speaking response...')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="voice-wave-container">
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                  <div className="voice-bar" />
                </div>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="ai-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '24px 16px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Sparkles size={22} />
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>
                  {activeLocale.intro}
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {getContextSuggestions().map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      style={{ fontSize: 11.5, padding: '6px 12px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 20, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Sparkles size={11} /> {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.role}`}>
                <div>{renderFormattedMessage(msg.content)}</div>
                
                {/* Clickable direct navigation action pill */}
                {msg.action === 'navigate' && msg.target && (
                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => navigate(msg.target)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      <ArrowRight size={13} /> {activeLocale.navigating} {getRouteLabel(msg.target)}
                    </button>
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                      onClick={() => speakText(msg.content)}
                      title="Listen with Voice"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text4)', padding: 2 }}
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-msg assistant" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Voice Controls */}
          <div className="ai-input-row">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={activeLocale.placeholder}
              style={{ flex: 1 }}
            />
            <button
              onClick={isListening ? stopVoice : startVoice}
              style={{
                background: isListening ? 'var(--danger)' : 'var(--bg3)',
                border: `1.5px solid ${isListening ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '8px 12px',
                cursor: 'pointer',
                color: isListening ? 'white' : 'var(--text2)',
                display: 'flex',
                alignItems: 'center',
                boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.5)' : 'none'
              }}
              title={isListening ? 'Stop listening' : 'Voice input (Click & Speak)'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={() => sendMessage()}
              className="btn btn-primary btn-sm"
              disabled={loading || !input.trim()}
              style={{ borderRadius: 10, padding: '8px 14px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
