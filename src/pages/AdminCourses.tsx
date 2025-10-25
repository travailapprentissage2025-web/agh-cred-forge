import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, BookOpen, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Chapter {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  order_index: number;
}

export default function AdminCourses() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [driveUrl, setDriveUrl] = useState('');
  const [newChapter, setNewChapter] = useState({
    title: '',
    start_time: '',
    end_time: '',
    order_index: 1
  });
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkAdminAndLoad();
    }
  }, [user]);

  const checkAdminAndLoad = async () => {
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData || roleData.role !== 'admin') {
        toast.error('Accès refusé. Privilèges administrateur requis.');
        navigate('/dashboard');
        return;
      }

      await loadData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/dashboard');
    }
  };

  const loadData = async () => {
    try {
      // Get course
      const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('title', 'Flutter pour débutants')
        .single();

      if (course) {
        setCourseId(course.id);

        // Get chapters
        const { data: chaptersData } = await supabase
          .from('chapters')
          .select('*')
          .eq('course_id', course.id)
          .order('order_index');

        setChapters(chaptersData || []);
      }

      // Get Drive settings
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('drive_folder_url')
        .single();

      if (settings) {
        setDriveUrl(settings.drive_folder_url || '');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    if (!newChapter.title || !newChapter.start_time) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { error } = await supabase
        .from('chapters')
        .insert({
          course_id: courseId,
          ...newChapter
        });

      if (error) throw error;

      toast.success('Chapitre ajouté avec succès');
      setDialogOpen(false);
      setNewChapter({ title: '', start_time: '', end_time: '', order_index: chapters.length + 1 });
      loadData();
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast.error('Erreur lors de l\'ajout du chapitre');
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) return;

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Chapitre supprimé');
      loadData();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { data: existing } = await supabase
        .from('admin_settings')
        .select('id')
        .single();

      if (existing) {
        const { error } = await supabase
          .from('admin_settings')
          .update({ drive_folder_url: driveUrl })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('admin_settings')
          .insert({ drive_folder_url: driveUrl });

        if (error) throw error;
      }

      toast.success('Paramètres sauvegardés');
      setSettingsOpen(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Gestion des Cours
              </h1>
              <p className="text-slate-600">
                Gérez les chapitres du cours Flutter
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSettingsOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau chapitre
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Chapitres ({chapters.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chapters.map((chapter) => (
                    <TableRow key={chapter.id}>
                      <TableCell>
                        <Badge variant="secondary">#{chapter.order_index}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{chapter.title}</TableCell>
                      <TableCell>{chapter.start_time}</TableCell>
                      <TableCell>{chapter.end_time || '-'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteChapter(chapter.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Chapter Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un chapitre</DialogTitle>
            <DialogDescription>
              Créez un nouveau chapitre pour le cours Flutter
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                placeholder="Ex: Introduction à Flutter"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heure de début * (MM:SS)</Label>
                <Input
                  value={newChapter.start_time}
                  onChange={(e) => setNewChapter({ ...newChapter, start_time: e.target.value })}
                  placeholder="00:00"
                />
              </div>
              <div className="space-y-2">
                <Label>Heure de fin (MM:SS)</Label>
                <Input
                  value={newChapter.end_time}
                  onChange={(e) => setNewChapter({ ...newChapter, end_time: e.target.value })}
                  placeholder="10:30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ordre</Label>
              <Input
                type="number"
                value={newChapter.order_index}
                onChange={(e) => setNewChapter({ ...newChapter, order_index: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleAddChapter} className="flex-1">
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres</DialogTitle>
            <DialogDescription>
              Configurez l'intégration Google Drive
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>URL du dossier Google Drive</Label>
              <Input
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
              />
              <p className="text-xs text-slate-500">
                Les livrables seront accessibles via ce lien
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSettingsOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSaveSettings} className="flex-1">
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
