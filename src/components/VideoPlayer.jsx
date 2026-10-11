import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ videoUrl, localVideoPath, title, onEnded }) => {
  const videoRef = useRef(null);

  // Determine effective stream source
  const getSource = () => {
    if (localVideoPath) {
      return `/api/files/${localVideoPath}`;
    }
    if (videoUrl) {
      return videoUrl;
    }
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  };

  const isEmbed = (url) => {
    if (!url) return false;
    return url.includes('youtube.com/embed') || url.includes('player.vimeo.com');
  };

  const src = getSource();

  return (
    <div className="video-container mb-3">
      {isEmbed(videoUrl) ? (
        <iframe
          src={videoUrl}
          title={title || 'Lesson Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          ref={videoRef}
          key={src}
          controls
          controlsList="nodownload"
          onEnded={onEnded}
          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80"
          className="w-100"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
