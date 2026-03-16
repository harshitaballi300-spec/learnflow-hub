import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCompletion } from '@/contexts/CompletionContext';
import { mockSubjects } from '@/data/mockData';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Award, Star } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificatePage = () => {
  const { id: subjectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isCourseCompleted, getCompletionDate } = useCompletion();
  const certRef = useRef<HTMLDivElement>(null);

  if (!user) return <Navigate to="/login" replace />;

  const subject = mockSubjects.find(s => s.id === subjectId);
  if (!subject || !isCourseCompleted(subjectId || '')) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <Award className="h-16 w-16 opacity-30" />
        <p className="text-lg">Certificate not available yet. Complete all lessons first.</p>
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const completionDate = getCompletionDate(subjectId || '');
  const formattedDate = completionDate
    ? new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`LearnHub-Certificate-${subject.title.replace(/\s+/g, '-')}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              Print
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="h-4 w-4" />Download PDF
            </Button>
          </div>
        </div>

        {/* Certificate */}
        <div ref={certRef} className="relative mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl" style={{ aspectRatio: '1.414/1' }}>
          {/* Decorative border */}
          <div className="absolute inset-3 rounded-xl border-2 border-dashed" style={{ borderColor: 'hsl(220, 70%, 45%)' }} />
          <div className="absolute inset-5 rounded-lg border" style={{ borderColor: 'hsl(38, 92%, 55%)' }} />

          {/* Corner ornaments */}
          {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} h-16 w-16 rounded-full opacity-10`} style={{ background: 'hsl(220, 70%, 45%)' }} />
          ))}

          <div className="relative flex h-full flex-col items-center justify-center px-12 py-8 text-center">
            {/* Header */}
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, hsl(220, 70%, 45%), hsl(170, 55%, 42%))' }}>
                <Award className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-2xl font-bold tracking-wide" style={{ color: 'hsl(220, 70%, 45%)' }}>LearnHub</span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-wider uppercase" style={{ color: 'hsl(220, 30%, 12%)' }}>
              Certificate of Completion
            </h1>

            <div className="my-4 h-px w-48" style={{ background: 'linear-gradient(90deg, transparent, hsl(38, 92%, 55%), transparent)' }} />

            <p className="text-lg" style={{ color: 'hsl(220, 10%, 46%)' }}>This is to certify that</p>

            <h2 className="mt-3 font-display text-3xl font-bold" style={{ color: 'hsl(220, 70%, 45%)' }}>
              {user.name}
            </h2>

            <p className="mt-4 text-lg" style={{ color: 'hsl(220, 10%, 46%)' }}>has successfully completed the course</p>

            <h3 className="mt-3 max-w-lg font-display text-xl font-semibold" style={{ color: 'hsl(220, 30%, 12%)' }}>
              {subject.title}
            </h3>

            <p className="mt-2 text-sm" style={{ color: 'hsl(220, 10%, 46%)' }}>
              Instructor: {subject.instructor}
            </p>

            <div className="mt-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4" style={{ color: 'hsl(38, 92%, 55%)', fill: 'hsl(38, 92%, 55%)' }} />
              ))}
            </div>

            <div className="my-6 h-px w-32" style={{ background: 'linear-gradient(90deg, transparent, hsl(38, 92%, 55%), transparent)' }} />

            <div className="flex items-center gap-12">
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'hsl(220, 10%, 46%)' }}>Date of Completion</p>
                <p className="mt-1 font-display font-semibold" style={{ color: 'hsl(220, 30%, 12%)' }}>{formattedDate}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'hsl(220, 10%, 46%)' }}>Certificate ID</p>
                <p className="mt-1 font-display font-semibold" style={{ color: 'hsl(220, 30%, 12%)' }}>
                  LH-{subjectId?.toUpperCase()}-{user.id.toUpperCase()}
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs" style={{ color: 'hsl(220, 10%, 46%)' }}>
              Verified by LearnHub · www.learnhub.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
