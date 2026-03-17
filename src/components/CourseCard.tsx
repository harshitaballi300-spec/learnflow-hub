import { Subject } from '@/types/lms';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

interface CourseCardProps {
  subject: Subject;
}

const CourseCard = ({ subject }: CourseCardProps) => {
  const [imgError, setImgError] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(subject.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(subject.id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<Star key={i} className="h-3 w-3 fill-accent text-accent" />);
      } else if (i === full && hasHalf) {
        stars.push(<Star key={i} className="h-3 w-3 fill-accent/50 text-accent" />);
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-muted-foreground/30" />);
      }
    }
    return stars;
  };

  return (
    <Link to={`/courses/${subject.id}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={imgError ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop' : subject.thumbnailUrl}
            alt={subject.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          {/* Wishlist heart */}
          <button
            onClick={handleWishlistClick}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-all hover:bg-card hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlisted ? 'fill-destructive text-destructive' : 'text-foreground'
              }`}
            />
          </button>
          {subject.bestseller && (
            <div className="absolute left-2 top-2">
              <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                Bestseller
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {subject.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{subject.instructor}</p>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <span className="text-sm font-bold text-accent-foreground">{subject.rating}</span>
            <div className="flex">{renderStars(subject.rating)}</div>
            <span className="text-xs text-muted-foreground">({subject.reviewCount.toLocaleString()})</span>
          </div>

          {/* Duration & Level */}
          <p className="mt-1 text-xs text-muted-foreground">
            {subject.totalDuration} total · {subject.totalLessons} lectures · {subject.level}
          </p>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-base font-extrabold text-foreground">₹{subject.price}</span>
            <span className="text-sm text-muted-foreground line-through">₹{subject.originalPrice}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
