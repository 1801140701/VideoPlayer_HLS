import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import './videoPlayer.css';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [playerInstance, setPlayerInstance] = useState(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const player = new Hls();
      player.loadSource(
        "http://localhost:8085/https://media.kableone.com/Previews/SubedarScene1/index3.m3u8"
      );
      player.attachMedia(video);

      player.on(Hls.Events.MANIFEST_PARSED, () => {
        player.subtitleDisplay = false;
        setSubtitlesEnabled(false);
      });

      player.on(Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
        setAudioTracks(data.audioTracks);
      });

      player.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
        console.log("Subtitle tracks updated:", data.subtitleTracks);
      });

      setPlayerInstance(player);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src =
        "http://localhost:8085/https://media.kableone.com/Previews/SubedarScene1/index3.m3u8";
    }

    return () => {
      if (playerInstance) {
        playerInstance.destroy();
      }
    };
  }, []);

  const changeAudioTrack = () => {
    if (audioTracks.length > 1) {
      const nextTrack = (currentAudioTrack + 1) % audioTracks.length;
      playerInstance.audioTrack = nextTrack;
      setCurrentAudioTrack(nextTrack);
    }
  };

  const toggleSubtitles = () => {
    const newSubtitlesEnabled = !subtitlesEnabled;
    if (playerInstance) {
      playerInstance.subtitleDisplay = newSubtitlesEnabled;
      setSubtitlesEnabled(newSubtitlesEnabled);
    }
    setSubtitlesEnabled(!subtitlesEnabled);
    playerInstance.subtitleDisplay = !subtitlesEnabled;
  };

  const handlePlayClick = () => {
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.log("Error playing video:", error);
      });
  };

  const handlePauseClick = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <div className="wrapper">
      <h1>Video Player</h1>
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", maxWidth: "800px" }}
      ></video>
      <div>
        {!isPlaying ? (
          <button
            autoFocus
            onClick={handlePlayClick}
            className="button-audio focusable"
          >
            Play
          </button>
        ) : (
          <button onClick={handlePauseClick} className="button-audio focusable">
            Pause
          </button>
        )}
        <button onClick={changeAudioTrack} className="button-audio focusable">
          {audioTracks?.length > 0
            ? `Audio: ${audioTracks[currentAudioTrack].name}`
            : "Audio"}
        </button>
        <button onClick={toggleSubtitles} className="button-audio focusable">
          {subtitlesEnabled ? "Disable Subtitles" : "Enable Subtitles"}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;