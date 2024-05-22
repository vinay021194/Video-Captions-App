import React, { useState } from "react";
import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import CaptionInput from "./components/CaptionInput";
import Navbar from "./components/Navbar";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [error, setError] = useState("");

  const handleLoadVideo = () => {
    const url = document.getElementById("video-url").value;
    if (url) {
      setVideoUrl(url);
      setError("");
    } else {
      setError("Please enter a valid video URL.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <div className="input-group">
          <input
            type="text"
            id="video-url"
            placeholder="Enter video URL"
            size="50"
          />
          <button onClick={handleLoadVideo}>Load Video</button>
        </div>
        {error && <div className="error">{error}</div>}
        <VideoPlayer url={videoUrl} captions={captions} />
        <CaptionInput onAddCaptions={setCaptions} />
      </div>
    </>
  );
}

export default App;
