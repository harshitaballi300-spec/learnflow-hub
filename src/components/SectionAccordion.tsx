import { Section } from '@/types/lms';
import { useCompletion } from '@/contexts/CompletionContext';
import { ChevronDown, CheckCircle2, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SectionAccordionProps {
  section: Section;
  subjectId: string;
  isEnrolled: boolean;
}

const SectionAccordion = ({ section, subjectId, isEnrolled }: SectionAccordionProps) => {
  const [open, setOpen] = useState(section.orderIndex === 1);
  const { isLessonCompleted } = useCompletion();
  const completedCount = section.lessons.filter(l => isLessonCompleted(l.id)).length;

  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {section.orderIndex}
          </div>
          <div>
            <h4 className="font-display font-semibold">{section.title}</h4>
            <p className="text-xs text-muted-foreground">
              {section.lessons.length} lessons · {completedCount}/{section.lessons.length} completed
            </p>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-border">
          {section.lessons.map((lesson, i) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            return (
              <div key={lesson.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-border/50' : ''}`}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                ) : (
                  <PlayCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  {isEnrolled ? (
                    <Link
                      to={`/courses/${subjectId}/lesson/${lesson.id}`}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      {lesson.title}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium">{lesson.title}</span>
                  )}
                  <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{lesson.duration}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SectionAccordion;
