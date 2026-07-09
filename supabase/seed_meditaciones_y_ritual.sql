-- ============================================
-- SEED: Meditaciones reales + Ritual Especial Mensual
-- ============================================
-- NOTA: audio_url apunta a Supabase Storage (bucket 'meditaciones').
-- Subí los .m4a al bucket con estos mismos nombres de archivo y quedan
-- automáticamente conectados. Los links de Google Drive originales quedan
-- comentados como referencia por si preferís usarlos en cambio.

insert into public.meditations (title, description, audio_url, duration_seconds, category, active) values
('Audio Despertador — Afirmaciones para empezar el día', 'Despertate con energía e intención.', 'despertador/audio-despertador-1.wav', 19, 'despertador', true),
('Meditación para la abundancia y prosperidad', 'Conectá con la energía de la abundancia financiera.', 'meditaciones/prosperidad-y-abundancia.m4a', 844, 'abundancia', true),
('Meditación para la gratitud', 'Un espacio para agradecer profundamente.', 'meditaciones/gratitud.m4a', 596, 'gratitud', true),
('Meditación soy feliz', 'Reconectá con tu alegría interior.', 'meditaciones/soy-feliz.m4a', 909, 'felicidad', true),
('Meditación para sanar al niño interior', 'Un viaje de sanación profunda.', 'meditaciones/sanando-nino-interior.m4a', 918, 'paz_mental', true),
('Meditación de atención plena', 'Mindfulness para estar presente.', 'meditaciones/atencion-plena.m4a', 1254, 'paz_mental', true),
('Meditación para sanar las heridas del pasado', 'Soltá y saná lo que ya pasó.', 'meditaciones/heridas-del-pasado.m4a', 934, 'paz_mental', true),
('Meditación para liberar el miedo', 'Soltá los miedos que te frenan.', 'meditaciones/liberar-el-miedo.m4a', 1454, 'paz_mental', true),
('Meditación para descansar', 'Relajación profunda para dormir bien.', 'meditaciones/para-descansar.m4a', 993, 'paz_mental', true);

-- ============================================
-- SEED: Ritual Especial Mensual
-- ============================================

insert into public.monthly_rituals (month_number, month_name, emoji, title, description) values
(1, 'Enero', '🌱', 'Ritual de Nuevos Comienzos', 'Un mes para sembrar intenciones nuevas y empezar con energía renovada.'),
(2, 'Febrero', '💗', 'Ritual de Amor Propio', 'Un mes para volver a vos, priorizarte y sanar tu relación con el amor.'),
(3, 'Marzo', '🌸', 'Ritual de Renovación', 'Un mes para soltar lo viejo y florecer en algo nuevo.'),
(4, 'Abril', '🚀', 'Ritual de Negocios y Propósito', 'Un mes para alinear tu propósito con la acción concreta.'),
(5, 'Mayo', '🌻', 'Ritual de Relaciones Ideales', 'Un mes para atraer y cultivar vínculos que te sumen.'),
(6, 'Junio', '🕊️', 'Ritual de Paz Interior', 'Un mes para bajar la ansiedad y habitar la calma.'),
(7, 'Julio', '☀️', 'Ritual de Vitalidad', 'Un mes para recuperar energía y entusiasmo.'),
(8, 'Agosto', '🔥', 'Ritual de Enfoque y Disciplina', 'Un mes para sostener el compromiso con tus metas.'),
(9, 'Septiembre', '🌾', 'Ritual de Cosecha', 'Un mes para reconocer y celebrar lo que ya lograste.'),
(10, 'Octubre', '🍂', 'Ritual de Soltar', 'Un mes para liberar lo que ya no te sirve.'),
(11, 'Noviembre', '🕯️', 'Ritual de Introspección', 'Un mes para mirar hacia adentro con honestidad.'),
(12, 'Diciembre', '🎇', 'Ritual de Cierre de Año', 'Un mes para agradecer el ciclo y prepararte para el próximo.');
