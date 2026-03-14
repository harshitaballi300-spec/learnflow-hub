import { useParams, Link } from 'react-router-dom';
import { mockSubjects, mockSections, mockInstructors } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import SectionAccordion from '@/components/SectionAccordion';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Users, CheckCircle2, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart, isInCart, isPurchased } = useCart();
  const subject = mockSubjects.find(s => s.id === id);
  const sections = mockSections.filter(s => s.subjectId === id);
  const instructor = mockInstructors.find(i => i.name === subject?.instructor);

  const enrolled = isPurchased(id || '');
  const [imgError, setImgError] = useState(false);

  if (!subject) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Course not found</div>;
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }
    addToCart(subject.id);
    toast.success(`Added "${subject.title}" to cart!`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {subject.category}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{subject.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{subject.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{subject.totalLessons} lessons</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{subject.totalDuration}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{subject.enrolledCount.toLocaleString()} students</span>
          </div>

          {/* Instructor info */}
          {instructor && (
            <div className="mt-6 glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary/20">
                <img
                  src={imgError ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face' : instructor.imageUrl}
                  alt={instructor.name}
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              </div>
              <div>
                <p className="font-display font-semibold">{instructor.name}</p>
                <p className="text-sm text-muted-foreground">{instructor.expertise}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{instructor.rating}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card rounded-xl p-6">
          {enrolled ? (
            <div>
              <div className="mb-3 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Enrolled</span>
              </div>
              <div className="mb-4">
                <p className="mb-1 text-sm text-muted-foreground">Your progress</p>
                <ProgressBar value={0} />
              </div>
              {sections.length > 0 && sections[0].lessons.length > 0 && (
                <Link to={`/courses/${subject.id}/lesson/${sections[0].lessons[0].id}`}>
                  <Button className="w-full gradient-primary border-0 text-primary-foreground">
                    Start Learning
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div>
              <p className="mb-4 text-2xl font-bold font-display">Free</p>
              {isInCart(subject.id) ? (
                <Link to="/cart">
                  <Button className="w-full gradient-primary border-0 text-primary-foreground">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Go to Cart
                  </Button>
                </Link>
              ) : (
                <div className="space-y-3">
                  <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                  <Link to="/payment" onClick={() => { if (user) addToCart(subject.id); }}>
                    <Button variant="outline" className="w-full">Buy Now</Button>
                  </Link>
                </div>
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">Full lifetime access</p>
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="mt-12">
        <h2 className="mb-6 font-display text-2xl font-bold">Course Content</h2>
        {sections.length > 0 ? (
          <div className="space-y-3">
            {sections.map(section => (
              <SectionAccordion key={section.id} section={section} subjectId={subject.id} isEnrolled={enrolled} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Course content coming soon.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
