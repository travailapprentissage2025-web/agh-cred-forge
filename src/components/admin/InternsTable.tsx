import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface Intern {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export function InternsTable() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const { data: internRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'intern');

      if (!internRoles || internRoles.length === 0) {
        setLoading(false);
        return;
      }

      const userIds = internRoles.map(r => r.user_id);

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)
        .order('created_at', { ascending: false });

      setInterns(profilesData || []);
    } catch (error) {
      console.error('Error fetching interns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="gradient-card border-0">
        <CardHeader>
          <CardTitle>Interns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-0">
      <CardHeader>
        <CardTitle>Interns Management</CardTitle>
      </CardHeader>
      <CardContent>
        {interns.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No interns found</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intern</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interns.map((intern) => (
                  <TableRow key={intern.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={intern.avatar_url || ''} />
                          <AvatarFallback>
                            {intern.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{intern.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{intern.email}</TableCell>
                    <TableCell>
                      {new Date(intern.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
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
