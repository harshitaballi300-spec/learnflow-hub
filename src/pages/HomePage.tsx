import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockSubjects, mockInstructors } from '@/data/mockData';
import CourseCard from '@/components/CourseCard';
import InstructorCard from '@/components/InstructorCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, GraduationCap, TrendingUp, Users } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <GraduationCap className="h-4 w-4" /> Start learning today
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Master new skills with{' '}
              <span className="gradient-text">LearnHub</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Access curated courses in programming, design, data science, and more. Learn at your own pace with video lessons and progress tracking.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to={user ? '/dashboard' : '/register'}>
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground px-8">
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline">Browse Courses</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {[
            { icon: BookOpen, label: 'Courses', value: '50+' },
            { icon: Users, label: 'Students', value: '12K+' },
            { icon: GraduationCap, label: 'Lessons', value: '500+' },
            { icon: TrendingUp, label: 'Completion Rate', value: '89%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Featured Courses</h2>
            <p className="mt-1 text-muted-foreground">Start with our most popular courses</p>
          </div>
          <Link to="/courses">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockSubjects.slice(0, 3).map((subject) => (
            <CourseCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>

      {/* Mentors / Instructors */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Meet Our Instructors</h2>
            <p className="mt-2 text-muted-foreground">Learn from industry experts and experienced educators</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {mockInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
