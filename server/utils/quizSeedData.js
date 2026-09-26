/**
 * Seed Quiz Questions Generator for EduVibe LMS Courses
 * Maps course titles or categories to comprehensive, realistic MCQs
 */

const courseQuizBank = {
  python: {
    title: 'Python Fundamentals & OOP Certification Quiz',
    description: 'Evaluate your knowledge of Python syntax, data types, control flow, functions, lists/dictionaries, and OOP concepts.',
    passingPercentage: 70,
    questions: [
      {
        question: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 1,
        explanation: 'In Python, functions are defined using the `def` keyword followed by the function name and parentheses.'
      },
      {
        question: 'Which data structure in Python is immutable?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        correctAnswer: 3,
        explanation: 'Tuples are immutable sequences in Python; once created, their elements cannot be modified, added, or removed.'
      },
      {
        question: 'What is the correct file extension for Python files?',
        options: ['.py', '.python', '.pyt', '.pt'],
        correctAnswer: 0,
        explanation: 'Python source files use the standard `.py` extension.'
      },
      {
        question: 'How do you insert comments in Python code?',
        options: ['// this is a comment', '/* this is a comment */', '# this is a comment', '<!-- this is a comment -->'],
        correctAnswer: 2,
        explanation: 'Single-line comments in Python begin with the `#` symbol.'
      },
      {
        question: 'Which built-in function returns the number of items in an object in Python?',
        options: ['count()', 'size()', 'len()', 'length()'],
        correctAnswer: 2,
        explanation: 'The `len()` function returns the length (the number of items) of an object such as a string, list, or tuple.'
      },
      {
        question: 'What does the `__init__` method represent in Python classes?',
        options: ['A static initializer', 'The class constructor / initializer method', 'A destructor method', 'An abstract method'],
        correctAnswer: 1,
        explanation: 'The `__init__` method is the constructor in Python that is automatically called when a new class instance is instantiated.'
      },
      {
        question: 'What is the output of `type([])` in Python?',
        options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'set'>"],
        correctAnswer: 0,
        explanation: 'Square brackets `[]` define a list object in Python, whose type is `<class \'list\'>`.'
      },
      {
        question: 'Which keyword is used for exception handling in Python to catch errors?',
        options: ['catch', 'except', 'handle', 'rescue'],
        correctAnswer: 1,
        explanation: 'Python uses `try` and `except` blocks for handling exceptions.'
      }
    ]
  },
  dsa: {
    title: 'Data Structures & Algorithms Proficiency Quiz',
    description: 'Test your understanding of Big-O complexity, linear and non-linear data structures, trees, and graph algorithms.',
    passingPercentage: 70,
    questions: [
      {
        question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'In a balanced BST, each comparison cuts the search space in half, resulting in O(log n) time complexity.'
      },
      {
        question: 'Which data structure operates on a Last In, First Out (LIFO) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Heap'],
        correctAnswer: 1,
        explanation: 'A Stack stores elements in LIFO order where the last element inserted is the first one removed (pop).'
      },
      {
        question: 'Which algorithm is typically used to find the shortest path in an unweighted graph?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Kruskal Algorithm', 'Floyd-Warshall'],
        correctAnswer: 1,
        explanation: 'Breadth-First Search (BFS) explores all vertices layer by layer and finds the shortest path in unweighted graphs.'
      },
      {
        question: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
        correctAnswer: 2,
        explanation: 'When the chosen pivot is consistently the smallest or largest element, QuickSort degrades to O(n^2).'
      },
      {
        question: 'In a singly linked list, what is the time complexity to insert a node at the head (beginning)?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctAnswer: 0,
        explanation: 'Inserting at the head simply requires updating the new node\'s next pointer and head pointer, taking constant O(1) time.'
      },
      {
        question: 'Which data structure is internally used to implement recursion?',
        options: ['Call Stack', 'Priority Queue', 'Circular Buffer', 'Hash Map'],
        correctAnswer: 0,
        explanation: 'Programming language runtimes use the internal call stack to maintain execution contexts across recursive calls.'
      }
    ]
  },
  mern: {
    title: 'Full Stack MERN Development Assessment Quiz',
    description: 'Assess your skills in MongoDB, Express.js, React hooks & components, Node.js, and RESTful API architecture.',
    passingPercentage: 70,
    questions: [
      {
        question: 'In the MERN stack, what does the acronym stand for?',
        options: [
          'MySQL, Express, React, Node',
          'MongoDB, Express, React, Node.js',
          'MongoDB, Ember, Redux, Next.js',
          'MariaDB, Express, Ruby, Node'
        ],
        correctAnswer: 1,
        explanation: 'MERN stands for MongoDB (database), Express.js (backend framework), React (frontend library), and Node.js (runtime).'
      },
      {
        question: 'Which React hook is used to handle side effects such as data fetching and subscriptions?',
        options: ['useState', 'useMemo', 'useEffect', 'useCallback'],
        correctAnswer: 2,
        explanation: '`useEffect` lets you perform side effects in functional React components after rendering.'
      },
      {
        question: 'How do you pass data from a parent React component to a child component?',
        options: ['Via State', 'Via Props', 'Via Redux only', 'Via URL params only'],
        correctAnswer: 1,
        explanation: 'Props (short for properties) are the standard mechanism to pass data down from parent to child components.'
      },
      {
        question: 'In Express.js, what is the purpose of middleware functions?',
        options: [
          'To format CSS stylesheets',
          'To execute code, modify req/res objects, and end the request-response cycle',
          'To directly query the browser localStorage',
          'To compile JSX templates into HTML'
        ],
        correctAnswer: 1,
        explanation: 'Express middleware functions have access to `req`, `res`, and the `next` function to perform tasks like auth, logging, and body parsing.'
      },
      {
        question: 'Which MongoDB command or method is used to insert a single document into a collection?',
        options: ['db.collection.add()', 'db.collection.insertOne()', 'db.collection.saveDoc()', 'db.collection.put()'],
        correctAnswer: 1,
        explanation: '`insertOne()` is the official MongoDB method to insert a single document into a specified collection.'
      },
      {
        question: 'What HTTP status code represents "Created" when a new resource is successfully saved via POST?',
        options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
        correctAnswer: 1,
        explanation: 'HTTP status code 201 indicates that a request has succeeded and led to the creation of a new resource.'
      }
    ]
  },
  ai: {
    title: 'Machine Learning & AI Principles Quiz',
    description: 'Test your understanding of supervised learning, regression, classification, neural networks, and model validation.',
    passingPercentage: 70,
    questions: [
      {
        question: 'Which type of Machine Learning uses labeled datasets to train models?',
        options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Self-Supervised Learning without labels'],
        correctAnswer: 0,
        explanation: 'Supervised Learning uses input data paired with correct target labels to train algorithms to make predictions.'
      },
      {
        question: 'Which evaluation metric is ideal for balanced binary classification problems?',
        options: ['Mean Squared Error (MSE)', 'Accuracy & F1-Score', 'R-Squared', 'Inertia'],
        correctAnswer: 1,
        explanation: 'Accuracy, Precision, Recall, and F1-Score are primary metrics for classification tasks.'
      },
      {
        question: 'What phenomenon occurs when a machine learning model performs exceptionally on training data but poorly on unseen test data?',
        options: ['Underfitting', 'Overfitting', 'Dimensionality Expansion', 'Feature Scaling'],
        correctAnswer: 1,
        explanation: 'Overfitting happens when a model learns the training noise and fails to generalize to unseen test datasets.'
      },
      {
        question: 'Which algorithm is commonly used for unsupervised clustering of data points?',
        options: ['Linear Regression', 'K-Means', 'Random Forest Classifier', 'Naive Bayes'],
        correctAnswer: 1,
        explanation: 'K-Means is a popular unsupervised clustering algorithm that partitions data into K distinct clusters.'
      },
      {
        question: 'In deep learning neural networks, what is the role of an activation function (like ReLU or Sigmoid)?',
        options: [
          'To introduce non-linearity into the network',
          'To compress the database storage size',
          'To calculate the SQL table joins',
          'To clean missing null values'
        ],
        correctAnswer: 0,
        explanation: 'Activation functions introduce non-linear properties into neural networks, allowing them to learn complex real-world patterns.'
      }
    ]
  },
  general: {
    title: 'Course Knowledge Assessment Quiz',
    description: 'Verify your foundational understanding of the principles, methodologies, and practical applications taught in this course.',
    passingPercentage: 70,
    questions: [
      {
        question: 'What is the primary benefit of modular and structured software design?',
        options: [
          'Harder to test and isolate errors',
          'Improved reusability, maintainability, and clean code separation',
          'Increases total execution time unnecessarily',
          'Requires writing code in a single massive file'
        ],
        correctAnswer: 1,
        explanation: 'Modular design separates code into independent components, making systems easier to maintain, scale, test, and reuse.'
      },
      {
        question: 'What is the purpose of version control systems like Git?',
        options: [
          'To compile machine bytecode',
          'To track source code changes, collaborate with team members, and revert to past commits',
          'To automatically write frontend CSS animations',
          'To replace traditional database storage'
        ],
        correctAnswer: 1,
        explanation: 'Git tracks revisions in source code, enables distributed team branching/merging, and provides complete project history.'
      },
      {
        question: 'Which approach ensures an application remains responsive across different screen sizes?',
        options: [
          'Fixed pixel layouts only',
          'Responsive design with fluid grids, flexible media, and CSS media queries',
          'Restricting access strictly to desktop monitors',
          'Disabling CSS entirely'
        ],
        correctAnswer: 1,
        explanation: 'Responsive design utilizes fluid grids, flexible images, and media queries to adapt layouts to any display viewport.'
      },
      {
        question: 'Why are secure authentication practices like bcrypt password hashing essential in web platforms?',
        options: [
          'To allow plain-text reading of passwords in databases',
          'To protect user credentials against data breaches and unauthorized access',
          'To slow down the login process intentionally',
          'To bypass token verification'
        ],
        correctAnswer: 1,
        explanation: 'One-way cryptographic hashing like bcrypt ensures that even if database storage is compromised, user passwords cannot be recovered in plain text.'
      },
      {
        question: 'What is the main goal of continuous self-paced learning and milestones?',
        options: [
          'To build consistent learning habits, retain concepts, and demonstrate verifiable mastery',
          'To rush through lessons without understanding code',
          'To avoid hands-on coding practice',
          'To disable practical assignments'
        ],
        correctAnswer: 0,
        explanation: 'Self-paced learning paired with milestones and quizzes reinforces retention and builds practical mastery.'
      }
    ]
  }
};

const getQuizForCourse = (course) => {
  if (!course) return courseQuizBank.general;
  const title = (course.title || '').toLowerCase();
  const category = (course.category || '').toLowerCase();

  if (title.includes('python') || category.includes('python')) {
    return { ...courseQuizBank.python, title: `${course.title} - Final Certification Quiz` };
  }
  if (title.includes('data structure') || title.includes('algorithm') || title.includes('dsa') || category.includes('computer science')) {
    return { ...courseQuizBank.dsa, title: `${course.title} - Final Certification Quiz` };
  }
  if (title.includes('mern') || title.includes('web') || title.includes('react') || title.includes('javascript') || category.includes('web')) {
    return { ...courseQuizBank.mern, title: `${course.title} - Final Certification Quiz` };
  }
  if (title.includes('machine learning') || title.includes('ai') || title.includes('data science') || category.includes('data science')) {
    return { ...courseQuizBank.ai, title: `${course.title} - Final Certification Quiz` };
  }

  return { ...courseQuizBank.general, title: `${course.title} - Course Assessment Quiz` };
};

module.exports = {
  courseQuizBank,
  getQuizForCourse
};
