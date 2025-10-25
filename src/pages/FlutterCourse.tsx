import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, Upload, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { SubmissionDialog } from '@/components/course/SubmissionDialog';

interface Chapter {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  order_index: number;
  completed?: boolean;
  hasSubmission?: boolean;
}

export default function FlutterCourse() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadCourse();
    }
  }, [user]);

  const loadCourse = async () => {
    try {
      // Get course
      const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('title', 'Flutter pour débutants')
        .single();

      if (!course) {
        toast.error('Cours non trouvé');
        return;
      }

      setCourseId(course.id);

      // Get chapters
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index');

      if (chaptersData) {
        // Get user progress
        const { data: progressData } = await supabase
          .from('progress')
          .select('chapter_id, completed')
          .eq('user_id', user!.id);

        // Get user submissions
        const { data: submissionsData } = await supabase
          .from('submissions')
          .select('chapter_id')
          .eq('user_id', user!.id);

        const progressMap = new Map(progressData?.map(p => [p.chapter_id, p.completed]) || []);
        const submissionsSet = new Set(submissionsData?.map(s => s.chapter_id) || []);

        const enrichedChapters = chaptersData.map(ch => ({
          ...ch,
          completed: progressMap.get(ch.id) || false,
          hasSubmission: submissionsSet.has(ch.id)
        }));

        setChapters(enrichedChapters);
        
        // Set first incomplete chapter as current
        const firstIncomplete = enrichedChapters.find(ch => !ch.completed);
        setCurrentChapter(firstIncomplete || enrichedChapters[0]);

        // Calculate progress
        const completedCount = enrichedChapters.filter(ch => ch.completed).length;
        setProgress((completedCount / enrichedChapters.length) * 100);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Erreur lors du chargement du cours');
    } finally {
      setLoading(false);
    }
  };

  const markChapterComplete = async (chapterId: string) => {
    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user!.id,
          chapter_id: chapterId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Chapitre terminé ! 🎉');
      loadCourse();
    } catch (error) {
      console.error('Error marking chapter complete:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const getYouTubeEmbedUrl = () => {
    if (!currentChapter) return '';
    const videoId = '3kaGC_DrUnw';
    const startSeconds = timeToSeconds(currentChapter.start_time);
    return `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=1`;
  };

  const timeToSeconds = (time: string) => {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return parts[0] * 60 + parts[1];
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Cours Flutter pour débutants
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}% complété
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  {currentChapter?.title || 'Sélectionnez un chapitre'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden mb-4">
                  {currentChapter && (
                    <iframe
                      src={getYouTubeEmbedUrl()}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => currentChapter && markChapterComplete(currentChapter.id)}
                    disabled={currentChapter?.completed}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {currentChapter?.completed ? 'Chapitre terminé' : 'Marquer comme terminé'}
                  </Button>
                  <Button
                    onClick={() => setSubmissionDialogOpen(true)}
                    variant="outline"
                    disabled={!currentChapter?.completed || currentChapter?.hasSubmission}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {currentChapter?.hasSubmission ? 'Livrable envoyé' : 'Soumettre le livrable'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chapters List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Chapitres ({chapters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => setCurrentChapter(chapter)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        currentChapter?.id === chapter.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-slate-500">
                              #{index + 1}
                            </span>
                            {chapter.completed && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {chapter.hasSubmission && (
                              <Badge variant="secondary" className="text-xs">
                                Livrable envoyé
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-900">
                            {chapter.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {chapter.start_time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {currentChapter && (
        <SubmissionDialog
          open={submissionDialogOpen}
          onOpenChange={setSubmissionDialogOpen}
          chapterId={currentChapter.id}
          chapterTitle={currentChapter.title}
          onSuccess={loadCourse}
        />
      )}
    </div>
  );
}
