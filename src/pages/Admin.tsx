import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Users, BookOpen, TrendingUp, Shield, Settings, Download, Filter, Plus, Search, BarChart3, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { InternsTable } from '@/components/admin/InternsTable';
import { ProgramsTable } from '@/components/admin/ProgramsTable';
import { EnrollmentsTable } from '@/components/admin/EnrollmentsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInterns: 0,
    activePrograms: 0,
    totalBadges: 0,
    completedEnrollments: 0,
    pendingApprovals: 0,
    activeEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id)
        .single();

      if (!roleData || roleData.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        navigate('/dashboard');
        return;
      }

      await Promise.all([fetchStats(), fetchRecentActivity()]);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/dashboard');
    }
  };

  const fetchStats = async () => {
    try {
      // Count interns (users with intern role)
      const { count: internsCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'intern');

      // Count active programs
      const { count: programsCount } = await supabase
        .from('internship_programs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Count badges
      const { count: badgesCount } = await supabase
        .from('badges')
        .select('*', { count: 'exact', head: true });

      // Count completed enrollments
      const { count: completedCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Count pending approvals
      const { count: pendingCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending' as any);

      // Count active enrollments
      const { count: activeCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setStats({
        totalInterns: internsCount || 0,
        activePrograms: programsCount || 0,
        totalBadges: badgesCount || 0,
        completedEnrollments: completedCount || 0,
        pendingApprovals: pendingCount || 0,
        activeEnrollments: activeCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data: activityData } = await supabase
        .from('enrollments')
        .select(`
          *,
          internship_programs(name),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(activityData || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const handleExportData = async (type: string) => {
    toast.info(`Exporting ${type} data...`);
    // Implementation for data export would go here
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      active: { variant: 'default' as const, label: 'Active' },
      completed: { variant: 'default' as const, label: 'Completed' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Manage internships, validate completions, and generate badges
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleExportData('reports')}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4" />
                New Program
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {[
            {
              icon: Users,
              label: 'Total Interns',
              value: stats.totalInterns,
              change: '+12%',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: BookOpen,
              label: 'Active Programs',
              value: stats.activePrograms,
              change: '+5%',
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: Award,
              label: 'Total Badges',
              value: stats.totalBadges,
              change: '+23%',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: TrendingUp,
              label: 'Completed',
              value: stats.completedEnrollments,
              change: '+8%',
              color: 'from-orange-500 to-red-500',
            },
            {
              icon: Clock,
              label: 'Pending',
              value: stats.pendingApprovals,
              change: '+3%',
              color: 'from-yellow-500 to-amber-500',
            },
            {
              icon: BarChart3,
              label: 'Active',
              value: stats.activeEnrollments,
              change: '+15%',
              color: 'from-indigo-500 to-blue-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'completed' ? 'bg-green-500' :
                        activity.status === 'active' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {activity.profiles?.full_name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-slate-600 truncate">
                          {activity.internship_programs?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(activity.status)}
                          <span className="text-xs text-slate-500">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Settings className="w-5 h-5" />
                    Management Panel
                  </CardTitle>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search..."
                        className="pl-9 w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-32">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="enrollments" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1 rounded-xl">
                    <TabsTrigger 
                      value="enrollments" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enrollments
                    </TabsTrigger>
                    <TabsTrigger 
                      value="programs" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Programs
                    </TabsTrigger>
                    <TabsTrigger 
                      value="interns" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Interns
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="enrollments" className="mt-6">
                    <EnrollmentsTable searchTerm={searchTerm} filter={selectedFilter} />
                  </TabsContent>
                  <TabsContent value="programs" className="mt-6">
                    <ProgramsTable searchTerm={searchTerm} filter={selectedFilter} />
                  </TabsContent>
                  <TabsContent value="interns" className="mt-6">
                    <InternsTable searchTerm={searchTerm} filter={selectedFilter} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Security Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-8 pt-6 border-t border-slate-200"
        >
          <Shield className="w-4 h-4 text-green-500" />
          Admin dashboard secured with role-based access control
        </motion.div>
      </div>
    </div>
  );
}