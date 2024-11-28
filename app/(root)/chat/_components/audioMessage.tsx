import { Pause, Play } from "lucide-react";
import React, { useRef, useState } from "react";

const AudioMessage = ({ url }: { url: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const changeSpeed = () => {
    if (audioRef.current) {
      const newSpeed = speed === 2 ? 1 : speed + 0.5;
      setSpeed(newSpeed);
      audioRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <div className="flex items-center bg-[#f0f0f0] p-10 rounded-[20px] my-[10px] gap-[10px]">
      <button
        onClick={togglePlay}
        className="w-[40px] h-[40px] bg-[#25d366] rounded-[50%] flex justify-center items-center text-white text-[16px] cursor-pointer border-none outline-none"
      >
        {!isPlaying ? <Play /> : <Pause />}
      </button>
      <div className="flex-1 flex flex-col gap-[5px]">
        <div className="w-[100%] h-[5px] bg-[#ddd] rounded-[10px] overflow-hidden relative">
          <div
            style={{ width: `${progress}%` }}
            className="h-[100%] bg-[#25d366] transition-all duration-200 ease-in-out"
          ></div>
        </div>
        <div className="flex justify-between text-[12px] text-[#555]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <button onClick={changeSpeed}>{speed}x</button>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        src={url}
        onEnded={() => setIsPlaying(false)}
      ></audio>
    </div>
  );
};

export default AudioMessage;

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
