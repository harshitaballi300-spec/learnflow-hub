import { useParams, Link } from 'react-router-dom';
import { mockSections, mockSubjects, completedLessonIds } from '@/data/mockData';
import VideoPlayer from '@/components/VideoPlayer';
import { CheckCircle2, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const LessonPage = () => {
  const { id: subjectId, lessonId } = useParams<{ id: string; lessonId: string }>();
  const subject = mockSubjects.find(s => s.id === subjectId);
  const sections = mockSections.filter(s => s.subjectId === subjectId);
  const allLessons = sections.flatMap(s => s.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const lesson = allLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const [completed, setCompleted] = useState(completedLessonIds.has(lessonId || ''));

  if (!lesson || !subject) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Lesson not found</div>;
  }

  const markComplete = () => {
    setCompleted(true);
    toast.success('Lesson marked as complete!');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Video & Content */}
        <div className="lg:col-span-2">
          <Link to={`/courses/${subjectId}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />{subject.title}
          </Link>

          <VideoPlayer youtubeUrl={lesson.youtubeUrl} title={lesson.title} />

          <div className="mt-6">
            <h1 className="font-display text-2xl font-bold">{lesson.title}</h1>
            <p className="mt-2 text-muted-foreground">{lesson.description}</p>
            <p className="mt-1 text-sm text-muted-foreground">Duration: {lesson.duration}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!completed ? (
              <Button onClick={markComplete} className="gradient-primary border-0 text-primary-foreground">
                <CheckCircle2 className="mr-2 h-4 w-4" />Mark as Complete
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            {prevLesson ? (
              <Link to={`/courses/${subjectId}/lesson/${prevLesson.id}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="mr-1 h-4 w-4" />Previous
                </Button>
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link to={`/courses/${subjectId}/lesson/${nextLesson.id}`}>
                <Button size="sm" className="gradient-primary border-0 text-primary-foreground">
                  Next<ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Sidebar: Lessons list */}
        <div className="glass-card max-h-[80vh] overflow-y-auto rounded-xl p-4">
          <h3 className="mb-3 font-display font-semibold">Course Content</h3>
          {sections.map(section => (
            <div key={section.id} className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              {section.lessons.map(l => {
                const isActive = l.id === lessonId;
                const isDone = completedLessonIds.has(l.id);
                return (
                  <Link
                    key={l.id}
                    to={`/courses/${subjectId}/lesson/${l.id}`}
                    className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{l.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
