import { useParams, Link } from 'react-router-dom';
import { mockSubjects, mockSections, mockInstructors } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import SectionAccordion from '@/components/SectionAccordion';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import {
  BookOpen, Clock, Users, CheckCircle2, ShoppingCart, Star,
  Globe, BarChart3, Award, PlayCircle, FileText, Download,
  Smartphone, Trophy, ChevronDown, ChevronUp, Heart
} from 'lucide-react';
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
  const [showAllLearn, setShowAllLearn] = useState(false);

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

  const totalLectures = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const discount = Math.round((1 - subject.price / subject.originalPrice) * 100);
  const learnItems = showAllLearn ? subject.whatYouWillLearn : subject.whatYouWillLearn.slice(0, 4);

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < full ? 'fill-accent text-accent' : 'text-accent/30'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen">
      {/* Dark header banner — Udemy style */}
      <div className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:pr-[380px]">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-2 text-sm text-sidebar-foreground/60">
            <Link to="/courses" className="hover:text-sidebar-foreground">Courses</Link>
            <span>›</span>
            <span className="text-primary">{subject.category}</span>
          </div>

          <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{subject.title}</h1>
          <p className="mt-2 text-base text-sidebar-foreground/80">{subject.description}</p>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            {subject.bestseller && (
              <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                Bestseller
              </span>
            )}
            <span className="font-bold text-accent">{subject.rating}</span>
            <div className="flex">{renderStars(subject.rating)}</div>
            <span className="text-sidebar-foreground/60">({subject.reviewCount.toLocaleString()} ratings)</span>
            <span className="text-sidebar-foreground/60">{subject.enrolledCount.toLocaleString()} students</span>
          </div>

          <div className="mt-2 text-sm text-sidebar-foreground/60">
            Created by <span className="text-primary underline">{subject.instructor}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-sidebar-foreground/50">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Last updated {subject.lastUpdated}</span>
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{subject.language}</span>
          </div>
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="rounded-lg border border-border p-6">
              <h2 className="mb-4 font-display text-xl font-bold">What you'll learn</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {learnItems.map((item, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {subject.whatYouWillLearn.length > 4 && (
                <button
                  onClick={() => setShowAllLearn(!showAllLearn)}
                  className="mt-3 flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80"
                >
                  {showAllLearn ? 'Show less' : 'Show more'}
                  {showAllLearn ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              )}
            </div>

            {/* Course content */}
            <div>
              <h2 className="mb-2 font-display text-xl font-bold">Course content</h2>
              <div className="mb-4 text-sm text-muted-foreground">
                {sections.length} sections · {totalLectures} lectures · {subject.totalDuration} total length
              </div>
              {sections.length > 0 ? (
                <div className="space-y-0 overflow-hidden rounded-lg border border-border">
                  {sections.map(section => (
                    <SectionAccordion key={section.id} section={section} subjectId={subject.id} isEnrolled={enrolled} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Course content coming soon.</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <h2 className="mb-3 font-display text-xl font-bold">Requirements</h2>
              <ul className="space-y-1.5">
                {subject.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructor section */}
            {instructor && (
              <div>
                <h2 className="mb-3 font-display text-xl font-bold">Instructor</h2>
                <h3 className="text-lg font-bold text-primary underline-offset-2 hover:underline cursor-pointer">
                  {instructor.name}
                </h3>
                <p className="text-sm text-muted-foreground">{instructor.expertise}</p>
                <div className="mt-3 flex items-start gap-4">
                  <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                      src={imgError ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face' : instructor.imageUrl}
                      alt={instructor.name}
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> {instructor.rating} Instructor Rating</p>
                    <p className="flex items-center gap-2"><Award className="h-3.5 w-3.5" /> {instructor.reviewCount?.toLocaleString()} Reviews</p>
                    <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {instructor.studentCount?.toLocaleString()} Students</p>
                    <p className="flex items-center gap-2"><PlayCircle className="h-3.5 w-3.5" /> {instructor.courses} Courses</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{instructor.bio}</p>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-lg border border-border bg-card shadow-lg">
              {/* Thumbnail preview */}
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={subject.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop'}
                  alt={subject.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-sidebar/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card/90">
                    <PlayCircle className="h-8 w-8 text-foreground" />
                  </div>
                </div>
                <p className="absolute bottom-2 left-0 right-0 text-center text-sm font-medium text-primary-foreground">
                  Preview this course
                </p>
              </div>

              <div className="p-5">
                {enrolled ? (
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-bold">Enrolled</span>
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
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-extrabold text-foreground">₹{subject.price}</span>
                      <span className="text-base text-muted-foreground line-through">₹{subject.originalPrice}</span>
                      <span className="text-base font-bold text-foreground">{discount}% off</span>
                    </div>
                    <p className="mt-1 text-xs text-destructive font-medium">⏰ 2 days left at this price!</p>

                    <div className="mt-4 space-y-2">
                      {isInCart(subject.id) ? (
                        <Link to="/cart">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base py-5">
                            Go to Cart
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Button
                            className="w-full gradient-primary border-0 text-primary-foreground font-bold text-base py-5"
                            onClick={handleAddToCart}
                          >
                            Add to Cart
                          </Button>
                          <Link to="/payment" onClick={() => { if (user) addToCart(subject.id); }}>
                            <Button variant="outline" className="w-full font-bold text-base py-5">
                              Buy Now
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>

                    <p className="mt-3 text-center text-xs text-muted-foreground">30-Day Money-Back Guarantee</p>

                    {/* This course includes */}
                    <div className="mt-5">
                      <h4 className="mb-3 text-sm font-bold">This course includes:</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2"><PlayCircle className="h-4 w-4" /> {subject.totalDuration} on-demand video</p>
                        <p className="flex items-center gap-2"><FileText className="h-4 w-4" /> {subject.totalLessons} articles & resources</p>
                        <p className="flex items-center gap-2"><Download className="h-4 w-4" /> Downloadable resources</p>
                        <p className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Access on mobile and TV</p>
                        <p className="flex items-center gap-2"><Trophy className="h-4 w-4" /> Certificate of completion</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
