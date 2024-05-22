import React, { useState } from "react";
import "../styles/CaptionInput.css";

// CaptionInput component to handle caption input and parsing
const CaptionInput = ({ onAddCaptions }) => {
  const [captionsText, setCaptionsText] = useState(""); // State to hold the captions input text
  const [error, setError] = useState(""); // State to hold any error messages

  // Function to handle adding captions
  const handleAddCaptions = () => {
    try {
      const captions = parseCaptions(captionsText); // Parse the captions input text
      console.log("Parsed Captions:", captions); // Log parsed captions
      onAddCaptions(captions); // Call the onAddCaptions prop with the parsed captions
      setCaptionsText(""); // Clear the input text
      setError(""); // Clear any error messages
    } catch (e) {
      setError(e.message); // Set the error message
      console.error("Error parsing captions:", e.message); // Log error
    }
  };

  // Function to parse the captions input text
  const parseCaptions = (text) => {
    const lines = text.split("\n"); // Split the input text into lines
    return lines.map((line) => {
      const [time, ...textParts] = line.split(" "); // Split each line into time and text parts
      const timeInSeconds = parseTime(time); // Parse the time part into seconds
      if (isNaN(timeInSeconds)) {
        throw new Error("Invalid timestamp format"); // Throw an error if the time format is invalid
      }
      return {
        time: timeInSeconds, // Set the time in seconds
        text: textParts.join(" "), // Join the text parts back into a single string
      };
    });
  };

  // Function to parse a time string in the format HH:MM:SS into seconds
  const parseTime = (timeString) => {
    const parts = timeString.split(":").map(Number); // Split the time string into parts and convert to numbers
    if (parts.length !== 3) {
      throw new Error("Timestamp must be in the format HH:MM:SS"); // Throw an error if the time format is invalid
    }
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // Convert the time parts into seconds
  };

  return (
    <div className="caption-input-container">
      <textarea
        value={captionsText} // Bind the textarea value to the state
        onChange={(e) => setCaptionsText(e.target.value)} // Update the state when the textarea value changes
        rows="10"
        cols="50"
        placeholder="Enter captions (one per line with timestamp, e.g., 00:01:00 Caption text)"
      />
      <button onClick={handleAddCaptions}>Add Captions</button>{" "}
      {/* Button to trigger adding captions */}
      {error && <div className="error">{error}</div>}{" "}
      {/* Display error message if there is an error */}
    </div>
  );
};

export default CaptionInput;
