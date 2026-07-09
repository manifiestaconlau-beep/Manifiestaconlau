-- ============================================
-- SEED: Posts de ejemplo para la Comunidad
-- ============================================
-- Estos posts no tienen una usuaria real detrás (user_id null), solo un
-- nombre de ejemplo, para que la sección de Comunidad no se vea vacía el
-- día del lanzamiento. Podés borrarlos más adelante desde Supabase Table
-- Editor cuando ya tengas posts reales de tus usuarias.

insert into public.community_posts (author_name, content, category, likes_count) values
('Male G.', 'Hoy cerré el proyecto que vengo manifestando hace dos meses. Confiar en el proceso funciona 🤍', 'negocios', 14),
('Cami R.', 'Empecé el diario hace 3 semanas y ya note que estoy mucho más agradecida con lo que tengo, no solo enfocada en lo que falta.', 'gratitud', 9),
('Vale S.', 'Manifestando un cliente nuevo esta semana. Ya lo escribí en mi ritual de luna nueva, ahora a soltar y confiar.', 'abundancia', 21),
('Ro Fernández', 'Después de mucho tiempo elegí terminar una relación que no me sumaba. Da miedo pero se siente como el primer paso hacia lo que sí quiero.', 'amor', 33),
('Any T.', 'La meditación para descansar me cambió las noches. Antes no podía bajar la ansiedad y ahora duermo mucho mejor.', 'paz_mental', 17);
