export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  avatar?: string;
  createdAt: string;
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
}

export interface CartItem {
  subjectId: string;
  addedAt: string;
}
