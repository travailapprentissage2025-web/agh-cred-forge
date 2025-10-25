import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Award, BookOpen, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string>('intern');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      setProfile(profileData);

      // Fetch all roles for the user
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id);

      if (rolesData && rolesData.length > 0) {
        // Check if user has admin role
        const hasAdminRole = rolesData.some(r => r.role === 'admin');
        
        if (hasAdminRole) {
          setRole('admin');
          navigate('/admin');
          return;
        } else {
          setRole(rolesData[0].role);
        }
      }

      // Fetch enrollments
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          *,
          internship_programs (*)
        `)
        .eq('user_id', user!.id);

      setEnrollments(enrollmentsData || []);

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('badges')
        .select(`
          *,
          internship_programs (*)
        `)
        .eq('user_id', user!.id);

      setBadges(badgesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid md:grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                  <p className="text-muted-foreground mb-3">{profile.email}</p>
                  <Badge variant="secondary" className="capitalize">
                    {role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="hover-lift gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Programs
                </CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {enrollments.filter(e => e.status === 'active').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="hover-lift gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Badges Earned
                </CardTitle>
                <Award className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{badges.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="hover-lift gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {enrollments.filter(e => e.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Active Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Active Internships</h2>
          {enrollments.filter(e => e.status === 'active').length === 0 ? (
            <Card className="gradient-card border-0">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No active internships yet. Contact your admin to get enrolled!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {enrollments
                .filter(e => e.status === 'active')
                .map((enrollment) => (
                  <Card key={enrollment.id} className="hover-lift gradient-card border-0">
                    <CardHeader>
                      <CardTitle>{enrollment.internship_programs.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {enrollment.internship_programs.domain}
                        </p>
                        <Badge>{enrollment.status}</Badge>
                        {enrollment.performance_score && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-1">Progress</p>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-smooth"
                                style={{ width: `${enrollment.performance_score}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </motion.div>

        {/* Badges Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Your Badges</h2>
          {badges.length === 0 ? (
            <Card className="gradient-card border-0">
              <CardContent className="p-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Complete your internships to earn verified badges!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <Card className="hover-lift gradient-card border-0 badge-shine">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="h-10 w-10 text-warning" />
                      </div>
                      <h3 className="font-semibold mb-1">
                        {badge.internship_programs.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(badge.issued_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
