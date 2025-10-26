-- Insérer le cours Flutter
INSERT INTO public.courses (id, title, description, video_url, thumbnail_url, status)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Formation Flutter - Développement Mobile',
  'Apprenez Flutter de A à Z : créez des applications mobiles iOS et Android avec un seul code. Ce cours complet couvre tous les fondamentaux du développement Flutter.',
  'https://youtu.be/3kaGC_DrUnw',
  'https://img.youtube.com/vi/3kaGC_DrUnw/maxresdefault.jpg',
  'active'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url;

-- Insérer les chapitres du cours Flutter
INSERT INTO public.chapters (course_id, title, start_time, end_time, order_index) VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'Introduction à Flutter', '00:00:00', '00:05:30', 1),
  ('123e4567-e89b-12d3-a456-426614174000', 'Installation et Configuration', '00:05:30', '00:15:45', 2),
  ('123e4567-e89b-12d3-a456-426614174000', 'Votre Premier Projet Flutter', '00:15:45', '00:28:20', 3),
  ('123e4567-e89b-12d3-a456-426614174000', 'Comprendre les Widgets', '00:28:20', '00:42:15', 4),
  ('123e4567-e89b-12d3-a456-426614174000', 'Widgets Stateless vs Stateful', '00:42:15', '00:56:30', 5),
  ('123e4567-e89b-12d3-a456-426614174000', 'Layouts et Positionnement', '00:56:30', '01:12:45', 6),
  ('123e4567-e89b-12d3-a456-426614174000', 'Navigation et Routes', '01:12:45', '01:28:20', 7),
  ('123e4567-e89b-12d3-a456-426614174000', 'Gestion d''État avec setState', '01:28:20', '01:45:10', 8),
  ('123e4567-e89b-12d3-a456-426614174000', 'Formulaires et Inputs', '01:45:10', '02:02:35', 9),
  ('123e4567-e89b-12d3-a456-426614174000', 'ListView et GridView', '02:02:35', '02:18:50', 10),
  ('123e4567-e89b-12d3-a456-426614174000', 'Appels API et HTTP', '02:18:50', '02:36:25', 11),
  ('123e4567-e89b-12d3-a456-426614174000', 'Gestion d''État Avancée', '02:36:25', '02:54:40', 12),
  ('123e4567-e89b-12d3-a456-426614174000', 'Animations et Transitions', '02:54:40', '03:12:15', 13),
  ('123e4567-e89b-12d3-a456-426614174000', 'Thèmes et Styles', '03:12:15', '03:28:30', 14),
  ('123e4567-e89b-12d3-a456-426614174000', 'Projet Final - Application Complète', '03:28:30', '04:15:00', 15)
ON CONFLICT DO NOTHING;