import { useEffect, useRef, useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

export default function VideoPlayer({ movie, onClose }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem(`movie-progress-${movie.id}`);
    if (savedProgress && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedProgress);
    }
  }, [movie.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      
      // Save progress to localStorage every 5 seconds
      if (Math.floor(video.currentTime) % 5 === 0) {
        localStorage.setItem(`movie-progress-${movie.id}`, video.currentTime.toString());
      }
    };

    const handleEnded = () => {
      localStorage.removeItem(`movie-progress-${movie.id}`);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [movie.id]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black" data-testid="video-player">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
        data-testid="video-player-close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-24 z-50 w-12 h-12 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
        data-testid="video-player-mute"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        src={movie.videoUrl}
        data-testid="video-element"
      >
        {movie.subtitles.map((subtitle, idx) => (
          <track
            key={idx}
            kind="subtitles"
            srcLang={subtitle.toLowerCase()}
            label={subtitle}
          />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
        <div
          className="h-full bg-[#e50914] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}