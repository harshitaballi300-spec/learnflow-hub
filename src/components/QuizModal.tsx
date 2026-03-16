import { useState, useEffect } from 'react';
import { courseQuizzes, QuizQuestion } from '@/data/quizData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string;
  courseName: string;
}

interface QuizResult {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  answers: Record<string, number>;
}

const getStoredResult = (subjectId: string): QuizResult | null => {
  const stored = localStorage.getItem('quizResults');
  if (!stored) return null;
  const results = JSON.parse(stored);
  return results[subjectId] || null;
};

const storeResult = (subjectId: string, result: QuizResult) => {
  const stored = localStorage.getItem('quizResults');
  const results = stored ? JSON.parse(stored) : {};
  results[subjectId] = result;
  localStorage.setItem('quizResults', JSON.stringify(results));
};

const QuizModal = ({ open, onOpenChange, subjectId, courseName }: QuizModalProps) => {
  const quiz = courseQuizzes.find(q => q.subjectId === subjectId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      const stored = getStoredResult(subjectId);
      if (stored) {
        setResult(stored);
        setAnswers(stored.answers);
        setSubmitted(true);
      } else {
        setAnswers({});
        setResult(null);
        setSubmitted(false);
      }
    }
  }, [open, subjectId]);

  if (!quiz) return null;

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    const percent = Math.round((correct / quiz.questions.length) * 100);
    const res: QuizResult = {
      score: correct,
      total: quiz.questions.length,
      percent,
      passed: percent >= quiz.passingScore,
      answers,
    };
    setResult(res);
    setSubmitted(true);
    storeResult(subjectId, res);
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setSubmitted(false);
    const stored = localStorage.getItem('quizResults');
    if (stored) {
      const results = JSON.parse(stored);
      delete results[subjectId];
      localStorage.setItem('quizResults', JSON.stringify(results));
    }
  };

  const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {submitted && result ? (result.passed ? '🎉 Quiz Results' : '📝 Quiz Results') : '📝 Course Quiz'}
          </DialogTitle>
          <DialogDescription>{courseName}</DialogDescription>
        </DialogHeader>

        {submitted && result ? (
          <div className="space-y-6">
            <div className={cn(
              'rounded-xl p-6 text-center',
              result.passed ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
            )}>
              <div className="mb-3">
                {result.passed
                  ? <Trophy className="mx-auto h-12 w-12 text-success" />
                  : <XCircle className="mx-auto h-12 w-12 text-destructive" />}
              </div>
              <h3 className={cn('text-2xl font-bold', result.passed ? 'text-success' : 'text-destructive')}>
                {result.percent}%
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.score} of {result.total} correct
              </p>
              <p className={cn('mt-2 font-semibold', result.passed ? 'text-success' : 'text-destructive')}>
                {result.passed ? 'Congratulations! You passed!' : `You need ${quiz.passingScore}% to pass. Try again!`}
              </p>
            </div>

            {/* Show answers review */}
            <div className="space-y-4">
              {quiz.questions.map((q, qi) => {
                const userAnswer = result.answers[q.id];
                const isCorrect = userAnswer === q.correctIndex;
                return (
                  <div key={q.id} className={cn('rounded-lg border p-4', isCorrect ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5')}>
                    <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
                    <div className="mt-2 space-y-1">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={cn('flex items-center gap-2 rounded px-2 py-1 text-sm',
                          oi === q.correctIndex && 'text-success font-medium',
                          oi === userAnswer && oi !== q.correctIndex && 'text-destructive line-through',
                        )}>
                          {oi === q.correctIndex ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : oi === userAnswer ? <XCircle className="h-3.5 w-3.5 shrink-0" /> : <span className="w-3.5" />}
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {!result.passed && (
              <Button onClick={handleRetry} className="w-full gap-2">
                <RotateCcw className="h-4 w-4" /> Retry Quiz
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              Answer all {quiz.questions.length} questions. You need {quiz.passingScore}% to pass.
            </div>

            {quiz.questions.map((q, qi) => (
              <div key={q.id} className="space-y-3">
                <p className="text-sm font-semibold">
                  {qi + 1}. {q.question}
                </p>
                <RadioGroup
                  value={answers[q.id]?.toString()}
                  onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: parseInt(val) }))}
                  className="space-y-2"
                >
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={oi.toString()} id={`${q.id}-${oi}`} />
                      <Label htmlFor={`${q.id}-${oi}`} className="flex-1 cursor-pointer text-sm">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <Button onClick={handleSubmit} disabled={!allAnswered} className="w-full" size="lg">
              Submit Quiz
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
