import { Instructor } from '@/types/lms';
import { Star, Users, BookOpen } from 'lucide-react';
import { useState } from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face';

const InstructorCard = ({ instructor }: { instructor: Instructor }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group rounded-lg border border-border bg-card p-5 transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/20">
          <img
            src={imgError ? FALLBACK_IMAGE : instructor.imageUrl}
            alt={instructor.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold text-primary underline-offset-2 group-hover:underline">
            {instructor.name}
          </h3>
          <p className="text-sm text-muted-foreground">{instructor.expertise}</p>
          <div className="mt-2 flex flex-col gap-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {instructor.rating} Instructor Rating
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              {instructor.studentCount?.toLocaleString() ?? '0'} Students
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" />
              {instructor.courses} Courses
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{instructor.bio}</p>
    </div>
  );
};

export default InstructorCard;
