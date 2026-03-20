import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchNodeNarrationAudio } from '@/api/fundingApi';

type NarrateState = 'idle' | 'loading' | 'playing';

export function useNodeNarration(
  nodeId: string,
  onNarratingChange: (id: string | null) => void
) {
  const [narrateState, setNarrateState] = useState<NarrateState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    onNarratingChange(null);
    setNarrateState('idle');
  }, [onNarratingChange]);

  const handleNarrate = useCallback(async () => {
    if (narrateState === 'playing') {
      stop();
      return;
    }
    setNarrateState('loading');
    try {
      const blob = await fetchNodeNarrationAudio(nodeId);
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        objectUrlRef.current = null;
        audioRef.current = null;
        onNarratingChange(null);
        setNarrateState('idle');
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        objectUrlRef.current = null;
        audioRef.current = null;
        onNarratingChange(null);
        setNarrateState('idle');
      };
      await audio.play();
      onNarratingChange(nodeId);
      setNarrateState('playing');
    } catch (err) {
      console.error('[useNodeNarration] error:', err);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      audioRef.current = null;
      onNarratingChange(null);
      setNarrateState('idle');
    }
  }, [narrateState, nodeId, onNarratingChange, stop]);

  // Cleanup on nodeId change or unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [nodeId, stop]);

  return { narrateState, handleNarrate, stop };
}
