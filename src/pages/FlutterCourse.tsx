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
        .eq('video_url', 'https://youtu.be/3kaGC_DrUnw')
        .maybeSingle();

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
    return `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&enablejsapi=1&rel=0&modestbranding=1`;
  };

  const timeToSeconds = (time: string) => {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
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
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Formation Flutter - Développement Mobile
          </h1>
          <p className="text-slate-600 text-lg">
            Maîtrisez Flutter et créez des applications iOS et Android professionnelles
          </p>
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
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PlayCircle className="w-6 h-6" />
                  {currentChapter?.title || 'Sélectionnez un chapitre'}
                </CardTitle>
                {currentChapter && (
                  <p className="text-blue-100 text-sm mt-2">
                    Chapitre {chapters.findIndex(ch => ch.id === currentChapter.id) + 1} sur {chapters.length}
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-900 relative">
                  {currentChapter ? (
                    <iframe
                      key={currentChapter.id}
                      src={getYouTubeEmbedUrl()}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title={currentChapter.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <PlayCircle className="w-16 h-16 text-slate-400" />
                      <p className="text-slate-400 text-lg">Sélectionnez un chapitre pour commencer</p>
                    </div>
                  )}
                </div>
                
                {/* Chapter Actions */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => currentChapter && markChapterComplete(currentChapter.id)}
                      disabled={currentChapter?.completed}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      size="lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {currentChapter?.completed ? '✓ Chapitre terminé' : 'Marquer comme terminé'}
                    </Button>
                  </div>
                  
                  {/* Chapter Info */}
                  {currentChapter && (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-2">
                        📚 À propos de ce chapitre
                      </h3>
                      <div className="space-y-2 text-sm text-slate-600">
                        <p>
                          <strong>Durée :</strong> {currentChapter.start_time} - {currentChapter.end_time}
                        </p>
                        <p>
                          💡 Regardez attentivement la vidéo et suivez les instructions pour pratiquer
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Submission Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3 mb-3">
                      <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          Soumettez votre code
                        </h3>
                        <p className="text-sm text-slate-600">
                          Après avoir terminé ce chapitre, partagez le code que vous avez développé (.zip ou .rar)
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setSubmissionDialogOpen(true)}
                      disabled={!currentChapter?.completed || currentChapter?.hasSubmission}
                      variant={currentChapter?.hasSubmission ? "secondary" : "default"}
                      className="w-full"
                      size="lg"
                    >
                      {currentChapter?.hasSubmission ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Livrable déjà envoyé
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Envoyer mon code
                        </>
                      )}
                    </Button>
                  </div>
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
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl sticky top-24">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Programme du cours
                </CardTitle>
                <p className="text-slate-300 text-sm mt-1">
                  {chapters.filter(ch => ch.completed).length} / {chapters.length} chapitres terminés
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                  {chapters.map((chapter, index) => (
                    <motion.button
                      key={chapter.id}
                      onClick={() => setCurrentChapter(chapter)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        currentChapter?.id === chapter.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : chapter.completed
                          ? 'bg-green-50 hover:bg-green-100 border-2 border-green-200'
                          : 'bg-slate-50 hover:bg-slate-100 border-2 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          currentChapter?.id === chapter.id
                            ? 'bg-white/20 text-white'
                            : chapter.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {chapter.completed ? '✓' : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold mb-1 ${
                            currentChapter?.id === chapter.id ? 'text-white' : 'text-slate-900'
                          }`}>
                            {chapter.title}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-xs ${
                              currentChapter?.id === chapter.id ? 'text-white/80' : 'text-slate-500'
                            }`}>
                              ⏱️ {chapter.start_time}
                            </p>
                            {chapter.hasSubmission && (
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-blue-500 text-white"
                              >
                                📤 Code envoyé
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
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
