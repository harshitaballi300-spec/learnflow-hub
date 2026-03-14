import { Instructor } from '@/types/lms';
import { Star, BookOpen } from 'lucide-react';
import { useState } from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face';

const InstructorCard = ({ instructor }: { instructor: Instructor }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="glass-card group rounded-xl p-6 text-center transition-all hover:shadow-md hover:-translate-y-1">
      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20">
        <img
          src={imgError ? FALLBACK_IMAGE : instructor.imageUrl}
          alt={instructor.name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
      <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
        {instructor.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-primary">{instructor.expertise}</p>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{instructor.bio}</p>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />{instructor.courses} courses
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{instructor.rating}
        </span>
      </div>
    </div>
  );
};

export default InstructorCard;
