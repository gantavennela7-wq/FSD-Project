const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const LearningAttendance = require('../models/LearningAttendance');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleCourses = [
  {
    title: 'Python Programming Masterclass',
    description: 'From beginner basics to advanced Object-Oriented Programming, file automation, and data handling in Python 3. Perfect for aspiring developers and data analysts.',
    instructor: 'Prof. Alan Turing',
    category: 'Programming',
    level: 'Beginner',
    duration: '8 Weeks',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Python Setup & Syntax Basics', moduleName: 'Module 1: Essentials', content: 'Install Python, understand variables, data types, string manipulation, user input, and print formatting.', duration: '15 mins' },
      { title: 'Lesson 2: Control Flow & Loops', moduleName: 'Module 1: Essentials', content: 'Master conditional logic (if-elif-else), while loops, for loops, break/continue statements, and range functions.', duration: '25 mins' },
      { title: 'Lesson 3: Functions & Modular Code', moduleName: 'Module 2: Functions & Modules', content: 'Define reusable functions, positional arguments, keyword parameters, return values, scope, and built-in modules.', duration: '30 mins' },
      { title: 'Lesson 4: Data Structures (Lists, Tuples, Dicts)', moduleName: 'Module 2: Functions & Modules', content: 'Manipulate lists, list comprehensions, tuples, dictionaries, sets, and common data operations.', duration: '35 mins' },
      { title: 'Lesson 5: Object-Oriented Programming (OOP)', moduleName: 'Module 3: Advanced OOP', content: 'Learn classes, instances, inheritance, encapsulation, magic methods (__init__, __str__), and polymorphism.', duration: '45 mins' }
    ]
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Master core computer science algorithmic thinking. Learn arrays, linked lists, trees, graphs, sorting algorithms, and Big-O space-time complexity analysis.',
    instructor: 'Prof. Michael Chen',
    category: 'Computer Science',
    level: 'Intermediate',
    duration: '10 Weeks',
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Big-O Complexity & Time Space Analysis', moduleName: 'Module 1: Complexity Theory', content: 'Understand worst-case, average-case, and best-case analysis. Calculate time complexities (O(1), O(n), O(log n), O(n^2)).', duration: '20 mins' },
      { title: 'Lesson 2: Arrays, Strings & Dynamic Memory', moduleName: 'Module 1: Complexity Theory', content: 'Explore sliding window technique, two pointers algorithm, string manipulation, and dynamic array allocation.', duration: '30 mins' },
      { title: 'Lesson 3: Linked Lists & Stack Queue Implementations', moduleName: 'Module 2: Linear Structures', content: 'Build singly/doubly linked lists, LIFO Stacks, FIFO Queues, and practice common interview questions.', duration: '40 mins' },
      { title: 'Lesson 4: Binary Search Trees & Heaps', moduleName: 'Module 3: Trees & Graphs', content: 'Understand tree traversals (In-order, Pre-order, Post-order), BST operations, priority queues, and max/min heaps.', duration: '45 mins' },
      { title: 'Lesson 5: Graph Algorithms (BFS & DFS)', moduleName: 'Module 3: Trees & Graphs', content: 'Represent graphs with adjacency lists, implement Breadth-First Search, Depth-First Search, and shortest path algorithms.', duration: '50 mins' }
    ]
  },
  {
    title: 'Machine Learning Fundamentals',
    description: 'Explore supervised and unsupervised machine learning algorithms using Python, NumPy, Pandas, and Scikit-Learn. Build predictive models from datasets.',
    instructor: 'Dr. Elena Rostova',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '14 Weeks',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Introduction to Data Science Stack', moduleName: 'Module 1: Data Foundations', content: 'Environment setup with Jupyter notebooks, NumPy matrix math operations, and Pandas dataframe data cleaning.', duration: '25 mins' },
      { title: 'Lesson 2: Linear Regression & Model Evaluation', moduleName: 'Module 1: Data Foundations', content: 'Understand simple & multiple linear regression, cost functions, gradient descent, MSE, and R-squared metrics.', duration: '35 mins' },
      { title: 'Lesson 3: Classification with Logistic Regression & Decision Trees', moduleName: 'Module 2: Supervised Learning', content: 'Build classification models, confusion matrices, precision, recall, F1 score, ROC curves, and decision trees.', duration: '45 mins' },
      { title: 'Lesson 4: Clustering & Unsupervised K-Means', moduleName: 'Module 2: Supervised Learning', content: 'Learn clustering algorithms, K-Means elbow method, Principal Component Analysis (PCA) for dimensionality reduction.', duration: '40 mins' },
      { title: 'Lesson 5: Neural Networks & Deep Learning Overview', moduleName: 'Module 3: Deep Learning', content: 'Introduction to artificial neural networks, activation functions, backpropagation, and training pipeline concepts.', duration: '55 mins' }
    ]
  },
  {
    title: 'Full Stack MERN Development',
    description: 'Master complete full-stack web application development using MongoDB, Express.js, React, and Node.js. Build real-world APIs, authentication systems, and responsive frontends.',
    instructor: 'Dr. Sarah Jenkins',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '12 Weeks',
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Module 1: Introduction to Full Stack Architecture', moduleName: 'Module 1: Foundations', content: 'Overview of client-server architecture, HTTP requests, REST APIs, JSON data structures, and setting up your Node.js workspace.', duration: '20 mins' },
      { title: 'Module 2: Building Backend APIs with Express & Node', moduleName: 'Module 1: Foundations', content: 'Learn Express routing, middleware architecture, request handling, error handlers, and environment setup.', duration: '35 mins' },
      { title: 'Module 3: Database Modeling with MongoDB & Mongoose', moduleName: 'Module 2: Database Layer', content: 'Understand NoSQL document databases, schema definitions, model validation, and relationships using Mongoose ORM.', duration: '40 mins' },
      { title: 'Module 4: User Auth with JWT & Bcrypt', moduleName: 'Module 2: Database Layer', content: 'Implement secure password hashing with bcryptjs, JWT token sign/verify, role authorization, and headers.', duration: '45 mins' },
      { title: 'Module 5: Modern React Frontend & State Management', moduleName: 'Module 3: Frontend Client', content: 'Build modular React components, custom hooks, Axios API layer, React Router routes, and global Context state.', duration: '50 mins' }
    ]
  },
  {
    title: 'Java Programming',
    description: 'Build strong object-oriented programming fundamentals with Java. Master syntax, classes, memory management, exception handling, and multithreading.',
    instructor: 'James Gosling',
    category: 'Programming',
    level: 'Beginner',
    duration: '9 Weeks',
    rating: 4.7,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Java JDK Setup & Basics', moduleName: 'Module 1: Basics', content: 'Setup JDK, understanding JVM, JRE, primitive types, and writing your first Java main method.', duration: '20 mins' },
      { title: 'Lesson 2: Control Structures & Arrays', moduleName: 'Module 1: Basics', content: 'Conditionals, loops, 1D and 2D array structures, and console input handling.', duration: '25 mins' },
      { title: 'Lesson 3: Object-Oriented Principles', moduleName: 'Module 2: OOP Principles', content: 'Encapsulation, Constructors, Access Modifiers, and Class inheritance.', duration: '35 mins' },
      { title: 'Lesson 4: Interfaces & Abstract Classes', moduleName: 'Module 2: OOP Principles', content: 'Polymorphism, abstraction, interface contracts, and lambda expressions.', duration: '30 mins' },
      { title: 'Lesson 5: Exception Handling & File I/O', moduleName: 'Module 3: Advanced Java', content: 'Try-catch blocks, custom exceptions, file readers/writers, and stream operations.', duration: '40 mins' }
    ]
  },
  {
    title: 'JavaScript Complete Guide',
    description: 'Comprehensive guide to modern JavaScript (ES6+). Learn DOM manipulation, asynchronous promises, async/await, closures, and event loops.',
    instructor: 'Brendan Eich',
    category: 'Web Development',
    level: 'Beginner',
    duration: '6 Weeks',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Variables, Data Types & Operators', moduleName: 'Module 1: Core JavaScript', content: 'Var, let, const scopes, template literals, type coercion, and strict equality.', duration: '15 mins' },
      { title: 'Lesson 2: Functions & Arrow Syntax', moduleName: 'Module 1: Core JavaScript', content: 'Function declarations, expressions, arrow functions, default parameters, and rest operators.', duration: '20 mins' },
      { title: 'Lesson 3: DOM Manipulation & Event Handling', moduleName: 'Module 2: Web Interactivity', content: 'Query selectors, event listeners, DOM tree traversal, and dynamic element creation.', duration: '30 mins' },
      { title: 'Lesson 4: Asynchronous JavaScript (Promises & Fetch)', moduleName: 'Module 3: Async JS', content: 'Callbacks, Promises, Async/Await syntax, Fetch API, and handling JSON responses.', duration: '35 mins' },
      { title: 'Lesson 5: ES6+ Modules & Tooling', moduleName: 'Module 3: Async JS', content: 'Import/Export modules, bundlers overview, localStorage, and clean code techniques.', duration: '25 mins' }
    ]
  },
  {
    title: 'React.js Development',
    description: 'Learn modern React with Hooks, Component Architecture, React Router, State Management, and API integration to build interactive web apps.',
    instructor: 'Dan Abramov',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '8 Weeks',
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: JSX & Component Basics', moduleName: 'Module 1: React Fundamentals', content: 'Understanding JSX syntax, functional components, props passing, and key props.', duration: '20 mins' },
      { title: 'Lesson 2: State Management with useState', moduleName: 'Module 1: React Fundamentals', content: 'Managing local component state, form inputs, list rendering, and conditional views.', duration: '25 mins' },
      { title: 'Lesson 3: Side Effects & useEffect Hook', moduleName: 'Module 2: Hooks & Routing', content: 'Lifecycle management, data fetching, cleanup functions, and dependency arrays.', duration: '35 mins' },
      { title: 'Lesson 4: Context API & Custom Hooks', moduleName: 'Module 2: Hooks & Routing', content: 'Global state management with createContext, useContext, and reusable custom hooks.', duration: '40 mins' },
      { title: 'Lesson 5: Performance & Production Deployment', moduleName: 'Module 3: Production', content: 'Memoization with useMemo/useCallback, React Router routes, and Vite build optimization.', duration: '45 mins' }
    ]
  },
  {
    title: 'Node.js & Express.js',
    description: 'Master backend web service engineering with Node.js and Express. Build RESTful APIs, handle request routing, custom middleware, and authentication.',
    instructor: 'Ryan Dahl',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '7 Weeks',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Node.js Architecture & Event Loop', moduleName: 'Module 1: Node Core', content: 'Non-blocking I/O, event-driven architecture, module system, and NPM scripts.', duration: '20 mins' },
      { title: 'Lesson 2: Express Server & Router Setup', moduleName: 'Module 1: Node Core', content: 'Creating Express apps, route parameters, query strings, and response formatting.', duration: '25 mins' },
      { title: 'Lesson 3: Custom & Built-in Middleware', moduleName: 'Module 2: Express Middleware', content: 'Logger middleware, CORS, body-parsers, and centralized error handling.', duration: '30 mins' },
      { title: 'Lesson 4: REST API Design & CRUD Operations', moduleName: 'Module 2: Express Middleware', content: 'Designing REST endpoints, HTTP methods, status codes, and payload validation.', duration: '35 mins' },
      { title: 'Lesson 5: Security Best Practices', moduleName: 'Module 3: Backend Security', content: 'Environment variables, rate limiting, CORS configuration, and JWT authentication.', duration: '40 mins' }
    ]
  },
  {
    title: 'Database Management with MongoDB',
    description: 'In-depth guide to NoSQL document databases with MongoDB. Master Mongoose schemas, document relationships, indexing, aggregation pipelines, and security.',
    instructor: 'Eliot Horowitz',
    category: 'Database',
    level: 'Intermediate',
    duration: '6 Weeks',
    rating: 4.7,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: NoSQL & Document Storage Concepts', moduleName: 'Module 1: MongoDB Basics', content: 'JSON/BSON data structures, MongoDB Atlas setup, collections, and documents.', duration: '20 mins' },
      { title: 'Lesson 2: CRUD Operations & Query Selectors', moduleName: 'Module 1: MongoDB Basics', content: 'Inserting, updating, deleting, and querying documents with comparison operators.', duration: '25 mins' },
      { title: 'Lesson 3: Mongoose Schemas & Models', moduleName: 'Module 2: Mongoose ORM', content: 'Schema definitions, field validations, pre/post middleware hooks, and methods.', duration: '35 mins' },
      { title: 'Lesson 4: Document Relationships & Population', moduleName: 'Module 2: Mongoose ORM', content: 'Embedding vs Referencing, subdocuments, and Mongoose populate queries.', duration: '30 mins' },
      { title: 'Lesson 5: Aggregation Framework & Indexing', moduleName: 'Module 3: Aggregation', content: 'Match, group, project, sort stages in aggregation pipelines and database indexing.', duration: '40 mins' }
    ]
  },
  {
    title: 'SQL & Database Fundamentals',
    description: 'Learn relational database management system concepts. Write clean SQL queries, table joins, transactions, constraints, and data normalization.',
    instructor: 'Edgar Codd',
    category: 'Database',
    level: 'Beginner',
    duration: '5 Weeks',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Relational Database Principles', moduleName: 'Module 1: SQL Core', content: 'RDBMS concepts, tables, columns, rows, primary keys, and foreign keys.', duration: '15 mins' },
      { title: 'Lesson 2: Basic SQL Queries (SELECT, WHERE, ORDER BY)', moduleName: 'Module 1: SQL Core', content: 'Filtering data, sorting results, aggregate functions (COUNT, SUM, AVG).', duration: '25 mins' },
      { title: 'Lesson 3: Table Joins (INNER, LEFT, RIGHT)', moduleName: 'Module 2: Advanced SQL', content: 'Combining data across multiple tables using foreign keys and JOIN clauses.', duration: '35 mins' },
      { title: 'Lesson 4: Data Manipulation (INSERT, UPDATE, DELETE)', moduleName: 'Module 2: Advanced SQL', content: 'Modifying table data, constraints (NOT NULL, UNIQUE, CHECK), and transactions.', duration: '30 mins' },
      { title: 'Lesson 5: Database Normalization (1NF to 3NF)', moduleName: 'Module 3: Schema Design', content: 'Designing efficient relational schemas, reducing redundancy, and ER diagrams.', duration: '35 mins' }
    ]
  },
  {
    title: 'Artificial Intelligence Fundamentals',
    description: 'Discover the foundations of Artificial Intelligence. Understand search algorithms, knowledge representation, expert systems, computer vision, and NLP.',
    instructor: 'Dr. Geoffrey Hinton',
    category: 'Artificial Intelligence',
    level: 'Beginner',
    duration: '10 Weeks',
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Introduction to AI & Symbolic Reasoning', moduleName: 'Module 1: AI Foundations', content: 'History of AI, Turing test, intelligent agents, and problem formulation.', duration: '20 mins' },
      { title: 'Lesson 2: Uninformed & Informed Search Algorithms', moduleName: 'Module 1: AI Foundations', content: 'BFS, DFS, A* search, heuristic functions, and game playing algorithms.', duration: '30 mins' },
      { title: 'Lesson 3: Knowledge Representation & Logic', moduleName: 'Module 2: Reasoning & Knowledge', content: 'Propositional logic, first-order logic, rule-based systems, and ontology.', duration: '35 mins' },
      { title: 'Lesson 4: Natural Language Processing Overview', moduleName: 'Module 3: Modern AI', content: 'Tokenization, text normalization, sentiment analysis, and language models.', duration: '40 mins' },
      { title: 'Lesson 5: Computer Vision Basics', moduleName: 'Module 3: Modern AI', content: 'Image preprocessing, edge detection, feature extraction, and object recognition.', duration: '45 mins' }
    ]
  },
  {
    title: 'Deep Learning with Neural Networks',
    description: 'Master deep neural networks, Convolutional Networks (CNNs), Recurrent Networks (RNNs), Transformers, PyTorch, and TensorFlow for complex AI tasks.',
    instructor: 'Dr. Yann LeCun',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    duration: '12 Weeks',
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Perceptrons & Multi-Layer Neural Networks', moduleName: 'Module 1: Deep Learning Core', content: 'Single layer perceptrons, forward propagation, activation functions (ReLU, Sigmoid, Softmax).', duration: '25 mins' },
      { title: 'Lesson 2: Backpropagation & Optimization Algorithms', moduleName: 'Module 1: Deep Learning Core', content: 'Gradient descent, Adam optimizer, loss functions, learning rate schedules, and vanishing gradients.', duration: '35 mins' },
      { title: 'Lesson 3: Convolutional Neural Networks (CNNs)', moduleName: 'Module 2: Computer Vision & CNNs', content: 'Convolution operations, pooling layers, feature maps, and image classification architectures.', duration: '45 mins' },
      { title: 'Lesson 4: Recurrent Neural Networks & LSTMs', moduleName: 'Module 2: Computer Vision & CNNs', content: 'Sequence modelling, vanishing gradient in RNNs, LSTM gates, and time series analysis.', duration: '50 mins' },
      { title: 'Lesson 5: Attention Mechanisms & Transformer Models', moduleName: 'Module 3: Transformers', content: 'Self-attention, Transformer architecture, BERT, GPT overview, and fine-tuning models.', duration: '55 mins' }
    ]
  },
  {
    title: 'Data Science with Python',
    description: 'Learn end-to-end data analysis workflows using NumPy, Pandas, Matplotlib, Seaborn, and statistical hypothesis testing in Python.',
    instructor: 'Wes McKinney',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '11 Weeks',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Scientific Computing with NumPy', moduleName: 'Module 1: Scientific Computing', content: 'N-dimensional arrays, vectorization, broadcasting, indexing, and linear algebra routines.', duration: '20 mins' },
      { title: 'Lesson 2: Data Manipulation with Pandas', moduleName: 'Module 1: Scientific Computing', content: 'DataFrames, Series, reading CSV/Excel/SQL, handling missing values, and group-by aggregations.', duration: '30 mins' },
      { title: 'Lesson 3: Data Visualization with Matplotlib & Seaborn', moduleName: 'Module 2: Data Exploration', content: 'Line plots, bar charts, scatter plots, heatmaps, box plots, and custom styling.', duration: '35 mins' },
      { title: 'Lesson 4: Exploratory Data Analysis (EDA)', moduleName: 'Module 2: Data Exploration', content: 'Outlier detection, distribution analysis, correlation matrices, and feature engineering.', duration: '40 mins' },
      { title: 'Lesson 5: Statistical Inference & Hypothesis Testing', moduleName: 'Module 3: Statistics', content: 'Probability distributions, confidence intervals, p-values, t-tests, and A/B testing methodology.', duration: '45 mins' }
    ]
  },
  {
    title: 'HTML & CSS Web Development',
    description: 'The definitive foundation for web developers. Master modern semantic HTML5, CSS Flexbox, Grid, CSS Variables, and responsive web design.',
    instructor: 'Tim Berners-Lee',
    category: 'Web Development',
    level: 'Beginner',
    duration: '4 Weeks',
    rating: 4.7,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Semantic HTML5 Elements & Structure', moduleName: 'Module 1: HTML Fundamentals', content: 'Document structure, semantic tags (header, nav, main, section), forms, and accessibility.', duration: '15 mins' },
      { title: 'Lesson 2: CSS Styling Basics & Box Model', moduleName: 'Module 1: HTML Fundamentals', content: 'Selectors, specificity, margin, border, padding, sizing, and color systems.', duration: '20 mins' },
      { title: 'Lesson 3: Flexbox Layout System', moduleName: 'Module 2: Modern Layouts', content: 'Flex containers, flex direction, justify-content, align-items, flex-wrap, and responsive alignment.', duration: '25 mins' },
      { title: 'Lesson 4: CSS Grid & Responsive Media Queries', moduleName: 'Module 2: Modern Layouts', content: 'Grid template columns, gaps, auto-fit/auto-fill, minmax(), and responsive breakpoint queries.', duration: '30 mins' },
      { title: 'Lesson 5: Transitions & CSS Custom Properties', moduleName: 'Module 3: Styling Techniques', content: 'CSS variables, hover transitions, transform effects, keyframe animations, and light/dark modes.', duration: '30 mins' }
    ]
  },
  {
    title: 'Git & GitHub Essentials',
    description: 'Master source code control with Git and GitHub. Learn branching strategies, merging, pull requests, resolving conflicts, and team collaboration workflows.',
    instructor: 'Linus Torvalds',
    category: 'Development Tools',
    level: 'Beginner',
    duration: '3 Weeks',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
    lessons: [
      { title: 'Lesson 1: Git Installation & Core Commands', moduleName: 'Module 1: Version Control Basics', content: 'Git init, staging area, git add, git commit, git status, and commit log inspection.', duration: '15 mins' },
      { title: 'Lesson 2: Branching & Merging Workflows', moduleName: 'Module 1: Version Control Basics', content: 'Creating branches, switching branches, merging changes, and understanding HEAD pointers.', duration: '20 mins' },
      { title: 'Lesson 3: Resolving Merge Conflicts', moduleName: 'Module 2: Conflict Resolution', content: 'Identifying conflict markers, resolving manual diffs, staging resolved files, and committing.', duration: '25 mins' },
      { title: 'Lesson 4: Remote Repositories & GitHub', moduleName: 'Module 2: Conflict Resolution', content: 'Git remote add, git push, git pull, cloning repositories, and SSH keys setup.', duration: '30 mins' },
      { title: 'Lesson 5: Pull Requests & Open Source Collaboration', moduleName: 'Module 3: GitHub Collaboration', content: 'Forking, branching strategy (Git Flow), creating pull requests, code reviews, and issues.', duration: '35 mins' }
    ]
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms_db';
    await mongoose.connect(mongoUri);
    console.log('Seed connection established with MongoDB');

    // Clear existing collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await LearningAttendance.deleteMany({});

    console.log('Existing collections cleared.');

    // Helper for today & previous date strings
    const now = new Date();
    const getFormattedDate = (offsetDays = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() - offsetDays);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Create Admin User
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Sample Admin Created: admin@lms.com / admin123');

    // Create Faculty Users
    const faculty1 = await User.create({
      name: 'Prof. Alan Turing',
      email: 'faculty@lms.com',
      password: 'faculty123',
      role: 'faculty',
      facultyId: 'FAC-1001',
      department: 'Computer Science',
      designation: 'Professor & Chair',
      qualification: 'Ph.D. in Computer Science',
      specialization: 'Algorithms, Data Structures & Python',
      experience: '12 Years',
      phone: '+1 (555) 234-5678',
      bio: 'Pioneering computer scientist and educator passionate about algorithmic theory and computational foundations.',
      status: 'Active'
    });

    const faculty2 = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'sarah@lms.com',
      password: 'faculty123',
      role: 'faculty',
      facultyId: 'FAC-1002',
      department: 'Web & Software Engineering',
      designation: 'Associate Professor',
      qualification: 'M.Tech, Ph.D. in Web Systems',
      specialization: 'Full Stack MERN, React Architecture & Node.js',
      experience: '8 Years',
      phone: '+1 (555) 876-5432',
      bio: 'Full-stack engineering specialist and technical mentor helping developers master scalable cloud web architecture.',
      status: 'Active'
    });
    console.log('Sample Faculty Created: faculty@lms.com / faculty123, sarah@lms.com / faculty123');

    // Create Student Users with streak tracking properties
    const student1 = await User.create({
      name: 'John Doe',
      email: 'student@lms.com',
      password: 'student123',
      role: 'student',
      phone: '+1 (555) 111-2222',
      currentStreak: 7,
      longestStreak: 12,
      lastActiveDate: getFormattedDate(0),
      totalLearningDays: 18
    });

    const student2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@lms.com',
      password: 'student123',
      role: 'student',
      phone: '+1 (555) 333-4444',
      currentStreak: 4,
      longestStreak: 8,
      lastActiveDate: getFormattedDate(0),
      totalLearningDays: 14
    });

    const student3 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@lms.com',
      password: 'student123',
      role: 'student',
      phone: '+1 (555) 555-6666',
      currentStreak: 5,
      longestStreak: 9,
      lastActiveDate: getFormattedDate(0),
      totalLearningDays: 16
    });

    const student4 = await User.create({
      name: 'Anjali Patel',
      email: 'anjali@lms.com',
      password: 'student123',
      role: 'student',
      phone: '+1 (555) 777-8888',
      currentStreak: 2,
      longestStreak: 5,
      lastActiveDate: getFormattedDate(1),
      totalLearningDays: 9
    });
    console.log('Sample Students Created: student@lms.com, jane@lms.com, rahul@lms.com, anjali@lms.com / student123');

    // Attach faculty IDs to courses
    const preparedCourses = sampleCourses.map((course, idx) => {
      const assignedFaculty = idx % 2 === 0 ? faculty1 : faculty2;
      return {
        ...course,
        instructor: assignedFaculty._id,
        instructorName: assignedFaculty.name,
        prerequisites: 'Basic familiarity with computer usage and modern browsers.',
        learningObjectives: 'Gain hands-on proficiency, build real-world projects, and master core concepts.'
      };
    });

    // Insert All Sample Courses
    const createdCourses = await Course.insertMany(preparedCourses);
    console.log(`Inserted ${createdCourses.length} sample courses successfully!`);

    // Create sample enrollments for faculty1 and faculty2 courses
    const pythonCourse = createdCourses.find((c) => c.title.includes('Python'));
    const dsaCourse = createdCourses.find((c) => c.title.includes('Data Structures'));
    const mernCourse = createdCourses.find((c) => c.title.includes('MERN'));
    const reactCourse = createdCourses.find((c) => c.title.includes('React'));

    if (pythonCourse) {
      await Enrollment.create({
        student: student1._id,
        course: pythonCourse._id,
        progress: 100,
        completedLessons: pythonCourse.lessons.map((l) => l._id.toString()),
        status: 'Completed',
        enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      });

      await Enrollment.create({
        student: student2._id,
        course: pythonCourse._id,
        progress: 40,
        completedLessons: [pythonCourse.lessons[0]._id.toString(), pythonCourse.lessons[1]._id.toString()],
        status: 'In Progress',
        enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      });

      await Enrollment.create({
        student: student4._id,
        course: pythonCourse._id,
        progress: 50,
        completedLessons: [pythonCourse.lessons[0]._id.toString(), pythonCourse.lessons[1]._id.toString()],
        status: 'In Progress',
        enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      });
    }

    if (dsaCourse) {
      await Enrollment.create({
        student: student3._id,
        course: dsaCourse._id,
        progress: 100,
        completedLessons: dsaCourse.lessons.map((l) => l._id.toString()),
        status: 'Completed',
        enrolledAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      });
    }

    if (mernCourse) {
      await Enrollment.create({
        student: student3._id,
        course: mernCourse._id,
        progress: 75,
        completedLessons: [
          mernCourse.lessons[0]._id.toString(),
          mernCourse.lessons[1]._id.toString(),
          mernCourse.lessons[2]._id.toString()
        ],
        status: 'In Progress',
        enrolledAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      });

      await Enrollment.create({
        student: student1._id,
        course: mernCourse._id,
        progress: 40,
        completedLessons: [mernCourse.lessons[0]._id.toString(), mernCourse.lessons[1]._id.toString()],
        status: 'In Progress',
        enrolledAt: new Date()
      });
    }

    if (reactCourse) {
      await Enrollment.create({
        student: student2._id,
        course: reactCourse._id,
        progress: 20,
        completedLessons: [reactCourse.lessons[0]._id.toString()],
        status: 'In Progress',
        enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      });
    }

    console.log('Sample enrollments created.');

    // Seed Sample Daily Learning Attendance records for the calendar
    const attendanceRecords = [];
    const studentsList = [student1, student2, student3, student4];

    // For student1 (John Doe - 7 day streak)
    for (let offset = 0; offset < 7; offset++) {
      attendanceRecords.push({
        student: student1._id,
        date: getFormattedDate(offset),
        course: mernCourse ? mernCourse._id : createdCourses[0]._id,
        activityType: offset % 2 === 0 ? 'lesson_completed' : 'lesson_started',
        duration: 25
      });
    }
    // Additional past days this month for student1
    [10, 12, 14, 16, 18, 20].forEach((offset) => {
      attendanceRecords.push({
        student: student1._id,
        date: getFormattedDate(offset),
        course: pythonCourse ? pythonCourse._id : createdCourses[0]._id,
        activityType: 'lesson_completed',
        duration: 30
      });
    });

    // For student2 (Jane Smith - 4 day streak)
    for (let offset = 0; offset < 4; offset++) {
      attendanceRecords.push({
        student: student2._id,
        date: getFormattedDate(offset),
        course: reactCourse ? reactCourse._id : createdCourses[0]._id,
        activityType: 'lesson_started',
        duration: 20
      });
    }

    // For student3 (Rahul Sharma - 5 day streak)
    for (let offset = 0; offset < 5; offset++) {
      attendanceRecords.push({
        student: student3._id,
        date: getFormattedDate(offset),
        course: mernCourse ? mernCourse._id : createdCourses[0]._id,
        activityType: 'lesson_completed',
        duration: 35
      });
    }

    // For student4 (Anjali Patel - 2 day streak)
    for (let offset = 1; offset <= 2; offset++) {
      attendanceRecords.push({
        student: student4._id,
        date: getFormattedDate(offset),
        course: pythonCourse ? pythonCourse._id : createdCourses[0]._id,
        activityType: 'lesson_started',
        duration: 15
      });
    }

    await LearningAttendance.insertMany(attendanceRecords);
    console.log(`Inserted ${attendanceRecords.length} sample daily learning attendance records!`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
