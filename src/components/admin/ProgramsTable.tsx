import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Program {
  id: string;
  title: string;
  domain: string;
  description: string | null;
  duration_weeks: number;
  skills: string[];
  status: string;
  created_at: string;
}

interface ProgramsTableProps {
  searchTerm: string;
  filter: string;
}

export function ProgramsTable({ searchTerm, filter }: ProgramsTableProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    description: '',
    duration_weeks: 8,
    skills: '',
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data } = await supabase
        .from('internship_programs')
        .select('*')
        .order('created_at', { ascending: false });

      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      
      const { error } = await supabase
        .from('internship_programs')
        .insert({
          title: formData.title,
          domain: formData.domain,
          description: formData.description,
          duration_weeks: formData.duration_weeks,
          skills: skillsArray,
          status: 'active'
        });

      if (error) throw error;

      toast.success('Program created successfully!');
      setDialogOpen(false);
      setFormData({
        title: '',
        domain: '',
        description: '',
        duration_weeks: 8,
        skills: '',
      });
      fetchPrograms();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create program');
    }
  };

  if (loading) {
    return (
      <Card className="gradient-card border-0">
        <CardHeader>
          <CardTitle>Programs</CardTitle>
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
        <CardTitle>Internship Programs</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Program</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_weeks}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <Button type="submit" className="w-full">Create Program</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {programs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No programs found</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs
                  .filter((program) => {
                    const searchLower = searchTerm.toLowerCase();
                    return (
                      program.title.toLowerCase().includes(searchLower) ||
                      program.domain.toLowerCase().includes(searchLower) ||
                      program.description?.toLowerCase().includes(searchLower) ||
                      program.skills.some(skill => skill.toLowerCase().includes(searchLower))
                    );
                  })
                  .filter((program) => {
                    if (!filter || filter === 'all') return true;
                    return program.status === filter;
                  })
                  .map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell>{program.domain}</TableCell>
                    <TableCell>{program.duration_weeks} weeks</TableCell>
                    <TableCell>
                      <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                        {program.status}
                      </Badge>
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
