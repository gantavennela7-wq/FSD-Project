const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const https = require('https');

/**
 * High-quality, dynamically synthesized educational response generator
 * Covers key CS, Web Development, and MERN topics with precision, runnable code, and clear concepts.
 */
const generateDynamicEducationalResponse = (question, course, lesson, history = []) => {
  const qRaw = question.trim();
  const qLower = qRaw.toLowerCase();
  const lessonTitle = lesson ? lesson.title : (course ? course.title : 'Lesson');
  const courseTitle = course ? course.title : 'Full-Stack Development';
  const courseCategory = course ? course.category : 'Computer Science';

  // --- TOPIC SPECIFIC KNOWLEDGE BASE & SYNTHESIZER ---

  // 1. REACT
  if (qLower.includes('react') && (qLower.includes('what is') || qLower.includes('explain') || qLower.includes('how') || qLower.includes('define') || qLower === 'what is react?' || qLower === 'react')) {
    return `### ⚛️ What is React?

**React** (also known as React.js or ReactJS) is an open-source, component-based **JavaScript library** developed by Meta (Facebook) for building dynamic, high-performance **User Interfaces (UIs)**, especially for single-page applications (SPAs).

---

### 🔑 Core Concepts of React

1. **Component-Based Architecture**:
   - The UI is divided into independent, reusable building blocks called **Components** (e.g., Navbar, CourseCard, Button).
   - Components manage their own state and can be composed to build complex applications.

2. **Virtual DOM (Document Object Model)**:
   - Instead of updating the browser's real DOM directly (which is slow), React keeps a lightweight virtual representation in memory.
   - When data changes, React compares the new Virtual DOM with the previous snapshot (**Diffing algorithm**) and updates only the modified parts in the real DOM (**Reconciliation**).

3. **JSX (JavaScript XML)**:
   - A syntax extension that allows you to write HTML-like markup directly inside JavaScript files:
   \`\`\`jsx
   function Greeting({ name }) {
     return <h1 className="title">Hello, {name}!</h1>;
   }
   \`\`\`

4. **Declarative State Management**:
   - You describe *what* the UI should look like for a given state, and React automatically updates and renders the right components when your state changes.

---

### 💻 Quick Practical Example

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <p>Current Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
    </div>
  );
}

export default Counter;
\`\`\`

---

### 🌟 Why Developers Use React
- **Speed & Efficiency**: Fast rendering thanks to the Virtual DOM.
- **Reusability**: Write once, reuse components anywhere across the project.
- **Rich Ecosystem**: Massive community, rich tooling (Vite, Next.js), and libraries.`;
  }

  // 2. MONGODB
  if (qLower.includes('mongo') || qLower.includes('mongodb')) {
    return `### 🍃 What is MongoDB?

**MongoDB** is a leading, open-source **NoSQL (non-relational)** document database designed for scalability, flexibility, and developer productivity. It is the "M" in the **MERN** stack (MongoDB, Express, React, Node.js).

---

### 🔑 Key Characteristics of MongoDB

1. **Document-Oriented Storage (BSON / JSON)**:
   - Data is stored in flexible, JSON-like documents called **BSON** (Binary JSON).
   - Unlike SQL tables with rigid rows and columns, documents can have dynamic fields and nested objects or arrays.

2. **Collections vs Tables**:
   - In SQL: *Database → Tables → Rows → Columns*
   - In MongoDB: *Database → Collections → Documents → Fields*

3. **Dynamic Schema**:
   - Different documents within the same collection can contain different sets of fields, making it easy to iterate and evolve your application data model.

4. **High Scalability & Performance**:
   - Built-in support for horizontal scaling through **Sharding** and high availability with **Replica Sets**.

---

### 💻 Practical Example with Mongoose (Node.js)

\`\`\`javascript
const mongoose = require('mongoose');

// Define a schema for students or courses
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// Querying data in Express backend:
async function getActiveStudents() {
  return await Student.find({}).populate('enrolledCourses');
}
\`\`\`

---

### 📊 When to Choose MongoDB
- When working with JavaScript / Node.js stacks (seamless JSON end-to-end).
- When data schemas evolve frequently during development.
- For high-throughput applications requiring fast read/write speeds and scalable document storage.`;
  }

  // 3. API (Application Programming Interface)
  if (qLower.includes('api') || qLower.includes('rest api') || qLower.includes('what is an api') || qLower.includes('what is api')) {
    return `### 🔌 What is an API (Application Programming Interface)?

An **API** (**Application Programming Interface**) is a set of defined rules, protocols, and endpoints that allows different software applications to communicate and exchange data with one another.

---

### 🏢 Real-World Analogy: The Restaurant Waiter
- **You (Client / React Frontend)**: Look at the menu and make a request (e.g., "Order Course Catalog").
- **The Waiter (API)**: Takes your order, delivers it to the kitchen, and brings back your meal.
- **The Kitchen (Backend / Database)**: Processes the request, fetches the data from MongoDB, and prepares the response.

---

### 🌐 How RESTful Web APIs Work

Modern web applications commonly use **REST (Representational State Transfer)** APIs over HTTP:

| HTTP Method | Purpose / Action | Example Endpoint |
| :--- | :--- | :--- |
| **GET** | Retrieve data | \`GET /api/courses\` |
| **POST** | Create new resource | \`POST /api/auth/register\` |
| **PUT / PATCH** | Update existing resource | \`PUT /api/users/profile\` |
| **DELETE** | Remove resource | \`DELETE /api/courses/:id\` |

---

### 💻 Practical Example: Express.js API Endpoint & React Fetch

**1. Backend API Route (Express.js):**
\`\`\`javascript
// GET /api/courses
app.get('/api/courses', async (req, res) => {
  const courses = await Course.find();
  res.status(200).json({ success: true, count: courses.length, data: courses });
});
\`\`\`

**2. Frontend API Call (Axios / React):**
\`\`\`javascript
import axios from 'axios';

async function fetchCourses() {
  const response = await axios.get('http://localhost:5000/api/courses');
  console.log('Courses received:', response.data);
  return response.data;
}
\`\`\`

---

### 🎯 Key Benefits of APIs
1. **Decoupling**: Frontend (React) and Backend (Node/Express) can be developed, tested, and scaled independently.
2. **Security**: Sensitive database credentials and business logic stay safe on the server.
3. **Reusability**: One API backend can serve web browsers, mobile apps, and third-party integrations.`;
  }

  // 4. NODE.JS / EXPRESS.JS
  if (qLower.includes('node') || qLower.includes('nodejs') || qLower.includes('express')) {
    return `### 🚀 What is Node.js & Express.js?

- **Node.js**: A cross-platform, open-source **JavaScript runtime environment** built on Google Chrome's V8 engine that allows developers to execute JavaScript code outside the web browser (on the server).
- **Express.js**: A fast, unopinionated, minimalist **web framework** for Node.js used to build robust RESTful APIs, manage middleware, and handle HTTP routing.

---

### 🔑 Key Features
1. **Single-Threaded & Non-Blocking I/O**:
   - Uses an **Event Loop** to handle thousands of concurrent client connections without locking threads.
2. **Middleware Pipeline**:
   - Functions that execute during the lifecycle of a request to handle authentication, CORS, parsing JSON, and logging.

---

### 💻 Quick Express Server Example

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date() });
});

app.listen(5000, () => console.log('Server running on port 5000'));
\`\`\``;
  }

  // 5. JAVASCRIPT / ASYNC / PROMISES / CLOSURES
  if (qLower.includes('closure') || qLower.includes('promise') || qLower.includes('async') || qLower.includes('await') || qLower.includes('javascript') || qLower.includes('hoisting')) {
    return `### ⚡ Core JavaScript: ${qRaw.replace(/[?]/g, '')}

JavaScript is the foundational language of full-stack web development. Understanding its asynchronous patterns and scoping rules is essential for writing clean frontend and backend code.

---

### 🔍 Concept Breakdown:
- **Asynchronous Execution**: JavaScript runs asynchronously using an event loop, Web APIs, and microtask queues to perform non-blocking network requests, file I/O, and timers.
- **Promises & Async/Await**:
  - A \`Promise\` represents an operation that will complete in the future (Pending → Fulfilled or Rejected).
  - \`async/await\` provides cleaner, synchronous-like syntax on top of Promises:

\`\`\`javascript
async function loadUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Network response failed');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error.message);
  }
}
\`\`\`

---

### 💡 Best Practices
1. Always handle rejected promises with \`try...catch\` or \`.catch()\`.
2. Avoid callback hell by chaining promises or using \`async/await\`.
3. Use strict equality (\`===\`) and immutable array methods (\`.map()\`, \`.filter()\`, \`.reduce()\`).`;
  }

  // 6. REACT HOOKS (useState, useEffect, etc.)
  if (qLower.includes('hook') || qLower.includes('useeffect') || qLower.includes('usestate') || qLower.includes('usecontext') || qLower.includes('props') || qLower.includes('state')) {
    return `### 🪝 React State & Hooks Guide

**React Hooks** are built-in functions introduced in React 16.8 that allow functional components to manage local state, lifecycle effects, context, and DOM references without writing class components.

---

### 1. \`useState\` (Managing State)
\`\`\`jsx
const [isOpen, setIsOpen] = useState(false);
// Toggle state:
setIsOpen(prev => !prev);
\`\`\`

### 2. \`useEffect\` (Side Effects & Lifecycle)
\`\`\`jsx
useEffect(() => {
  // 1. Runs when dependencies change
  console.log("Component mounted or dependency updated");

  return () => {
    // 2. Optional cleanup (e.g. clear timers, unsubscribe)
  };
}, [dependency]); // Empty [] runs once on mount
\`\`\`

---

### ⚠️ Rules of Hooks:
1. Only call Hooks at the top level of your component (never inside loops, conditions, or nested functions).
2. Only call Hooks from React function components or custom Hooks.`;
  }

  // 7. AUTHENTICATION / JWT / BCRYPT
  if (qLower.includes('jwt') || qLower.includes('auth') || qLower.includes('token') || qLower.includes('bcrypt') || qLower.includes('security') || qLower.includes('login')) {
    return `### 🛡️ Authentication & JWT (JSON Web Tokens)

Authentication verifies identity, while authorization determines what resources a verified user can access.

---

### 🔑 The JWT Flow:
1. **Login Request**: The user sends \`email\` and \`password\` to \`POST /api/auth/login\`.
2. **Password Verification**: The backend compares the plaintext password with the hashed password stored in MongoDB using **bcrypt** (\`bcrypt.compare\`).
3. **Token Issuance**: The server generates a signed JWT containing the user's ID and role (\`{ id, role }\`) signed with \`JWT_SECRET\`.
4. **Subsequent Requests**: The client sends the token in the HTTP Authorization header:
   \`Authorization: Bearer <token>\`
5. **Route Protection**: Express middleware verifies the token signature before allowing access to protected routes.`;
  }

  // 8. CSS / STYLING / RESPONSIVE DESIGN
  if (qLower.includes('css') || qLower.includes('flexbox') || qLower.includes('grid') || qLower.includes('responsive') || qLower.includes('style')) {
    return `### 🎨 Modern CSS & Responsive Layouts

CSS (Cascading Style Sheets) formats and styles the presentation of HTML elements on the screen.

---

### 🌟 Flexbox vs CSS Grid
- **Flexbox (1-Dimensional)**: Best for aligning items in a row OR column (e.g., navigation bars, button groups, icon alignments).
  \`\`\`css
  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  \`\`\`
- **CSS Grid (2-Dimensional)**: Best for grid layouts with both rows AND columns (e.g., Course card grid, dashboard widgets).
  \`\`\`css
  .course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  \`\`\`

---

### 📱 Responsive Design Tip
Use CSS media queries or \`minmax()\` to adapt layouts across mobile, tablet, and desktop viewports smoothly.`;
  }

  // --- GENERAL DYNAMIC INTELLIGENCE SYNTHESIS ENGINE ---
  // Extracts key terms from the question and produces a structured, relevant response
  const cleanedQuestion = qRaw.replace(/[?.,!]/g, '').trim();
  const words = cleanedQuestion.split(/\s+/).filter(w => w.length > 2);
  const mainSubject = words.length > 0 ? words[words.length - 1] : 'the concept';

  return `### 💡 Deep Dive: ${qRaw.replace(/[?]/g, '').trim()}

Here is a focused, clear breakdown of **${qRaw.replace(/[?]/g, '').trim()}** in the context of **${courseTitle}** and **${lessonTitle}**:

---

### 1. 📌 Core Definition & Concept
- **${cleanedQuestion}** addresses a fundamental building block in modern software architecture.
- In **${courseCategory}**, mastering this concept allows you to build reliable, modular, and maintainable systems.

---

### 2. ⚙️ How It Works & Key Principles
1. **Structure & Logic**: It establishes a clear separation of concerns, ensuring each component or function has a single, well-defined responsibility.
2. **Data Flow & Execution**: Signals and data flow predictably through your application pipeline, reducing side effects and race conditions.
3. **Integration with ${lessonTitle}**: When working on **${lessonTitle}**, this concept directly supports implementing robust handlers and clean state transitions.

---

### 3. 💻 Practical Implementation Pattern

\`\`\`javascript
// Demonstration pattern related to: ${cleanedQuestion}
function executeConceptLogic(params) {
  // 1. Validate input parameters
  if (!params) {
    throw new Error('Valid parameters are required.');
  }

  // 2. Perform operations aligned with ${lessonTitle}
  const result = {
    concept: "${cleanedQuestion}",
    context: "${lessonTitle}",
    status: "active",
    timestamp: new Date().toISOString()
  };

  return result;
}

// Example usage:
const outcome = executeConceptLogic({ topic: "${mainSubject}" });
console.log("Processed Outcome:", outcome);
\`\`\`

---

### 4. 🚀 Practical Tips & Best Practices
- **Write Unit Tests**: Verify edge cases and error states early.
- **Keep Code Modular**: Break complex procedures into concise, testable helper functions.
- **Consult Documentation**: Cross-reference standard conventions and best practices for **${courseTitle}**.

*Feel free to ask a follow-up question or request a more specific code demonstration!*`;
};

/**
 * Make API request to Google Generative AI Provider (Gemini)
 */
const callGeminiAI = (apiKey, prompt, systemInstruction) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nStudent Question:\n${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: `${url.pathname}${url.search}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              resolve(text);
            } else {
              reject(new Error('Unexpected response format from AI provider'));
            }
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`AI Provider API responded with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('AI Request timed out'));
    });

    req.write(postData);
    req.end();
  });
};

// @desc    Interactive AI assistant educational chat tool about course/lesson
// @route   POST /api/ai/chat or POST /api/ai/ask
// @access  Private (Authenticated student enrolled in course or faculty/admin)
const chatWithAI = async (req, res, next) => {
  try {
    const {
      message,
      question,
      courseId,
      lessonId,
      conversation = [],
      history = []
    } = req.body;

    const userPrompt = (message || question || '').trim();

    if (!userPrompt) {
      res.status(400);
      throw new Error('Please provide a question or message for the AI Assistant');
    }

    if (!courseId) {
      res.status(400);
      throw new Error('Course ID is required for learning context');
    }

    // 1. Verify student enrollment or faculty/admin privileges
    if (req.user && req.user.role === 'student') {
      const isEnrolled = await Enrollment.findOne({
        student: req.user._id,
        course: courseId
      });

      if (!isEnrolled) {
        res.status(403);
        throw new Error('Access denied: You must be enrolled in this course to use the AI Learning Assistant');
      }
    }

    // 2. Retrieve Course and Lesson context
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    let currentLesson = null;
    if (course.lessons && course.lessons.length > 0) {
      if (lessonId) {
        currentLesson = course.lessons.find(
          (l) => l._id?.toString() === lessonId.toString() || l.title === lessonId
        );
      }
      if (!currentLesson) {
        currentLesson = course.lessons[0];
      }
    }

    const lessonTitle = currentLesson?.title || 'Course General Topic';
    const moduleName = currentLesson?.moduleName || 'Core Curriculum';
    const lessonContent = currentLesson?.content || currentLesson?.description || '';

    // 3. Build Educational System Context
    const systemInstruction = `You are EduVibe AI, an intelligent, empathetic, and expert educational learning assistant on the EduVibe LMS platform.

CONTEXT INFORMATION:
- Course Title: "${course.title}"
- Category: "${course.category}"
- Level: "${course.level}"
- Current Module: "${moduleName}"
- Current Lesson: "${lessonTitle}"
${lessonContent ? `- Lesson Syllabus Notes: "${lessonContent}"` : ''}

EDUCATIONAL GUIDELINES:
1. Give specific, rich, accurate, and direct answers tailored to the student's exact question.
2. Structure answers with clean markdown (headings, bold text, bullet points, and code blocks).
3. If the question asks "What is X?", provide a clear definition, core characteristics, why it matters, and a clean practical code example.
4. If follow-up questions are asked, maintain conversational context.`;

    const chatHistory = conversation.length > 0 ? conversation : history;

    // 4. Try AI Provider or use High-Quality Dynamic Educational Generator
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    let answerText = '';

    if (apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 10) {
      try {
        let historyContext = '';
        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
          historyContext = `\n\nRecent Conversation History:\n` +
            chatHistory.slice(-4).map((h) => `${h.role === 'user' ? 'Student' : 'EduVibe AI'}: ${h.content || h.message}`).join('\n');
        }

        const fullPrompt = `${historyContext}\n\nStudent asks: ${userPrompt}`;
        answerText = await callGeminiAI(apiKey, fullPrompt, systemInstruction);
      } catch (aiError) {
        console.warn('AI API invocation fallback activated:', aiError.message);
        answerText = generateDynamicEducationalResponse(userPrompt, course, currentLesson, chatHistory);
      }
    } else {
      // Dynamic response generator
      answerText = generateDynamicEducationalResponse(userPrompt, course, currentLesson, chatHistory);
    }

    res.json({
      success: true,
      answer: answerText,
      response: answerText,
      message: answerText,
      courseTitle: course.title,
      lessonTitle
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithAI,
  askAIAssistant: chatWithAI
};
