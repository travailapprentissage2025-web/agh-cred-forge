import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGamification = (userId: string | undefined) => {
  const [userLevel, setUserLevel] = useState<any>(null);
  const [newBadges, setNewBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      initializeUserLevel();
      fetchUserLevel();
    }
  }, [userId]);

  const initializeUserLevel = async () => {
    if (!userId) return;

    try {
      // Créer l'entrée user_levels si elle n'existe pas
      const { error } = await supabase
        .from('user_levels' as any)
        .insert({
          user_id: userId,
          xp: 0,
          level: 1,
          current_streak: 0,
          longest_streak: 0,
          total_chapters_completed: 0,
          total_submissions: 0
        })
        .select()
        .single();

      if (error && !error.message.includes('duplicate key')) {
        console.error('Error initializing user level:', error);
      }
    } catch (error) {
      console.error('Error in initializeUserLevel:', error);
    }
  };

  const fetchUserLevel = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_levels' as any)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setUserLevel(data);
      }
    } catch (error) {
      console.error('Error fetching user level:', error);
    } finally {
      setLoading(false);
    }
  };

  const grantXp = async (amount: number, reason: string = 'activity') => {
    if (!userId) return;

    try {
      // Appeler la fonction RPC pour accorder l'XP
      const { data, error } = await supabase.rpc('grant_xp' as any, {
        p_user_id: userId,
        p_amount: amount,
        p_reason: reason
      });

      if (error) throw error;

      // Rafraîchir les données
      await fetchUserLevel();

      // Vérifier si niveau augmenté
      if (data && data[0]?.level_up) {
        toast.success(`🎉 Niveau ${data[0].new_level} atteint !`, {
          description: `Vous avez gagné ${amount} XP`,
        });
      } else {
        toast.success(`+${amount} XP`, {
          description: reason,
        });
      }

      // Vérifier les nouveaux badges
      await checkBadges();
    } catch (error) {
      console.error('Error granting XP:', error);
    }
  };

  const updateStreak = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase.rpc('update_user_streak' as any, {
        p_user_id: userId
      });

      if (error) throw error;
      await fetchUserLevel();
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const checkBadges = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase.rpc('check_and_award_badges' as any, {
        p_user_id: userId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setNewBadges(data);
        // Les badges seront affichés via le composant AchievementToast
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const markChapterComplete = async () => {
    if (!userId) return;

    try {
      // Incrémenter le compteur de chapitres complétés
      const { error } = await supabase
        .from('user_levels' as any)
        .update({
          total_chapters_completed: (userLevel?.total_chapters_completed || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Accorder de l'XP
      await grantXp(100, 'Chapitre terminé');
      await updateStreak();
    } catch (error) {
      console.error('Error marking chapter complete:', error);
    }
  };

  const markSubmissionComplete = async () => {
    if (!userId) return;

    try {
      // Incrémenter le compteur de soumissions
      const { error } = await supabase
        .from('user_levels' as any)
        .update({
          total_submissions: (userLevel?.total_submissions || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Accorder de l'XP
      await grantXp(50, 'Code soumis');
    } catch (error) {
      console.error('Error marking submission complete:', error);
    }
  };

  const clearNewBadges = () => {
    setNewBadges([]);
  };

  return {
    userLevel,
    loading,
    newBadges,
    grantXp,
    updateStreak,
    checkBadges,
    markChapterComplete,
    markSubmissionComplete,
    clearNewBadges,
    refreshLevel: fetchUserLevel
  };
};
