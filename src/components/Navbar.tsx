import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, LayoutDashboard, LogOut, Menu, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">LearnHub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link to="/courses">
            <Button variant="ghost" size="sm">Courses</Button>
          </Link>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />Dashboard
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <Shield className="mr-1.5 h-4 w-4" />Admin
                  </Button>
                </Link>
              )}
              <div className="ml-2 flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gradient-primary border-0 text-primary-foreground">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/courses" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Courses</Button>
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Admin</Button>
                  </Link>
                )}
                <Button variant="ghost" className="w-full justify-start" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full gradient-primary border-0 text-primary-foreground">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
