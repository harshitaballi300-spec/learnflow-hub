export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface CourseQuiz {
  subjectId: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
}

export const courseQuizzes: CourseQuiz[] = [
  {
    subjectId: 's1',
    passingScore: 70,
    questions: [
      { id: 'q1-1', question: 'What is the correct file extension for Python files?', options: ['.py', '.python', '.pt', '.pn'], correctIndex: 0 },
      { id: 'q1-2', question: 'Which keyword is used to define a function in Python?', options: ['function', 'fun', 'def', 'define'], correctIndex: 2 },
      { id: 'q1-3', question: 'What data type is the result of: type(3.14)?', options: ['int', 'float', 'str', 'double'], correctIndex: 1 },
      { id: 'q1-4', question: 'Which of the following is a mutable data type in Python?', options: ['tuple', 'string', 'list', 'int'], correctIndex: 2 },
      { id: 'q1-5', question: 'What does the __init__ method do in a Python class?', options: ['Destroys an object', 'Imports modules', 'Initializes object attributes', 'Returns class name'], correctIndex: 2 },
    ],
  },
  {
    subjectId: 's2',
    passingScore: 70,
    questions: [
      { id: 'q2-1', question: 'What hook is used to manage state in a functional React component?', options: ['useEffect', 'useState', 'useReducer', 'useRef'], correctIndex: 1 },
      { id: 'q2-2', question: 'What is JSX?', options: ['A database query language', 'A CSS preprocessor', 'A syntax extension for JavaScript', 'A testing framework'], correctIndex: 2 },
      { id: 'q2-3', question: 'Which method is used to render a React component to the DOM?', options: ['ReactDOM.render()', 'React.mount()', 'document.render()', 'React.display()'], correctIndex: 0 },
      { id: 'q2-4', question: 'What is the virtual DOM?', options: ['A browser API', 'A lightweight copy of the real DOM', 'A CSS framework', 'A server-side tool'], correctIndex: 1 },
      { id: 'q2-5', question: 'How do you pass data from parent to child in React?', options: ['State', 'Props', 'Context', 'Refs'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's3',
    passingScore: 70,
    questions: [
      { id: 'q3-1', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctIndex: 1 },
      { id: 'q3-2', question: 'Which data structure uses FIFO principle?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctIndex: 1 },
      { id: 'q3-3', question: 'What is the worst-case complexity of quicksort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], correctIndex: 2 },
      { id: 'q3-4', question: 'Which data structure is used in BFS traversal?', options: ['Stack', 'Queue', 'Heap', 'Array'], correctIndex: 1 },
      { id: 'q3-5', question: 'A linked list node contains what two things?', options: ['Key and value', 'Data and pointer', 'Index and data', 'Hash and value'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's4',
    passingScore: 70,
    questions: [
      { id: 'q4-1', question: 'What type of learning uses labeled data?', options: ['Unsupervised', 'Reinforcement', 'Supervised', 'Semi-supervised'], correctIndex: 2 },
      { id: 'q4-2', question: 'Which algorithm is commonly used for classification?', options: ['Linear Regression', 'K-Means', 'Decision Tree', 'PCA'], correctIndex: 2 },
      { id: 'q4-3', question: 'What does CNN stand for?', options: ['Computer Neural Network', 'Convolutional Neural Network', 'Connected Node Network', 'Central Neural Nexus'], correctIndex: 1 },
      { id: 'q4-4', question: 'Overfitting means the model:', options: ['Performs well on new data', 'Learns noise in training data', 'Is too simple', 'Has too few parameters'], correctIndex: 1 },
      { id: 'q4-5', question: 'Which library is most used for ML in Python?', options: ['Django', 'Flask', 'scikit-learn', 'Pandas'], correctIndex: 2 },
    ],
  },
  {
    subjectId: 's5',
    passingScore: 70,
    questions: [
      { id: 'q5-1', question: 'What does UX stand for?', options: ['User Extra', 'User Experience', 'Unified Exchange', 'User Extension'], correctIndex: 1 },
      { id: 'q5-2', question: 'Which tool is commonly used for UI prototyping?', options: ['VS Code', 'Figma', 'Git', 'Postman'], correctIndex: 1 },
      { id: 'q5-3', question: 'What is a wireframe?', options: ['Final design', 'Low-fidelity layout sketch', 'Color palette', 'Animation script'], correctIndex: 1 },
      { id: 'q5-4', question: 'What is the purpose of a design system?', options: ['To write backend code', 'Ensure consistent UI patterns', 'Manage databases', 'Deploy applications'], correctIndex: 1 },
      { id: 'q5-5', question: 'What is a persona in UX design?', options: ['A coding library', 'A fictional user representation', 'A testing tool', 'A design file format'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's6',
    passingScore: 70,
    questions: [
      { id: 'q6-1', question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Logic', 'Standard Question Language', 'Sequential Query Listing'], correctIndex: 0 },
      { id: 'q6-2', question: 'Which SQL clause is used to filter rows?', options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'], correctIndex: 2 },
      { id: 'q6-3', question: 'What type of JOIN returns all rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'], correctIndex: 2 },
      { id: 'q6-4', question: 'Which keyword removes duplicate rows from results?', options: ['UNIQUE', 'DISTINCT', 'FILTER', 'REMOVE'], correctIndex: 1 },
      { id: 'q6-5', question: 'What is normalization?', options: ['Adding indexes', 'Reducing data redundancy', 'Encrypting data', 'Backing up databases'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's7',
    passingScore: 70,
    questions: [
      { id: 'q7-1', question: 'What is a Docker container?', options: ['A virtual machine', 'A lightweight isolated process', 'A cloud server', 'A database'], correctIndex: 1 },
      { id: 'q7-2', question: 'What file defines a Docker image?', options: ['docker-compose.yml', 'Dockerfile', 'package.json', 'Makefile'], correctIndex: 1 },
      { id: 'q7-3', question: 'What does Kubernetes primarily do?', options: ['Build containers', 'Orchestrate containers', 'Write code', 'Manage databases'], correctIndex: 1 },
      { id: 'q7-4', question: 'What is a Kubernetes Pod?', options: ['A cluster', 'A smallest deployable unit', 'A network', 'A volume'], correctIndex: 1 },
      { id: 'q7-5', question: 'Which command builds a Docker image?', options: ['docker run', 'docker build', 'docker start', 'docker push'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's8',
    passingScore: 70,
    questions: [
      { id: 'q8-1', question: 'What is ethical hacking?', options: ['Illegal hacking', 'Authorized security testing', 'Social media hacking', 'Game modding'], correctIndex: 1 },
      { id: 'q8-2', question: 'What does a firewall do?', options: ['Speeds up internet', 'Filters network traffic', 'Stores passwords', 'Compresses files'], correctIndex: 1 },
      { id: 'q8-3', question: 'What is phishing?', options: ['A programming language', 'A social engineering attack', 'A network protocol', 'An encryption method'], correctIndex: 1 },
      { id: 'q8-4', question: 'What does HTTPS provide over HTTP?', options: ['Speed', 'Encryption', 'Compression', 'Caching'], correctIndex: 1 },
      { id: 'q8-5', question: 'What is a VPN used for?', options: ['Hosting websites', 'Secure private network access', 'Editing videos', 'Compiling code'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's9',
    passingScore: 70,
    questions: [
      { id: 'q9-1', question: 'What language does Flutter use?', options: ['JavaScript', 'Kotlin', 'Dart', 'Swift'], correctIndex: 2 },
      { id: 'q9-2', question: 'What is a Widget in Flutter?', options: ['A database model', 'A UI building block', 'A network call', 'A test file'], correctIndex: 1 },
      { id: 'q9-3', question: 'Flutter is used for building:', options: ['Only Android apps', 'Only iOS apps', 'Cross-platform apps', 'Desktop apps only'], correctIndex: 2 },
      { id: 'q9-4', question: 'What is hot reload in Flutter?', options: ['Restarting the phone', 'Instantly reflecting code changes', 'Clearing cache', 'Deploying to store'], correctIndex: 1 },
      { id: 'q9-5', question: 'Which company developed Flutter?', options: ['Facebook', 'Apple', 'Google', 'Microsoft'], correctIndex: 2 },
    ],
  },
  {
    subjectId: 's10',
    passingScore: 70,
    questions: [
      { id: 'q10-1', question: 'What does EC2 stand for?', options: ['Elastic Cloud Compute', 'Elastic Compute Cloud', 'Electronic Cloud Container', 'Enterprise Compute Center'], correctIndex: 1 },
      { id: 'q10-2', question: 'Which AWS service is used for object storage?', options: ['EC2', 'S3', 'RDS', 'Lambda'], correctIndex: 1 },
      { id: 'q10-3', question: 'AWS Lambda is a:', options: ['Database service', 'Serverless compute service', 'Networking tool', 'Storage service'], correctIndex: 1 },
      { id: 'q10-4', question: 'What is an AWS VPC?', options: ['Virtual Private Cloud', 'Virtual Public Container', 'Variable Processing Core', 'Virtual Platform Config'], correctIndex: 0 },
      { id: 'q10-5', question: 'Which service manages DNS in AWS?', options: ['CloudFront', 'Route 53', 'S3', 'IAM'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's11',
    passingScore: 70,
    questions: [
      { id: 'q11-1', question: 'Java is a ___-typed language.', options: ['Dynamically', 'Weakly', 'Statically', 'Un'], correctIndex: 2 },
      { id: 'q11-2', question: 'What is the entry point of a Java application?', options: ['init()', 'start()', 'main()', 'run()'], correctIndex: 2 },
      { id: 'q11-3', question: 'What does JVM stand for?', options: ['Java Variable Machine', 'Java Virtual Machine', 'Java Visual Mode', 'Java Version Manager'], correctIndex: 1 },
      { id: 'q11-4', question: 'Which framework is used for Java enterprise apps?', options: ['Django', 'Spring Boot', 'Express', 'Rails'], correctIndex: 1 },
      { id: 'q11-5', question: 'What is inheritance in Java?', options: ['A loop structure', 'A class inheriting from another', 'A variable type', 'A file format'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's12',
    passingScore: 70,
    questions: [
      { id: 'q12-1', question: 'What is a blockchain?', options: ['A database', 'A distributed ledger', 'A programming language', 'A cloud service'], correctIndex: 1 },
      { id: 'q12-2', question: 'What language are Ethereum smart contracts written in?', options: ['Python', 'JavaScript', 'Solidity', 'Rust'], correctIndex: 2 },
      { id: 'q12-3', question: 'What is a DApp?', options: ['Desktop Application', 'Decentralized Application', 'Data Application', 'Digital App'], correctIndex: 1 },
      { id: 'q12-4', question: 'What is gas in Ethereum?', options: ['A token', 'Transaction fee unit', 'A smart contract', 'A wallet'], correctIndex: 1 },
      { id: 'q12-5', question: 'What is Web3?', options: ['A browser', 'Decentralized internet vision', 'A framework', 'A server'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's13',
    passingScore: 70,
    questions: [
      { id: 'q13-1', question: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Social Engine Output', 'Site Enhancement Operation', 'Search Entry Organization'], correctIndex: 0 },
      { id: 'q13-2', question: 'Which metric measures website traffic?', options: ['ROI', 'CTR', 'Page Views', 'CPC'], correctIndex: 2 },
      { id: 'q13-3', question: 'What is PPC advertising?', options: ['Pay Per Click', 'Post Per Comment', 'Page Per Content', 'Price Per Campaign'], correctIndex: 0 },
      { id: 'q13-4', question: 'Google Analytics is used for:', options: ['Email marketing', 'Website traffic analysis', 'Social media posting', 'Graphic design'], correctIndex: 1 },
      { id: 'q13-5', question: 'What is a backlink?', options: ['A broken link', 'A link from another site to yours', 'An internal page link', 'A download link'], correctIndex: 1 },
    ],
  },
  {
    subjectId: 's14',
    passingScore: 70,
    questions: [
      { id: 'q14-1', question: 'TypeScript is a superset of:', options: ['Python', 'Java', 'JavaScript', 'C++'], correctIndex: 2 },
      { id: 'q14-2', question: 'What are generics used for in TypeScript?', options: ['Styling', 'Reusable type-safe code', 'Database queries', 'Animations'], correctIndex: 1 },
      { id: 'q14-3', question: 'What does the "interface" keyword do?', options: ['Creates a class', 'Defines a type shape', 'Imports modules', 'Exports functions'], correctIndex: 1 },
      { id: 'q14-4', question: 'What is "any" type in TypeScript?', options: ['A strict type', 'Disables type checking', 'A number type', 'An error type'], correctIndex: 1 },
      { id: 'q14-5', question: 'Which utility type makes all properties optional?', options: ['Required', 'Readonly', 'Partial', 'Pick'], correctIndex: 2 },
    ],
  },
];
