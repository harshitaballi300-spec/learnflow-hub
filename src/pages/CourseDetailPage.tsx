import { useParams } from 'react-router-dom';
import { mockSubjects, mockSections, mockEnrollments } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import SectionAccordion from '@/components/SectionAccordion';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Users, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const subject = mockSubjects.find(s => s.id === id);
  const sections = mockSections.filter(s => s.subjectId === id);

  const [enrolled, setEnrolled] = useState(
    mockEnrollments.some(e => e.subjectId === id && e.userId === user?.id)
  );

  const enrollment = mockEnrollments.find(e => e.subjectId === id);

  if (!subject) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Course not found</div>;
  }

  const handleEnroll = () => {
    if (!user) {
      toast.error('Please log in to enroll');
      return;
    }
    setEnrolled(true);
    toast.success(`Enrolled in ${subject.title}!`);
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
          <p className="mt-2 text-sm">Instructor: <span className="font-medium">{subject.instructor}</span></p>
        </div>

        <div className="glass-card rounded-xl p-6">
          {enrolled ? (
            <div>
              <div className="mb-3 flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Enrolled</span>
              </div>
              {enrollment && (
                <div className="mb-4">
                  <p className="mb-1 text-sm text-muted-foreground">Your progress</p>
                  <ProgressBar value={enrollment.progress} />
                </div>
              )}
              <Button className="w-full gradient-primary border-0 text-primary-foreground">
                Continue Learning
              </Button>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-2xl font-bold font-display">Free</p>
              <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={handleEnroll}>
                Enroll Now
              </Button>
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
