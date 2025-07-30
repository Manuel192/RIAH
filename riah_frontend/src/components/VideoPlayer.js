import React from "react";

const VideoPlayer = ({ videoId, preview }) => {
  return (
    <div>
      <video width="640" height="360" controls>
        <source src={videoId} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;