import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { mockSubjects, mockSections, allUsers, mockEnrollments } from '@/data/mockData';
import { BookOpen, GraduationCap, Layers, Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

type Tab = 'overview' | 'courses' | 'sections' | 'lessons' | 'users';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'sections', label: 'Sections', icon: Layers },
    { id: 'lessons', label: 'Lessons', icon: GraduationCap },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const allLessons = mockSections.flatMap(s => s.lessons);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage your LMS platform</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Courses', value: mockSubjects.length, icon: BookOpen },
            { label: 'Total Sections', value: mockSections.length, icon: Layers },
            { label: 'Total Lessons', value: allLessons.length, icon: GraduationCap },
            { label: 'Total Users', value: allUsers.length, icon: Users },
          ].map(stat => (
            <div key={stat.label} className="glass-card flex items-center gap-4 rounded-xl p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Courses */}
      {activeTab === 'courses' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Courses</h2>
            <Button size="sm" className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.info('Create course form coming soon')}>
              <Plus className="mr-1 h-4 w-4" />Add Course
            </Button>
          </div>
          <div className="glass-card overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Lessons</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Students</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr></thead>
                <tbody>
                  {mockSubjects.map(s => (
                    <tr key={s.id} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 font-medium">{s.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.totalLessons}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.enrolledCount}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast.info('Edit coming soon')}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.info('Delete coming soon')}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      {activeTab === 'sections' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Sections</h2>
            <Button size="sm" className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.info('Coming soon')}>
              <Plus className="mr-1 h-4 w-4" />Add Section
            </Button>
          </div>
          <div className="glass-card overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Section Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Course</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Lessons</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Order</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr></thead>
                <tbody>
                  {mockSections.map(sec => {
                    const course = mockSubjects.find(s => s.id === sec.subjectId);
                    return (
                      <tr key={sec.id} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-3 font-medium">{sec.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">{course?.title || '-'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{sec.lessons.length}</td>
                        <td className="px-4 py-3 text-muted-foreground">{sec.orderIndex}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Lessons */}
      {activeTab === 'lessons' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Lessons</h2>
            <Button size="sm" className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.info('Coming soon')}>
              <Plus className="mr-1 h-4 w-4" />Add Lesson
            </Button>
          </div>
          <div className="glass-card overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Lesson Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Section</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Duration</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr></thead>
                <tbody>
                  {allLessons.map(lesson => {
                    const section = mockSections.find(s => s.id === lesson.sectionId);
                    return (
                      <tr key={lesson.id} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-3 font-medium">{lesson.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">{section?.title || '-'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{lesson.duration}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div>
          <h2 className="mb-4 font-display text-xl font-bold">Users</h2>
          <div className="glass-card overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Enrolled</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                </tr></thead>
                <tbody>
                  {allUsers.map(u => {
                    const enrolled = mockEnrollments.filter(e => e.userId === u.id).length;
                    return (
                      <tr key={u.id} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{enrolled}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.createdAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
