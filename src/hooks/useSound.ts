import { useCallback, useRef } from 'react';
import { Howl } from 'howler';

interface SoundMap {
  [key: string]: Howl;
}

export const useSound = (isMuted: boolean) => {
  const sounds = useRef<SoundMap>({});

  const playSound = useCallback((name: string, src: string) => {
    if (isMuted) return;

    if (!sounds.current[name]) {
      sounds.current[name] = new Howl({
        src: [src],
        volume: 0.5,
        preload: true
      });
    }

    sounds.current[name].play();
  }, [isMuted]);

  return { playSound };
};