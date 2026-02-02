'use client';

import { useEffect, useRef, useState } from "react";

type Props = {
  onLevelChange?: (level: number) => void;
  audioSrc?: string;
};

export default function AudioToggle({
  onLevelChange,
  audioSrc = "/lvm001310_64k.mp3"
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const visualLevelRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      analyserRef.current?.disconnect();
      audioCtxRef.current?.close().catch(() => {});
    };
  }, [onLevelChange, audioSrc]);

  const startAnalyser = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (analyserRef.current) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const loop = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const values = dataArrayRef.current;
      let sum = 0;
      for (let i = 0; i < values.length; i++) {
        const v = values[i] / 255;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / values.length);
      visualLevelRef.current = Math.max(
        0,
        Math.min(1, visualLevelRef.current * 0.9 + rms * 0.1)
      );

      const visual = visualLevelRef.current;
      if (buttonRef.current) {
        const scale = 1 + visual * 0.25;
        buttonRef.current.style.transform = `scale(${scale})`;
        buttonRef.current.style.boxShadow = `0 0 0 ${8 * visual}px rgba(255,255,255,${
          0.15 + visual * 0.4
        })`;
      }

      onLevelChange?.(visual);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const startPlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) return;
    setError(null);
    try {
      if (!audioCtxRef.current) {
        const ctx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;
      }
      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }
      await audio.play();
      setIsPlaying(true);
      startAnalyser();
    } catch (err) {
      setError("瀏覽器阻擋自動播放，請再點一次播放。");
      setIsPlaying(false);
      onLevelChange?.(0);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        onLevelChange?.(0);
      } else {
        await startPlayback();
      }
    } catch (err) {
      setError("瀏覽器阻擋自動播放，請再點一次播放。");
      setIsPlaying(false);
      onLevelChange?.(0);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        ref={buttonRef}
        onClick={togglePlay}
        aria-label={isPlaying ? "暫停音樂" : "播放音樂"}
        className="relative h-12 w-12 rounded-full border border-white/25 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition hover:border-white/50 hover:bg-white/10 focus:outline-none"
      >
        <span
          className={`absolute inset-0 rounded-full transition ${
            isPlaying ? "animate-ping bg-white/10" : "bg-transparent"
          }`}
          style={isPlaying ? { animationDuration: "2.4s" } : undefined}
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-8 w-8 text-white">
            <span
              className="absolute inset-0 rounded-full border border-white/25"
              aria-hidden
            />
            {isPlaying ? (
              <svg
                viewBox="0 0 24 24"
                className="absolute inset-0 m-auto h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 13c3.5-6 6.5-2 9 0s4.5-2 9-2" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="absolute inset-0 m-auto h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="4" x2="6" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
            )}
          </div>
        </span>
      </button>
      {error && <span className="text-[11px] text-amber-200/80">{error}</span>}
    </div>
  );
}
