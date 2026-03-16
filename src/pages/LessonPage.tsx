import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockSections, mockSubjects } from '@/data/mockData';
import { useCompletion } from '@/contexts/CompletionContext';
import VideoPlayer from '@/components/VideoPlayer';
import QuizModal from '@/components/QuizModal';
import { CheckCircle2, ChevronLeft, ChevronRight, PlayCircle, Award, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const LessonPage = () => {
  const { id: subjectId, lessonId } = useParams<{ id: string; lessonId: string }>();
  const [quizOpen, setQuizOpen] = useState(false);
  const subject = mockSubjects.find(s => s.id === subjectId);
  const sections = mockSections.filter(s => s.subjectId === subjectId);
  const allLessons = sections.flatMap(s => s.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const lesson = allLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const { isLessonCompleted, markLessonComplete, isCourseCompleted, getCourseProgress } = useCompletion();
  const completed = isLessonCompleted(lessonId || '');
  const courseCompleted = isCourseCompleted(subjectId || '');
  const progress = getCourseProgress(subjectId || '');

  if (!lesson || !subject) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Lesson not found</div>;
  }

  const handleMarkComplete = () => {
    markLessonComplete(lessonId || '');
    toast.success('Lesson marked as complete!');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-3">
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
              <Button onClick={handleMarkComplete} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <CheckCircle2 className="mr-2 h-4 w-4" />Mark as Complete
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Completed</span>
              </div>
            )}

            {courseCompleted && (
              <Link to={`/certificate/${subjectId}`}>
                <Button variant="outline" className="gap-2 border-accent text-accent hover:bg-accent/10">
                  <Award className="h-4 w-4" />View Certificate
                </Button>
              </Link>
            )}
          </div>

          {/* Course progress bar */}
          <div className="mt-4 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Course Progress</span>
              <span className="font-medium text-foreground">{progress.completed}/{progress.total} lessons · {progress.percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            {prevLesson ? (
              <Link to={`/courses/${subjectId}/lesson/${prevLesson.id}`}>
                <Button variant="outline" size="sm"><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button>
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link to={`/courses/${subjectId}/lesson/${nextLesson.id}`}>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Next<ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Sidebar */}
        <div className="rounded-xl border border-border bg-card max-h-[80vh] overflow-y-auto p-4">
          <h3 className="mb-3 font-display font-semibold">Course Content</h3>
          {sections.map(section => (
            <div key={section.id} className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{section.title}</p>
              {section.lessons.map(l => {
                const isActive = l.id === lessonId;
                const isDone = isLessonCompleted(l.id);
                return (
                  <Link key={l.id} to={`/courses/${subjectId}/lesson/${l.id}`}
                    className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50'}`}>
                    {isDone ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> : <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground" />}
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
