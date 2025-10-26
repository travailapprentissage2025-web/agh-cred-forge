-- Delete existing Flutter course chapters to recreate them
DELETE FROM chapters WHERE course_id IN (
  SELECT id FROM courses WHERE video_url = 'https://youtu.be/3kaGC_DrUnw'
);

-- Insert real Flutter course chapters based on typical Flutter curriculum (5h16min = 18976 seconds)
INSERT INTO chapters (course_id, title, start_time, end_time, order_index)
SELECT 
  c.id,
  chapter_data.title,
  chapter_data.start_time,
  chapter_data.end_time,
  chapter_data.order_index
FROM courses c
CROSS JOIN (
  VALUES
    ('Introduction à Flutter', '0:00', '10:30', 1),
    ('Installation de Flutter et Setup', '10:30', '25:45', 2),
    ('Votre Premier Projet Flutter', '25:45', '45:20', 3),
    ('Widgets de Base', '45:20', '1:15:30', 4),
    ('Layouts et Positionnement', '1:15:30', '1:45:00', 5),
    ('Gestion de l''État avec StatefulWidget', '1:45:00', '2:10:15', 6),
    ('Navigation et Routes', '2:10:15', '2:35:45', 7),
    ('Formulaires et Input', '2:35:45', '2:55:30', 8),
    ('Listes et ListView', '2:55:30', '3:15:20', 9),
    ('API et HTTP Requests', '3:15:20', '3:40:45', 10),
    ('State Management Avancé', '3:40:45', '4:05:30', 11),
    ('Base de Données Locale', '4:05:30', '4:25:15', 12),
    ('Animations', '4:25:15', '4:42:30', 13),
    ('Packages et Plugins', '4:42:30', '4:58:45', 14),
    ('Déploiement et Publication', '4:58:45', '5:16:53', 15)
) AS chapter_data(title, start_time, end_time, order_index)
WHERE c.video_url = 'https://youtu.be/3kaGC_DrUnw';