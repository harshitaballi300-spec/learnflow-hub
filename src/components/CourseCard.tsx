import { Subject } from '@/types/lms';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users } from 'lucide-react';

interface CourseCardProps {
  subject: Subject;
}

const CourseCard = ({ subject }: CourseCardProps) => {
  return (
    <Link to={`/courses/${subject.id}`} className="group block">
      <div className="glass-card overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="relative h-40 overflow-hidden gradient-primary">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary-foreground/30" />
          </div>
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              {subject.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {subject.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {subject.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />{subject.totalLessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />{subject.totalDuration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />{subject.enrolledCount.toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium text-muted-foreground">by {subject.instructor}</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
