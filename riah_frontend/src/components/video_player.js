import React from "react";

const VideoPlayer = ({ videoId, preview }) => {
  return (
    <div>
      <h2>Reproductor de Video</h2>
      <video width="640" height="360" controls>
        <source src={videoId} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;