import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCompletion } from '@/contexts/CompletionContext';
import { mockSections } from '@/data/mockData';
import ProgressBar from '@/components/ProgressBar';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Clock, PlayCircle, TrendingUp, Award, GraduationCap, ChevronRight, Star, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getPurchasedSubjects } = useCart();
  const { getCourseProgress, isCourseCompleted, completedLessons } = useCompletion();

  if (!user) return <Navigate to="/login" replace />;

  const purchasedSubjects = getPurchasedSubjects();
  const totalCompleted = completedLessons.size;
  const totalLessons = purchasedSubjects.length > 0
    ? mockSections.filter(s => purchasedSubjects.some(p => p.id === s.subjectId)).flatMap(s => s.lessons).length
    : 0;
  const completedCourses = purchasedSubjects.filter(s => isCourseCompleted(s.id)).length;

  const purchasedIds = purchasedSubjects.map(s => s.id);
  const purchasedSections = mockSections.filter(s => purchasedIds.includes(s.subjectId));
  const allLessons = purchasedSections.flatMap(s => s.lessons);
  const nextLesson = allLessons.find(l => !completedLessons.has(l.id));
  const nextLessonSubjectId = nextLesson
    ? purchasedSections.find(s => s.lessons.some(l => l.id === nextLesson.id))?.subjectId
    : undefined;
  const nextCourse = nextLessonSubjectId ? purchasedSubjects.find(s => s.id === nextLessonSubjectId) : undefined;
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome banner */}
      <div className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-sidebar-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-display text-2xl font-bold sm:text-3xl">Welcome back, {user.name}!</h1>
                <p className="text-sidebar-foreground/60">{user.email} · {purchasedSubjects.length} course{purchasedSubjects.length !== 1 ? 's' : ''} enrolled</p>
              </div>
            </div>
            <Link to="/profile">
              <Button variant="outline" size="sm" className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">Edit Profile</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, label: 'Enrolled Courses', value: purchasedSubjects.length, color: 'text-primary', bg: 'bg-primary/10' },
            { icon: PlayCircle, label: 'Lessons Done', value: totalCompleted, color: 'text-secondary', bg: 'bg-secondary/10' },
            { icon: TrendingUp, label: 'Overall Progress', value: totalLessons > 0 ? `${Math.round((totalCompleted / totalLessons) * 100)}%` : '0%', color: 'text-accent', bg: 'bg-accent/10' },
            { icon: Award, label: 'Certificates', value: completedCourses, color: 'text-destructive', bg: 'bg-destructive/10' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Watching */}
        {nextLesson && nextCourse && (
          <div className="mb-8">
            <h2 className="mb-4 font-display text-xl font-bold flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />Continue Watching
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex flex-col sm:flex-row">
                <div className="relative aspect-video sm:w-72 sm:flex-shrink-0">
                  <img src={nextCourse.thumbnailUrl} alt={nextCourse.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-sidebar/40">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card/90 shadow-lg">
                      <PlayCircle className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-xs font-medium text-primary">{nextCourse.title}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold">{nextLesson.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{nextLesson.description}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Link to={`/courses/${nextLessonSubjectId}/lesson/${nextLesson.id}`}>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <PlayCircle className="mr-2 h-4 w-4" />Resume Lesson
                      </Button>
                    </Link>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />{nextLesson.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Learning */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              My Learning
              {purchasedSubjects.length > 0 && (
                <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{purchasedSubjects.length}</span>
              )}
            </h2>
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="text-primary">Browse More <ChevronRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>

          {purchasedSubjects.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {purchasedSubjects.map(subject => {
                const progress = getCourseProgress(subject.id);
                const isComplete = isCourseCompleted(subject.id);
                const sections = mockSections.filter(s => s.subjectId === subject.id);
                const firstIncompleteLesson = sections.flatMap(s => s.lessons).find(l => !completedLessons.has(l.id));
                const firstLesson = sections.flatMap(s => s.lessons)[0];
                const resumeLesson = firstIncompleteLesson || firstLesson;

                return (
                  <div key={subject.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={subject.thumbnailUrl} alt={subject.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link to={resumeLesson ? `/courses/${subject.id}/lesson/${resumeLesson.id}` : `/courses/${subject.id}`}>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/90 shadow-lg">
                            <PlayCircle className="h-6 w-6 text-primary" />
                          </div>
                        </Link>
                      </div>
                      {/* Status badge */}
                      <div className="absolute right-2 top-2">
                        {isComplete ? (
                          <Badge className="bg-success text-success-foreground gap-1">
                            <CheckCircle2 className="h-3 w-3" />Completed
                          </Badge>
                        ) : progress.percent > 0 ? (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />In Progress
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-card/80 gap-1">New</Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <Link to={`/courses/${subject.id}`}>
                        <h3 className="font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{subject.title}</h3>
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">{subject.instructor}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="font-medium">{subject.rating}</span>
                        <span className="text-muted-foreground">· {progress.total} lessons</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{progress.completed}/{progress.total} lessons</span>
                          <span className="font-medium text-foreground">{progress.percent}%</span>
                        </div>
                        <ProgressBar value={progress.percent} size="sm" />
                      </div>
                      <div className="mt-3 flex gap-2">
                        {isComplete ? (
                          <Link to={`/certificate/${subject.id}`} className="flex-1">
                            <Button size="sm" className="w-full gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90">
                              <Award className="h-4 w-4" />View Certificate
                            </Button>
                          </Link>
                        ) : (
                          <Link to={resumeLesson ? `/courses/${subject.id}/lesson/${resumeLesson.id}` : `/courses/${subject.id}`} className="flex-1">
                            <Button size="sm" variant="ghost" className="w-full text-primary hover:bg-primary/5">
                              {progress.percent > 0 ? 'Continue Learning' : 'Start Course'}
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-lg font-semibold">No courses yet</h3>
              <p className="mt-1 text-muted-foreground">Start your learning journey by exploring our course catalog.</p>
              <Link to="/courses">
                <Button className="mt-5 bg-primary text-primary-foreground hover:bg-primary/90">Browse Courses</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Certificates earned */}
        {completedCourses > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-display text-xl font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />My Certificates
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {purchasedSubjects.filter(s => isCourseCompleted(s.id)).map(subject => (
                <div key={subject.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-sm truncate">{subject.title}</p>
                    <p className="text-xs text-muted-foreground">{subject.instructor}</p>
                  </div>
                  <Link to={`/certificate/${subject.id}`}>
                    <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
                      <Download className="h-3.5 w-3.5" />View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
