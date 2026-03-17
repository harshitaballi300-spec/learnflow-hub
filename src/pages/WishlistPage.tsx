import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WishlistPage = () => {
  const { user } = useAuth();
  const { getWishlistSubjects, wishlistCount } = useWishlist();

  if (!user) return <Navigate to="/login" replace />;

  const subjects = getWishlistSubjects();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Heart className="h-7 w-7 text-destructive fill-destructive" />
        <h1 className="font-display text-2xl font-bold">My Wishlist</h1>
        <span className="rounded-full bg-muted px-3 py-0.5 text-sm font-medium text-muted-foreground">
          {wishlistCount} {wishlistCount === 1 ? 'course' : 'courses'}
        </span>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h2 className="text-xl font-bold text-foreground">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">Browse courses and add your favorites!</p>
          <Link to="/courses" className="mt-4">
            <Button className="gradient-primary border-0 text-primary-foreground">
              Browse Courses
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map(subject => (
            <CourseCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
