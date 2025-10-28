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
import { PlayCircle, CheckCircle, Upload, Clock, List, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { SubmissionDialog } from '@/components/course/SubmissionDialog';
import { AchievementToast } from '@/components/gamification/AchievementToast';
import { useGamification } from '@/hooks/useGamification';

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
  const [playerNonce, setPlayerNonce] = useState(0);
  const [courseId, setCourseId] = useState<string>('');
  const [showChaptersList, setShowChaptersList] = useState(false);
  const { markChapterComplete, newBadges, clearNewBadges } = useGamification(user?.id);

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
      // Vérifier d'abord ce qu'il y a dans la base de données
      const { data: allCourses, error: debugError } = await supabase
        .from('courses')
        .select('*');
      
      console.log('Tous les cours dans la base de données:', allCourses);

      // Essayer différentes variations de l'URL
      const videoUrls = [
        'https://youtu.be/3kaGC_DrUnw?si=DGvwvnpG4OlbghN-',
        'https://youtu.be/3kaGC_DrUnw',
        'https://www.youtube.com/watch?v=3kaGC_DrUnw',
        '3kaGC_DrUnw'
      ];

      let course = null;

      // Essayer chaque URL jusqu'à trouver un cours
      for (const url of videoUrls) {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('video_url', url)
          .maybeSingle();

        if (error) {
          console.error(`Erreur avec l'URL ${url}:`, error);
          continue;
        }

        if (data) {
          course = data;
          console.log('Cours trouvé avec URL:', url);
          break;
        }
      }

      // Si aucun cours n'est trouvé, utiliser le premier cours disponible ou créer des données fictives
      if (!course) {
        if (allCourses && allCourses.length > 0) {
          course = allCourses[0];
          console.log('Utilisation du premier cours disponible:', course);
        } else {
          // Données fictives pour tester
          console.log('Aucun cours trouvé, utilisation de données fictives');
          const mockCourse = {
            id: 'flutter-course-mock-id',
            title: 'Formation Flutter - Développement Mobile',
            video_url: 'https://youtu.be/3kaGC_DrUnw?si=DGvwvnpG4OlbghN-'
          };
          course = mockCourse;
        }
      }

      setCourseId(course.id);

      // Récupérer les chapitres depuis la base de données
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index');

      if (chaptersError) {
        console.error('Erreur lors de la récupération des chapitres:', chaptersError);
        toast.error('Erreur lors du chargement des chapitres');
        
        // Utiliser des chapitres fictifs basés sur la structure YouTube
        const mockChapters = [
          {
            id: 'intro',
            title: 'Introduction à Flutter',
            start_time: '0:00',
            end_time: '2:30',
            order_index: 1,
            completed: false,
            hasSubmission: false
          },
          {
            id: 'installation',
            title: 'Installation et configuration',
            start_time: '2:30',
            end_time: '10:00',
            order_index: 2,
            completed: false,
            hasSubmission: false
          },
          {
            id: 'premiere-app',
            title: 'Création première application',
            start_time: '10:00',
            end_time: '20:00',
            order_index: 3,
            completed: false,
            hasSubmission: false
          },
          {
            id: 'widgets',
            title: 'Découverte des Widgets',
            start_time: '20:00',
            end_time: '30:00',
            order_index: 4,
            completed: false,
            hasSubmission: false
          },
          {
            id: 'state-management',
            title: 'Gestion d\'état',
            start_time: '30:00',
            end_time: '45:00',
            order_index: 5,
            completed: false,
            hasSubmission: false
          }
        ];
        
        setChapters(mockChapters);
        setCurrentChapter(mockChapters[0]);
        setProgress(0);
        return;
      }

      if (chaptersData && chaptersData.length > 0) {
        // Récupérer la progression utilisateur
        const { data: progressData } = await supabase
          .from('progress')
          .select('chapter_id, completed')
          .eq('user_id', user!.id);

        // Récupérer les soumissions utilisateur
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
        
        // Définir le premier chapitre non terminé comme actuel
        const firstIncomplete = enrichedChapters.find(ch => !ch.completed);
        setCurrentChapter(firstIncomplete || enrichedChapters[0]);

        // Calculer la progression
        const completedCount = enrichedChapters.filter(ch => ch.completed).length;
        setProgress((completedCount / enrichedChapters.length) * 100);
      } else {
        // Aucun chapitre trouvé - utiliser des données fictives
        console.log('Aucun chapitre trouvé, utilisation de données fictives');
        const mockChapters = [
          {
            id: 'chap-1',
            title: 'Introduction à Flutter',
            start_time: '0:00',
            end_time: '10:00',
            order_index: 1,
            completed: false,
            hasSubmission: false
          },
          {
            id: 'chap-2',
            title: 'Installation et configuration',
            start_time: '10:00',
            end_time: '20:00',
            order_index: 2,
            completed: false,
            hasSubmission: false
          }
        ];
        
        setChapters(mockChapters);
        setCurrentChapter(mockChapters[0]);
        setProgress(0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du cours:', error);
      toast.error('Erreur lors du chargement du cours');
    } finally {
      setLoading(false);
    }
  };

  const markChapterCompleteHandler = async (chapterId: string) => {
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

      // Accorder l'XP et mettre à jour le streak
      await markChapterComplete();

      toast.success('Chapitre terminé ! 🎉');
      loadCourse(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors du marquage du chapitre comme terminé:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const getYouTubeEmbedUrl = () => {
    if (!currentChapter) return '';
    
    const videoId = '3kaGC_DrUnw';
    const startSeconds = timeToSeconds(currentChapter.start_time);
    
    // URL avec support des chapitres YouTube
    const params = new URLSearchParams({
      start: startSeconds.toString(),
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      playsinline: '1'
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
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

  // Fonction pour formater le temps en minutes:secondes
  const formatTime = (time: string) => {
    const seconds = timeToSeconds(time);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Formation Flutter - Développement Mobile
              </h1>
              <p className="text-slate-600 text-lg">
                Maîtrisez Flutter et créez des applications iOS et Android professionnelles
              </p>
            </div>
            <Button
              onClick={() => setShowChaptersList(!showChaptersList)}
              variant="outline"
              className="lg:hidden"
            >
              <List className="w-4 h-4 mr-2" />
              Chapitres
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}% complété
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lecteur vidéo */}
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
                  <div className="flex flex-wrap items-center gap-4 text-blue-100 text-sm mt-2">
                    <p>
                      Chapitre {chapters.findIndex(ch => ch.id === currentChapter.id) + 1} sur {chapters.length}
                    </p>
                    <p>⏱️ {formatTime(currentChapter.start_time)} - {formatTime(currentChapter.end_time)}</p>
                    {currentChapter.completed && (
                      <Badge className="bg-green-500">Terminé</Badge>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-900 relative">
                  {currentChapter ? (
                    <iframe
                      key={`${currentChapter.id}-${playerNonce}`}
                      src={getYouTubeEmbedUrl()}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title={currentChapter.title}
                      frameBorder="0"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <PlayCircle className="w-16 h-16 text-slate-400" />
                      <p className="text-slate-400 text-lg">Sélectionnez un chapitre pour commencer</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 items-center p-4 border-t border-slate-100 bg-slate-50/60">
                  <Button
                    variant="outline"
                    onClick={() => setPlayerNonce((n) => n + 1)}
                  >
                    Recharger le lecteur
                  </Button>
                  {currentChapter && (
                    <Button asChild variant="secondary">
                      <a
                        href={`https://www.youtube.com/watch?v=3kaGC_DrUnw&t=${timeToSeconds(currentChapter.start_time)}s`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ouvrir sur YouTube
                      </a>
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowChaptersList(!showChaptersList)}
                    variant="outline"
                    className="lg:hidden"
                  >
                    <List className="w-4 h-4 mr-2" />
                    {showChaptersList ? 'Masquer' : 'Afficher'} les chapitres
                  </Button>
                </div>
                
                {/* Actions du chapitre */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => currentChapter && markChapterCompleteHandler(currentChapter.id)}
                      disabled={currentChapter?.completed}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      size="lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {currentChapter?.completed ? '✓ Chapitre terminé' : 'Marquer comme terminé'}
                    </Button>
                  </div>
                  
                  {/* Navigation entre chapitres */}
                  {currentChapter && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id);
                          if (currentIndex > 0) {
                            setCurrentChapter(chapters[currentIndex - 1]);
                          }
                        }}
                        disabled={chapters.findIndex(ch => ch.id === currentChapter.id) === 0}
                        className="flex-1"
                      >
                        ← Chapitre précédent
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id);
                          if (currentIndex < chapters.length - 1) {
                            setCurrentChapter(chapters[currentIndex + 1]);
                          }
                        }}
                        disabled={chapters.findIndex(ch => ch.id === currentChapter.id) === chapters.length - 1}
                        className="flex-1"
                      >
                        Chapitre suivant →
                      </Button>
                    </div>
                  )}
                  
                  {/* Section de soumission */}
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

          {/* Liste des chapitres - Version Desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-1 ${showChaptersList ? 'block' : 'hidden lg:block'}`}
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
                      onClick={() => {
                        setCurrentChapter(chapter);
                        setShowChaptersList(false);
                      }}
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
                              ⏱️ {formatTime(chapter.start_time)} - {formatTime(chapter.end_time)}
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

      <AchievementToast
        badge={newBadges[0] || null}
        show={newBadges.length > 0}
        onHide={clearNewBadges}
      />
    </div>
  );
}