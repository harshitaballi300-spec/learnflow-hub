export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  avatar?: string;
  createdAt: string;
  phone?: string;
  bio?: string;
  emailNotifications?: boolean;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  instructor: string;
  totalLessons: number;
  totalDuration: string;
  enrolledCount: number;
  createdAt: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  bestseller: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  whatYouWillLearn: string[];
  requirements: string[];
  language: string;
  lastUpdated: string;
}

export interface Section {
  id: string;
  subjectId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  subjectId: string;
  enrolledAt: string;
  progress: number;
}

export interface Progress {
  id: string;
  userId: string;
  videoId: string;
  completed: boolean;
  completedAt?: string;
}

export interface Instructor {
  id: string;
  name: string;
  expertise: string;
  bio: string;
  imageUrl: string;
  courses: number;
  rating: number;
  studentCount: number;
  reviewCount: number;
}

export interface CartItem {
  subjectId: string;
  addedAt: string;
}
