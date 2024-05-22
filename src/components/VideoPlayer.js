import React, { useRef, useEffect, useState, useCallback } from "react";
import YouTube from "react-youtube";
import "../styles/VideoPlayer.css";

// Function to get the MIME type based on the file extension
const getMimeType = (url) => {
  const extension = url.split(".").pop();
  switch (extension) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "ogg":
      return "video/ogg";
    case "mov":
      return "video/quicktime";
    case "avi":
      return "video/x-msvideo";
    case "wmv":
      return "video/x-ms-wmv";
    default:
      return "video/mp4";
  }
};

// Function to check if the given URL is a YouTube URL
const isYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};

// Function to extract YouTube video ID from the URL
const getYouTubeId = (url) => {
  const regex =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regex);
  return match && match[7].length === 11 ? match[7] : null;
};

const VideoPlayer = ({ url, captions }) => {
  const videoRef = useRef(null); // Ref for the HTML video element
  const [currentCaption, setCurrentCaption] = useState(""); // State to hold the current caption
  const [loading, setLoading] = useState(true); // State to manage the loading state
  const [player, setPlayer] = useState(null); // State to hold the YouTube player instance

  // Function to update the current caption based on the video's current time
  const updateCaption = useCallback(
    (currentTime) => {
      const caption = captions.find(
        (c) => Math.abs(currentTime - c.time) < 0.5
      );
      setCurrentCaption(caption ? caption.text : "");
    },
    [captions]
  );

  // Effect to handle non-YouTube videos
  useEffect(() => {
    if (url && !isYouTubeUrl(url)) {
      setLoading(true);
      if (videoRef.current) {
        const videoElement = videoRef.current;

        // Event listener for updating the caption as the video plays
        const handleTimeUpdate = () => {
          updateCaption(videoElement.currentTime);
        };

        // Event listener for when the video data is loaded
        const handleLoadedData = () => {
          setLoading(false);
        };

        videoElement.addEventListener("timeupdate", handleTimeUpdate);
        videoElement.addEventListener("loadeddata", handleLoadedData);

        return () => {
          videoElement.removeEventListener("timeupdate", handleTimeUpdate);
          videoElement.removeEventListener("loadeddata", handleLoadedData);
        };
      }
    }
  }, [updateCaption, url]);

  // Effect to handle YouTube videos
  useEffect(() => {
    if (player && isYouTubeUrl(url)) {
      // Polling mechanism to update caption every 500ms
      const interval = setInterval(() => {
        const currentTime = player.getCurrentTime();
        updateCaption(currentTime);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [player, updateCaption, url]);

  // Event handler for YouTube player state change
  const onYouTubePlayerStateChange = (event) => {
    if (event.data === 1) {
      // Video is playing
      setLoading(false);
    }
  };

  // Event handler for YouTube player ready event
  const onYouTubePlayerReady = (event) => {
    setPlayer(event.target);
    setLoading(false);
  };

  const mimeType = getMimeType(url); // Determine the MIME type of the video
  const youtubeId = getYouTubeId(url); // Extract YouTube ID if it's a YouTube URL

  return (
    <div className="video-container">
      {loading && <div className="loader"></div>}{" "}
      {/* Show loader while video is loading */}
      {url && (
        <>
          {isYouTubeUrl(url) ? (
            <div className={`youtube-wrapper ${loading ? "loading" : ""}`}>
              <YouTube
                videoId={youtubeId}
                onReady={onYouTubePlayerReady}
                onStateChange={onYouTubePlayerStateChange}
              />
            </div>
          ) : (
            <video
              key={url}
              ref={videoRef}
              controls
              onCanPlay={() => setLoading(false)}
              className={loading ? "loading" : ""}
            >
              <source src={url} type={mimeType} />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="caption-overlay">{currentCaption}</div>{" "}
          {/* Display current caption */}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
