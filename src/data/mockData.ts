import { Subject, Section, User, Enrollment } from '@/types/lms';

export const mockUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'student',
  avatar: '',
  createdAt: '2024-01-15',
};

export const mockAdmin: User = {
  id: 'u2',
  name: 'Dr. Sarah Chen',
  email: 'sarah@example.com',
  role: 'admin',
  avatar: '',
  createdAt: '2023-06-01',
};

export const mockSubjects: Subject[] = [
  {
    id: 's1',
    title: 'Python Programming Masterclass',
    description: 'Learn Python from scratch. Covers variables, functions, OOP, file handling, and real-world projects.',
    thumbnailUrl: '',
    category: 'Programming',
    instructor: 'Dr. Sarah Chen',
    totalLessons: 12,
    totalDuration: '8h 30m',
    enrolledCount: 2340,
    createdAt: '2024-01-01',
  },
  {
    id: 's2',
    title: 'Web Development with React',
    description: 'Build modern web applications with React, hooks, state management, and API integration.',
    thumbnailUrl: '',
    category: 'Web Development',
    instructor: 'Mark Rivera',
    totalLessons: 15,
    totalDuration: '12h 15m',
    enrolledCount: 1890,
    createdAt: '2024-02-15',
  },
  {
    id: 's3',
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms for coding interviews and competitive programming.',
    thumbnailUrl: '',
    category: 'Computer Science',
    instructor: 'Dr. Aisha Patel',
    totalLessons: 20,
    totalDuration: '16h 45m',
    enrolledCount: 3100,
    createdAt: '2024-03-01',
  },
  {
    id: 's4',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to ML concepts, supervised/unsupervised learning, neural networks, and practical projects.',
    thumbnailUrl: '',
    category: 'AI & ML',
    instructor: 'Prof. James Wu',
    totalLessons: 18,
    totalDuration: '14h 20m',
    enrolledCount: 1560,
    createdAt: '2024-03-10',
  },
  {
    id: 's5',
    title: 'UI/UX Design Principles',
    description: 'Learn design thinking, wireframing, prototyping, and user research methods.',
    thumbnailUrl: '',
    category: 'Design',
    instructor: 'Emma Torres',
    totalLessons: 10,
    totalDuration: '6h 50m',
    enrolledCount: 980,
    createdAt: '2024-04-01',
  },
  {
    id: 's6',
    title: 'Database Management with SQL',
    description: 'Master SQL queries, database design, normalization, indexing, and performance optimization.',
    thumbnailUrl: '',
    category: 'Database',
    instructor: 'Dr. Sarah Chen',
    totalLessons: 14,
    totalDuration: '10h 30m',
    enrolledCount: 1720,
    createdAt: '2024-04-15',
  },
];

export const mockSections: Section[] = [
  {
    id: 'sec1',
    subjectId: 's1',
    title: 'Getting Started with Python',
    orderIndex: 1,
    lessons: [
      { id: 'v1', sectionId: 'sec1', title: 'Introduction to Python', description: 'What is Python and why learn it?', youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', duration: '15:30' },
      { id: 'v2', sectionId: 'sec1', title: 'Installing Python', description: 'Set up Python on your machine.', youtubeUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg', duration: '12:45' },
      { id: 'v3', sectionId: 'sec1', title: 'Your First Program', description: 'Write and run Hello World.', youtubeUrl: 'https://www.youtube.com/watch?v=hEgO047GxaQ', duration: '18:20' },
    ],
  },
  {
    id: 'sec2',
    subjectId: 's1',
    title: 'Variables & Data Types',
    orderIndex: 2,
    lessons: [
      { id: 'v4', sectionId: 'sec2', title: 'Variables in Python', description: 'Understanding variables and naming conventions.', youtubeUrl: 'https://www.youtube.com/watch?v=cQT33yu9pY8', duration: '20:10' },
      { id: 'v5', sectionId: 'sec2', title: 'Numbers and Strings', description: 'Working with numeric and string data types.', youtubeUrl: 'https://www.youtube.com/watch?v=khKv-8q7YmY', duration: '25:00' },
      { id: 'v6', sectionId: 'sec2', title: 'Lists and Tuples', description: 'Sequential data structures in Python.', youtubeUrl: 'https://www.youtube.com/watch?v=W8KRzm-HUcc', duration: '22:30' },
    ],
  },
  {
    id: 'sec3',
    subjectId: 's1',
    title: 'Functions & Modules',
    orderIndex: 3,
    lessons: [
      { id: 'v7', sectionId: 'sec3', title: 'Defining Functions', description: 'Create reusable code blocks.', youtubeUrl: 'https://www.youtube.com/watch?v=9Os0o3wzS_I', duration: '28:15' },
      { id: 'v8', sectionId: 'sec3', title: 'Parameters & Return Values', description: 'Passing data to and from functions.', youtubeUrl: 'https://www.youtube.com/watch?v=u-OmVr_fT4s', duration: '19:45' },
      { id: 'v9', sectionId: 'sec3', title: 'Importing Modules', description: 'Using built-in and third-party modules.', youtubeUrl: 'https://www.youtube.com/watch?v=1RuMJ53CKds', duration: '16:50' },
    ],
  },
  {
    id: 'sec4',
    subjectId: 's1',
    title: 'Object-Oriented Programming',
    orderIndex: 4,
    lessons: [
      { id: 'v10', sectionId: 'sec4', title: 'Classes and Objects', description: 'Introduction to OOP concepts.', youtubeUrl: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM', duration: '32:00' },
      { id: 'v11', sectionId: 'sec4', title: 'Inheritance', description: 'Reusing code through class inheritance.', youtubeUrl: 'https://www.youtube.com/watch?v=Cn7AkDb4pIU', duration: '24:30' },
      { id: 'v12', sectionId: 'sec4', title: 'Polymorphism', description: 'Dynamic method dispatch and duck typing.', youtubeUrl: 'https://www.youtube.com/watch?v=LIWpZ_Uf2mU', duration: '20:15' },
    ],
  },
];

export const mockEnrollments: Enrollment[] = [
  { id: 'e1', userId: 'u1', subjectId: 's1', enrolledAt: '2024-06-01', progress: 67 },
  { id: 'e2', userId: 'u1', subjectId: 's2', enrolledAt: '2024-07-15', progress: 30 },
  { id: 'e3', userId: 'u1', subjectId: 's4', enrolledAt: '2024-08-01', progress: 10 },
];

export const completedLessonIds = new Set(['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8']);

export function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

export const allUsers: User[] = [
  mockUser,
  mockAdmin,
  { id: 'u3', name: 'Jordan Lee', email: 'jordan@example.com', role: 'student', createdAt: '2024-05-10' },
  { id: 'u4', name: 'Priya Sharma', email: 'priya@example.com', role: 'student', createdAt: '2024-06-20' },
  { id: 'u5', name: 'Carlos Mendez', email: 'carlos@example.com', role: 'student', createdAt: '2024-07-01' },
];
