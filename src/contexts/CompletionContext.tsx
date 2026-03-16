import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockSections } from '@/data/mockData';

interface CompletionContextType {
  completedLessons: Set<string>;
  markLessonComplete: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isCourseCompleted: (subjectId: string) => boolean;
  getCourseProgress: (subjectId: string) => { completed: number; total: number; percent: number };
  getCompletionDate: (subjectId: string) => string | null;
}

const CompletionContext = createContext<CompletionContextType>({
  completedLessons: new Set(),
  markLessonComplete: () => {},
  isLessonCompleted: () => false,
  isCourseCompleted: () => false,
  getCourseProgress: () => ({ completed: 0, total: 0, percent: 0 }),
  getCompletionDate: () => null,
});

export const useCompletion = () => useContext(CompletionContext);

export const CompletionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('completedLessons');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const [courseCompletionDates, setCourseCompletionDates] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem('courseCompletionDates');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify([...completedLessons]));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('courseCompletionDates', JSON.stringify(courseCompletionDates));
  }, [courseCompletionDates]);

  const markLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      next.add(lessonId);

      // Check if any course is now fully completed
      mockSections.forEach(section => {
        const subjectId = section.subjectId;
        const allSections = mockSections.filter(s => s.subjectId === subjectId);
        const allLessons = allSections.flatMap(s => s.lessons);
        const allCompleted = allLessons.every(l => next.has(l.id));
        if (allCompleted && allLessons.length > 0) {
          setCourseCompletionDates(prev => {
            if (!prev[subjectId]) {
              return { ...prev, [subjectId]: new Date().toISOString() };
            }
            return prev;
          });
        }
      });

      return next;
    });
  }, []);

  const isLessonCompleted = useCallback((lessonId: string) => completedLessons.has(lessonId), [completedLessons]);

  const getCourseProgress = useCallback((subjectId: string) => {
    const sections = mockSections.filter(s => s.subjectId === subjectId);
    const lessons = sections.flatMap(s => s.lessons);
    const completed = lessons.filter(l => completedLessons.has(l.id)).length;
    const total = lessons.length;
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [completedLessons]);

  const isCourseCompleted = useCallback((subjectId: string) => {
    return getCourseProgress(subjectId).percent === 100;
  }, [getCourseProgress]);

  const getCompletionDate = useCallback((subjectId: string) => {
    return courseCompletionDates[subjectId] || null;
  }, [courseCompletionDates]);

  return (
    <CompletionContext.Provider value={{
      completedLessons,
      markLessonComplete,
      isLessonCompleted,
      isCourseCompleted,
      getCourseProgress,
      getCompletionDate,
    }}>
      {children}
    </CompletionContext.Provider>
  );
};
