import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';

const PaymentPage = () => {
  const { user } = useAuth();
  const { getCartSubjects, completePurchase, cartCount } = useCart();
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (cartCount === 0 && !paid) return <Navigate to="/cart" replace />;

  const subjects = getCartSubjects();

  const handlePay = () => {
    setPaid(true);
    completePurchase();
  };

  if (paid) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="font-display text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-3 text-muted-foreground">
          Congratulations {user.name}! Your courses have been added to My Learning.
        </p>
        <Button
          className="mt-8 gradient-primary border-0 text-primary-foreground px-8"
          onClick={() => navigate('/dashboard')}
        >
          Go to My Learning
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold flex items-center gap-3">
        <CreditCard className="h-7 w-7" /> Payment
      </h1>
      <p className="mt-1 text-muted-foreground">Demo payment — no real charges</p>

      <div className="mt-8 glass-card rounded-xl p-6 space-y-4">
        <div className="space-y-2">
          {subjects.map(s => (
            <div key={s.id} className="flex justify-between text-sm">
              <span>{s.title}</span>
              <span className="font-medium">Free</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 flex justify-between font-display font-bold text-lg">
          <span>Total</span>
          <span>Free</span>
        </div>

        <div className="space-y-3 pt-2">
          <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground flex items-center gap-2">
            <Lock className="h-4 w-4" /> This is a demo payment. No real transaction.
          </div>
          <Button
            className="w-full gradient-primary border-0 text-primary-foreground text-lg py-6"
            onClick={handlePay}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
