import { useRef } from "react";

export default function HoverVideoChip({ label, videoSrc }) {
  const videoRef = useRef(null);

  const handleEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <li
      className="chip-wrapper"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {videoSrc && (
        <div className="chip-preview">
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      )}

      <span className="chip">{label}</span>
    </li>
  );
}
