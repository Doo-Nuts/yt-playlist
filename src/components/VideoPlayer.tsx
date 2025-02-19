import React from "react";
import ReactPlayer from "react-player";
import "./VideoPlayer.css"


interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {

  return (
    <div className="video_container">
      <div className="video_wrapper">
        <ReactPlayer url={url} width="100%" height="100%" controls />
      </div>
    </div>
  );
};

export default VideoPlayer;