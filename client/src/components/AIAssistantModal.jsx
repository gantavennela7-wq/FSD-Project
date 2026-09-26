import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/api';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  X,
  BookOpen,
  HelpCircle,
  Code,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

const AIAssistantModal = ({
  isOpen,
  onClose,
  course,
  currentLesson
}) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your **EduVibe AI Learning Assistant**.\n\nI can explain concepts, give code examples, or clarify anything about **${currentLesson?.title || 'this lesson'}**.\n\nWhat would you like to explore?`
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (questionToSend) => {
    const query = typeof questionToSend === 'string' ? questionToSend : inputQuestion;
    if (!query.trim() || loading) return;

    const userMessage = { role: 'user', content: query.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputQuestion('');
    setLoading(true);
    setError('');

    try {
      // Pass the conversation history so follow-up questions retain context
      const response = await aiService.ask({
        question: query.trim(),
        courseId: course?._id,
        lessonId: currentLesson?._id?.toString() || currentLesson?.title,
        history: newMessages.slice(-6).map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer || 'Here is what I found regarding your question.'
        }
      ]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Unable to contact AI Assistant. Please try again.';
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Error:** ${errMsg}`,
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared. Ask me anything about **${currentLesson?.title || 'this lesson'}**!`
      }
    ]);
    setError('');
  };

  const quickPrompts = [
    { label: 'Explain simply', text: `Can you explain the main concept of ${currentLesson?.title || 'this lesson'} in simple terms?`, icon: Lightbulb },
    { label: 'Code example', text: `Can you provide a practical code example demonstrating ${currentLesson?.title || 'this lesson'}?`, icon: Code },
    { label: 'Key points', text: `What are the most important takeaways from ${currentLesson?.title || 'this lesson'}?`, icon: Sparkles }
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={styles.avatarIcon}>
              <Bot size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>EduVibe AI Assistant</h3>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                  <Sparkles size={11} style={{ marginRight: 2 }} /> AI Powered
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#78716C' }}>
                Ask me anything about this lesson.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              style={styles.actionIconBtn}
              onClick={handleClearChat}
              title="Clear Conversation"
            >
              <Trash2 size={16} />
            </button>
            <button
              style={styles.actionIconBtn}
              onClick={onClose}
              title="Close Assistant"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Current Lesson Context Pill */}
        <div style={styles.contextBar}>
          <BookOpen size={14} color="#B87333" />
          <span style={{ fontSize: '0.82rem', color: '#1C1917', fontWeight: '600' }}>
            Current Lesson: <span style={{ color: '#3D291F', fontWeight: '700' }}>{currentLesson?.title || course?.title}</span>
          </span>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={styles.chipsContainer}>
          {quickPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                style={styles.chipBtn}
                onClick={() => handleSend(qp.text)}
                disabled={loading}
              >
                <Icon size={12} color="#B87333" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Body */}
        <div style={styles.chatBody}>
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                {!isUser && (
                  <div style={styles.botMiniAvatar}>
                    <Bot size={14} color="#3D291F" />
                  </div>
                )}
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(isUser ? styles.userBubble : styles.assistantBubble),
                    ...(msg.isError ? styles.errorBubble : {})
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.92rem' }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={styles.messageWrapper}>
              <div style={styles.botMiniAvatar}>
                <Bot size={14} color="#3D291F" />
              </div>
              <div style={{ ...styles.messageBubble, ...styles.assistantBubble, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={styles.typingDot}></span>
                <span style={{ ...styles.typingDot, animationDelay: '0.2s' }}></span>
                <span style={{ ...styles.typingDot, animationDelay: '0.4s' }}></span>
                <span style={{ fontSize: '0.85rem', color: '#78716C', marginLeft: '0.25rem' }}>
                  EduVibe AI is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={styles.inputSection}>
          <div style={styles.inputWrapper}>
            <textarea
              style={styles.textarea}
              rows={2}
              placeholder="Type your question... (e.g. Explain what React useEffect does)"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              style={{
                ...styles.sendBtn,
                opacity: !inputQuestion.trim() || loading ? 0.6 : 1,
                cursor: !inputQuestion.trim() || loading ? 'not-allowed' : 'pointer'
              }}
              onClick={() => handleSend()}
              disabled={!inputQuestion.trim() || loading}
            >
              <Send size={16} /> Ask
            </button>
          </div>
          <div style={styles.footerNote}>
            <span>Press <strong>Enter</strong> to send • Follow-up questions supported</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 25, 23, 0.65)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 9999,
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    width: '100%',
    maxWidth: '540px',
    height: '100vh',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.15)',
    borderLeft: '1px solid #E7E5E4'
  },
  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #E7E5E4',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF8F5'
  },
  avatarIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#3D291F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(61, 41, 31, 0.2)'
  },
  actionIconBtn: {
    background: 'none',
    border: 'none',
    color: '#78716C',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
  },
  contextBar: {
    padding: '0.65rem 1.25rem',
    backgroundColor: '#FBF4ED',
    borderBottom: '1px solid #F3EFEA',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  chipsContainer: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.65rem 1.25rem',
    overflowX: 'auto',
    backgroundColor: '#FAF8F5',
    borderBottom: '1px solid #E7E5E4'
  },
  chipBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E7E5E4',
    borderRadius: '9999px',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#1C1917',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease'
  },
  chatBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#FCFAF8'
  },
  messageWrapper: {
    display: 'flex',
    gap: '0.65rem',
    alignItems: 'flex-start'
  },
  botMiniAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#F4ECE6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px'
  },
  messageBubble: {
    maxWidth: '85%',
    padding: '0.9rem 1.15rem',
    borderRadius: '14px',
    fontSize: '0.92rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },
  userBubble: {
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    borderBottomRightRadius: '2px'
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    color: '#1C1917',
    border: '1px solid #E7E5E4',
    borderBottomLeftRadius: '2px'
  },
  errorBubble: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    color: '#B91C1C'
  },
  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#B87333',
    display: 'inline-block',
    animation: 'pulse 1.2s infinite'
  },
  inputSection: {
    padding: '1rem 1.25rem',
    borderTop: '1px solid #E7E5E4',
    backgroundColor: '#FFFFFF'
  },
  inputWrapper: {
    display: 'flex',
    gap: '0.65rem',
    alignItems: 'flex-end'
  },
  textarea: {
    flex: 1,
    resize: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid #E7E5E4',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    color: '#1C1917',
    outline: 'none',
    backgroundColor: '#FAF8F5'
  },
  sendBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#3D291F',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  footerNote: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: '#A8A29E',
    textAlign: 'center'
  }
};

export default AIAssistantModal;
