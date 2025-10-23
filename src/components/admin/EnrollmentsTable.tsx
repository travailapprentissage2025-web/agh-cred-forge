import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Enrollment {
  id: string;
  user_id: string;
  program_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  performance_score: number | null;
  profiles: {
    full_name: string;
    email: string;
  };
  internship_programs: {
    title: string;
    domain: string;
  };
}

export function EnrollmentsTable() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [interns, setInterns] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    program_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch enrollments
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles (full_name, email),
          internship_programs (title, domain)
        `)
        .order('created_at', { ascending: false });

      setEnrollments(enrollmentsData || []);

      // Fetch interns for dropdown
      const { data: internRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'intern');

      if (internRoles) {
        const userIds = internRoles.map(r => r.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        setInterns(profilesData || []);
      }

      // Fetch programs for dropdown
      const { data: programsData } = await supabase
        .from('internship_programs')
        .select('id, title')
        .eq('status', 'active');

      setPrograms(programsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: formData.user_id,
          program_id: formData.program_id,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
        });

      if (error) throw error;

      toast.success('Intern enrolled successfully!');
      setDialogOpen(false);
      setFormData({ user_id: '', program_id: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll intern');
    }
  };

  const handleValidate = async (enrollmentId: string, userId: string, programId: string) => {
    try {
      // Update enrollment status
      const { error: updateError } = await supabase
        .from('enrollments')
        .update({ 
          status: 'completed',
          end_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', enrollmentId);

      if (updateError) throw updateError;

      // Generate badge
      const verificationHash = `${userId}-${programId}-${Date.now()}`;
      
      const { error: badgeError } = await supabase
        .from('badges')
        .insert({
          user_id: userId,
          program_id: programId,
          verification_hash: verificationHash,
          metadata: {
            issued_by: 'admin',
            issued_date: new Date().toISOString()
          }
        });

      if (badgeError) throw badgeError;

      toast.success('Internship validated and badge generated!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to validate internship');
    }
  };

  if (loading) {
    return (
      <Card className="gradient-card border-0">
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Enrollments Management</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Enroll Intern
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enroll Intern to Program</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEnroll} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="intern">Select Intern</Label>
                <Select
                  value={formData.user_id}
                  onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an intern" />
                  </SelectTrigger>
                  <SelectContent>
                    {interns.map((intern) => (
                      <SelectItem key={intern.id} value={intern.id}>
                        {intern.full_name} ({intern.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Select Program</Label>
                <Select
                  value={formData.program_id}
                  onValueChange={(value) => setFormData({ ...formData, program_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Enroll</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {enrollments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No enrollments found</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intern</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">
                      {enrollment.profiles.full_name}
                    </TableCell>
                    <TableCell>{enrollment.internship_programs.title}</TableCell>
                    <TableCell>{enrollment.internship_programs.domain}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          enrollment.status === 'completed' 
                            ? 'default' 
                            : enrollment.status === 'active'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {enrollment.status === 'active' && (
                        <Button
                          size="sm"
                          onClick={() => handleValidate(
                            enrollment.id,
                            enrollment.user_id,
                            enrollment.program_id
                          )}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Validate & Generate Badge
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
