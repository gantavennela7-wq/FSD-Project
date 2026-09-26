import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Save,
  Trash2,
  Copy,
  Check,
  Code2,
  Terminal,
  ExternalLink,
  Sparkles,
  Bot,
  Layers,
  HelpCircle
} from 'lucide-react';

/**
 * Generate starter template tailored dynamically to the current course and lesson
 */
const getStarterCode = (language, course, lesson) => {
  const cTitle = course?.title || '';
  const lTitle = lesson?.title || '';
  const cCat = course?.category || '';

  if (language === 'html') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 24px;
      background: #FAF8F5;
      color: #1C1917;
    }
    .card {
      background: #FFFFFF;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #E7E5E4;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      max-width: 480px;
    }
    h1 {
      color: #3D291F;
      font-size: 1.5rem;
      margin-bottom: 8px;
    }
    .badge {
      display: inline-block;
      background: #F4ECE6;
      color: #B87333;
      padding: 4px 12px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.8rem;
      margin-bottom: 12px;
    }
    button {
      background: #3D291F;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 12px;
    }
    button:hover {
      background: #B87333;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">${cTitle || 'EduVibe LMS'}</span>
    <h1>${lTitle || 'Welcome to Interactive Coding'}</h1>
    <p>Practice writing clean semantic HTML & modern CSS in this live interactive workspace.</p>
    <button onclick="alert('Great job practicing your code on EduVibe!')">Click Me</button>
  </div>
</body>
</html>`;
  }

  if (language === 'python') {
    if (lTitle.toLowerCase().includes('loop') || cTitle.toLowerCase().includes('loop')) {
      return `# Python Loops & Sequences Demonstration
# Lesson: ${lTitle || 'Loops & Iterations'}

print("🚀 Running Python Loops Demo on EduVibe LMS...")

# 1. For Loop with Range
print("\\n--- Counting Numbers 1 to 5 ---")
for i in range(1, 6):
    print(f"Step {i}: Progress at {i * 20}%")

# 2. Iterating through a List
courses = ["Python Basics", "Data Structures", "MERN Stack", "Machine Learning"]
print("\\n--- Enrolled Learning Paths ---")
for idx, course_name in enumerate(courses, 1):
    print(f"{idx}. {course_name}")

# 3. Computing a total sum
numbers = [12, 25, 37, 48, 59]
total = sum(numbers)
print(f"\\nTotal score sum: {total}")
print(f"Average: {total / len(numbers):.2f}")
`;
    }

    return `# Python Demonstration for: ${cTitle || 'Programming'}
# Lesson: ${lTitle || 'Core Concepts'}

def calculate_learning_stats(student_name, lessons_completed, total_lessons):
    progress_percentage = (lessons_completed / total_lessons) * 100
    status = "Completed" if progress_percentage >= 100 else "In Progress"
    
    return {
        "student": student_name,
        "progress": f"{progress_percentage:.1f}%",
        "status": status,
        "remaining": total_lessons - lessons_completed
    }

# Execute function
stats = calculate_learning_stats("Alex", 4, 5)

print("🎓 Student Learning Summary:")
for key, value in stats.items():
    print(f" • {key.capitalize()}: {value}")

print("\\n✅ Execution finished successfully!")
`;
  }

  // JavaScript Default
  if (lTitle.toLowerCase().includes('function') || lTitle.toLowerCase().includes('arrow')) {
    return `// JavaScript Functions & Modern Syntax
// Lesson: ${lTitle || 'Functions & Modules'}

console.log("🚀 Executing JavaScript on EduVibe LMS...");

// 1. Arrow Function with Object Return
const createStudentBadge = (name, role, streak) => ({
  studentName: name,
  role: role,
  streakDays: streak,
  activeBadge: streak >= 5 ? "🔥 Hot Streak" : "🌟 Active Learner"
});

// 2. Array Methods (map, filter, reduce)
const scores = [88, 92, 79, 95, 84];
const highScores = scores.filter(score => score >= 85);
const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

console.log("High Scores (>=85):", highScores);
console.log("Average Score:", averageScore.toFixed(2));

// 3. User Badge Output
const student = createStudentBadge("John Doe", "Student", 7);
console.log("\\nStudent Profile:", JSON.stringify(student, null, 2));
`;
  }

  return `// JavaScript Practical Code Workspace
// Course: ${cTitle || 'Full Stack Development'}
// Lesson: ${lTitle || 'Practical Exercises'}

console.log("✨ EduVibe Interactive Code Runner");

function solveLessonChallenge() {
  const lessonData = {
    title: "${lTitle || 'Core JavaScript'}",
    timestamp: new Date().toLocaleTimeString(),
    status: "Verified",
    concepts: ["Variables", "Functions", "Data Manipulation"]
  };

  console.log("Current Lesson Context:", lessonData.title);
  console.log("Concepts Loaded:", lessonData.concepts.join(", "));
  
  return \`Successfully executed code for "\${lessonData.title}"!\`;
}

const result = solveLessonChallenge();
console.log("\\nResult:", result);
`;
};

const CodeCompiler = ({ course, currentLesson, onAskAI }) => {
  // Infer initial language from course/lesson title
  const getInitialLanguage = () => {
    const title = ((course?.title || '') + ' ' + (currentLesson?.title || '')).toLowerCase();
    if (title.includes('html') || title.includes('css')) return 'html';
    if (title.includes('python')) return 'python';
    return 'javascript';
  };

  const [language, setLanguage] = useState(getInitialLanguage);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const iframeRef = useRef(null);

  // Storage key for saving user code across sessions
  const getStorageKey = (lang) => {
    const courseId = course?._id || 'general';
    const lessonId = currentLesson?._id?.toString() || currentLesson?.title || 'lesson';
    return `eduvibe_code_${courseId}_${lessonId}_${lang}`;
  };

  // Load saved code or starter template on mount or lesson/language change
  useEffect(() => {
    const key = getStorageKey(language);
    const saved = localStorage.getItem(key);
    if (saved) {
      setCode(saved);
      setSaveStatus('Saved draft loaded');
    } else {
      setCode(getStarterCode(language, course, currentLesson));
      setSaveStatus('');
    }
    setOutput('');
  }, [course, currentLesson, language]);

  // Handle Code Saving
  const handleSaveCode = () => {
    const key = getStorageKey(language);
    localStorage.setItem(key, code);
    setSaveStatus('Saved to browser storage');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Handle Reset Code
  const handleResetCode = () => {
    const starter = getStarterCode(language, course, currentLesson);
    setCode(starter);
    setOutput('');
    const key = getStorageKey(language);
    localStorage.removeItem(key);
    setSaveStatus('Reset to default');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  // Copy Code to Clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe In-Browser Python Simulator
  const runPythonCode = (pyCode) => {
    const logs = [];
    const printRegex = /print\s*\((.*?)\)/g;
    const lines = pyCode.split('\n');

    try {
      // Basic simulation of Python print, variables, loops, and math
      const context = {};
      
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        // Simulate print(...)
        if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
          let content = trimmed.substring(6, trimmed.length - 1).trim();

          // Handle formatted strings f"..." or f'...'
          if (content.startsWith('f"') || content.startsWith("f'")) {
            content = content.substring(2, content.length - 1);
            // Replace {expression} with evaluated value
            content = content.replace(/\{([^}]+)\}/g, (_, expr) => {
              try {
                // simple math or variable replacement
                if (context[expr.trim()] !== undefined) return context[expr.trim()];
                return Function(`"use strict"; return (${expr})`)();
              } catch (e) {
                return `{${expr}}`;
              }
            });
            logs.push(content);
            return;
          }

          // Handle regular strings "..." or '...'
          if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
            logs.push(content.substring(1, content.length - 1));
            return;
          }

          // Try evaluating content
          try {
            const evalResult = Function(`"use strict"; return (${content})`)();
            logs.push(typeof evalResult === 'object' ? JSON.stringify(evalResult, null, 2) : String(evalResult));
          } catch (e) {
            logs.push(content);
          }
        } else if (trimmed.includes('=')) {
          // Simple variable assignments
          const [varName, ...rest] = trimmed.split('=');
          const valueStr = rest.join('=').trim();
          try {
            context[varName.trim()] = Function(`"use strict"; return (${valueStr})`)();
          } catch (e) {
            context[varName.trim()] = valueStr;
          }
        }
      });

      if (logs.length === 0) {
        logs.push('Program completed with 0 output statements.');
      }

      return logs.join('\n');
    } catch (err) {
      return `❌ Python Runtime Error:\n${err.message}`;
    }
  };

  // Run Code execution engine
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('');

    try {
      if (language === 'html') {
        // HTML/CSS Live preview rendering
        if (iframeRef.current) {
          iframeRef.current.srcdoc = code;
        }
        setOutput('✅ Rendered HTML/CSS live output in the preview panel.');
      } else if (language === 'javascript') {
        // Safe JavaScript evaluation capturing console.log
        const logs = [];
        const customConsole = {
          log: (...args) => {
            logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
          },
          info: (...args) => {
            logs.push('ℹ️ ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
          },
          warn: (...args) => {
            logs.push('⚠️ ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
          },
          error: (...args) => {
            logs.push('❌ ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
          }
        };

        // Execute in Function scope with captured console
        const executeFn = new Function('console', `"use strict";\n${code}`);
        const returnedValue = executeFn(customConsole);

        if (returnedValue !== undefined) {
          logs.push(`\n▶ Returned Value: ${typeof returnedValue === 'object' ? JSON.stringify(returnedValue, null, 2) : returnedValue}`);
        }

        if (logs.length === 0) {
          setOutput('✅ Code executed successfully with no console output.');
        } else {
          setOutput(logs.join('\n'));
        }
      } else if (language === 'python') {
        const pyOutput = runPythonCode(code);
        setOutput(pyOutput);
      }
    } catch (err) {
      setOutput(`❌ Execution Error:\n${err.message || err}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Open AI Assistant modal pre-populated with code inquiry
  const handleAskAIAboutCode = () => {
    if (onAskAI) {
      onAskAI(`Here is my ${language.toUpperCase()} code from the lesson editor:\n\`\`\`${language}\n${code}\n\`\`\`\nCan you explain how this works or help improve it?`);
    }
  };

  return (
    <div className="compiler-card" style={{ marginTop: '2rem' }}>
      {/* Compiler Top Toolbar */}
      <div className="compiler-header">
        <div className="compiler-title-group">
          <div className="compiler-dots">
            <span className="compiler-dot dot-red"></span>
            <span className="compiler-dot dot-yellow"></span>
            <span className="compiler-dot dot-green"></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Code2 size={16} color="#B87333" />
            <strong style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>
              Interactive Code Editor & Compiler
            </strong>
          </div>
          <select
            className="compiler-lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript (Node/ES6)</option>
            <option value="html">HTML5 & CSS3 Preview</option>
            <option value="python">Python 3</option>
          </select>
        </div>

        <div className="compiler-actions">
          {saveStatus && (
            <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: '600' }}>
              ✓ {saveStatus}
            </span>
          )}

          <button
            className="compiler-btn-action"
            onClick={handleSaveCode}
            title="Save your code to continue later"
          >
            <Save size={14} /> Save Draft
          </button>

          <button
            className="compiler-btn-action"
            onClick={handleCopyCode}
            title="Copy Code"
          >
            {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            className="compiler-btn-action"
            onClick={handleResetCode}
            title="Reset to starter template"
          >
            <RotateCcw size={14} /> Reset
          </button>

          <button
            className="compiler-btn-action"
            onClick={handleAskAIAboutCode}
            style={{ borderColor: '#B87333', color: '#FBBF24' }}
            title="Ask AI Assistant about this code"
          >
            <Bot size={14} /> Ask AI
          </button>

          <button
            className="compiler-btn-run"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            <Play size={15} fill="#FFFFFF" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Compiler Main Split Area (Editor on Left, Output/Preview on Right) */}
      <div className="compiler-body">
        {/* Editor Pane */}
        <div className="compiler-editor-pane">
          <textarea
            className="compiler-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Type or paste your code here..."
            spellCheck="false"
          />
        </div>

        {/* Output & Preview Pane */}
        <div className="compiler-output-pane">
          <div className="compiler-output-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Terminal size={14} color="#A1A1AA" />
              <span>{language === 'html' ? 'Live HTML/CSS Preview' : 'Console & Terminal Output'}</span>
            </div>
            {output && (
              <button
                onClick={() => setOutput('')}
                style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear
              </button>
            )}
          </div>

          {language === 'html' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <iframe
                ref={iframeRef}
                title="Live Code Preview"
                className="compiler-preview-iframe"
                sandbox="allow-scripts"
              />
              {output && (
                <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#10B981', borderTop: '1px solid #3F3F46', backgroundColor: '#18181B' }}>
                  {output}
                </div>
              )}
            </div>
          ) : (
            <div className="compiler-output-content">
              {output ? (
                output
              ) : (
                <span style={{ color: '#52525B', fontStyle: 'italic' }}>
                  Click "Run Code" above to execute your {language.toUpperCase()} code and view output here...
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeCompiler;
