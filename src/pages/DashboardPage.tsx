import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { mockSections, completedLessonIds } from '@/data/mockData';
import ProgressBar from '@/components/ProgressBar';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Clock, PlayCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getPurchasedSubjects } = useCart();

  if (!user) return <Navigate to="/login" replace />;

  const purchasedSubjects = getPurchasedSubjects();
  const totalCompleted = completedLessonIds.size;
  const totalLessons = mockSections.flatMap(s => s.lessons).length;

  const allLessons = mockSections.flatMap(s => s.lessons);
  const nextLesson = allLessons.find(l => !completedLessonIds.has(l.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="mt-1 text-muted-foreground">Continue where you left off</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: 'Enrolled Courses', value: purchasedSubjects.length, color: 'text-primary' },
          { icon: PlayCircle, label: 'Lessons Completed', value: totalCompleted, color: 'text-green-600' },
          { icon: TrendingUp, label: 'Overall Progress', value: totalLessons > 0 ? `${Math.round((totalCompleted / totalLessons) * 100)}%` : '0%', color: 'text-secondary' },
          { icon: Clock, label: 'Hours Learned', value: '24h', color: 'text-accent' },
        ].map(stat => (
          <div key={stat.label} className="glass-card flex items-center gap-4 rounded-xl p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Watching */}
      {nextLesson && purchasedSubjects.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold">Continue Watching</h2>
          <div className="glass-card flex flex-col items-start gap-4 rounded-xl p-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl gradient-primary">
              <PlayCircle className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold">{nextLesson.title}</h3>
              <p className="text-sm text-muted-foreground">{nextLesson.description}</p>
            </div>
            <Link to={`/courses/s1/lesson/${nextLesson.id}`}>
              <Button className="gradient-primary border-0 text-primary-foreground">Resume</Button>
            </Link>
          </div>
        </div>
      )}

      {/* My Learning */}
      <h2 className="mb-4 font-display text-xl font-bold">My Learning</h2>
      {purchasedSubjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {purchasedSubjects.map(subject => (
            <Link key={subject.id} to={`/courses/${subject.id}`} className="glass-card group rounded-xl p-5 transition-all hover:shadow-md">
              <div className="mb-3 flex items-start justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {subject.category}
                </span>
                <span className="text-xs text-muted-foreground">{subject.totalLessons} lessons</span>
              </div>
              <h3 className="font-display font-semibold group-hover:text-primary transition-colors">{subject.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">by {subject.instructor}</p>
              <div className="mt-4">
                <ProgressBar value={0} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-10 text-center">
          <p className="text-muted-foreground">You haven't purchased any courses yet.</p>
          <Link to="/courses">
            <Button className="mt-4 gradient-primary border-0 text-primary-foreground">Browse Courses</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
