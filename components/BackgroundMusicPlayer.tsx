'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function BackgroundMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const supabase = createClient();

  const musicUrl = supabase.storage.from('meditaciones').getPublicUrl('musica-de-fondo.mp3').data
    .publicUrl;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25; // volumen bajo: es de fondo, no protagonista
    audio.loop = true;

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        // El navegador bloqueó el autoplay con sonido; esperamos interacción del usuario
        setNeedsInteraction(true);
      });
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setNotFound(true));
      setPlaying(true);
      setNeedsInteraction(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} onError={() => setNotFound(true)} />
      <button
        onClick={toggle}
        title={
          notFound
            ? 'No se encontró el archivo de música'
            : playing
            ? 'Apagar música de fondo'
            : 'Prender música de fondo'
        }
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-pink/30 px-4 py-2 text-sm text-white/90 hover:border-pink transition-colors shadow-lg"
      >
        {notFound ? '⚠️' : playing ? '🎵' : '🔇'}
        <span className="hidden sm:inline">
          {notFound
            ? 'Música no disponible'
            : needsInteraction && !playing
            ? 'Prender música'
            : playing
            ? 'Música'
            : 'Música apagada'}
        </span>
      </button>
    </>
  );
}
