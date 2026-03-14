import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockSubjects, mockInstructors } from '@/data/mockData';
import CourseCard from '@/components/CourseCard';
import InstructorCard from '@/components/InstructorCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, GraduationCap, TrendingUp, Users, Star, CheckCircle2 } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const categories = [...new Set(mockSubjects.map(s => s.category))];

  return (
    <div className="min-h-screen">
      {/* Hero — Udemy-style with side image */}
      <section className="relative border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl text-foreground">
                Learning that gets you
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                Skills for your present (and your future). Get started with us. Choose from {mockSubjects.length}+ courses taught by real-world experts.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={user ? '/dashboard' : '/register'}>
                  <Button size="lg" className="gradient-primary border-0 text-primary-foreground px-8 font-bold">
                    {user ? 'My Learning' : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="font-bold">
                    Browse Courses
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Lifetime access</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Certificate on completion</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Expert instructors</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Students learning"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category bar */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
          <div className="flex gap-8 py-3">
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/courses`}
                className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
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
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Students are viewing</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Most popular courses right now</p>
          </div>
          <Link to="/courses">
            <Button variant="ghost" size="sm" className="font-bold text-primary">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockSubjects.slice(0, 4).map((subject) => (
            <CourseCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>

      {/* Top Categories */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-bold">Top Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(cat => {
              const count = mockSubjects.filter(s => s.category === cat).length;
              return (
                <Link key={cat} to="/courses" className="group">
                  <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                      <BookOpen className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{cat}</h3>
                      <p className="text-sm text-muted-foreground">{count} {count === 1 ? 'course' : 'courses'}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="mb-2 font-display text-2xl font-bold">Popular Instructors</h2>
          <p className="mb-6 text-sm text-muted-foreground">Learn from industry experts with real-world experience</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mockInstructors.slice(0, 3).map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
            Become an instructor
          </h2>
          <p className="mt-2 text-primary-foreground/80 max-w-lg mx-auto">
            Top instructors from around the world teach millions of students on LearnHub. We provide the tools and skills to teach what you love.
          </p>
          <Button size="lg" variant="outline" className="mt-6 bg-card text-foreground border-0 font-bold hover:bg-card/90">
            Start teaching today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
