import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, BookOpen } from 'lucide-react';

const CartPage = () => {
  const { user } = useAuth();
  const { getCartSubjects, removeFromCart, cartCount } = useCart();

  if (!user) return <Navigate to="/login" replace />;

  const subjects = getCartSubjects();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold flex items-center gap-3">
        <ShoppingCart className="h-7 w-7" /> Shopping Cart
        <span className="text-lg text-muted-foreground">({cartCount} items)</span>
      </h1>

      {subjects.length === 0 ? (
        <div className="mt-16 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <p className="mt-4 text-lg text-muted-foreground">Your cart is empty</p>
          <Link to="/courses">
            <Button className="mt-4 gradient-primary border-0 text-primary-foreground">Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {subjects.map(subject => (
            <div key={subject.id} className="glass-card flex items-center gap-4 rounded-xl p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg gradient-primary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold">{subject.title}</h3>
                <p className="text-sm text-muted-foreground">by {subject.instructor} · {subject.totalLessons} lessons</p>
              </div>
              <p className="font-display text-lg font-bold">Free</p>
              <Button variant="ghost" size="sm" onClick={() => removeFromCart(subject.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="glass-card rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">Total:</span>
              <span className="font-display text-2xl font-bold">Free</span>
            </div>
            <Link to="/payment">
              <Button className="w-full gradient-primary border-0 text-primary-foreground text-lg py-6">
                Proceed to Payment
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
