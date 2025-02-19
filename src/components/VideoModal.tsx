import React, { useState } from "react";
import Modal from "react-modal";
import VideoPlayer from "./VideoPlayer";
import "./VideoModal.css"

Modal.setAppElement("#root");

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  videoUrl: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, videoTitle}) => {
  const [liked, setLiked] = useState(false);

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="modal" 
      overlayClassName="overlay"
      shouldCloseOnOverlayClick={false}
    >
      <button className="close-btn" onClick={onClose}>✖</button>
      <h2 className="modal-title">{videoTitle}</h2>
      <button 
        className={`like-btn ${liked ? "liked" : ""}`} 
        onClick={()=>setLiked(!liked)}
      >
        ❤️ {liked ? "Liked" : "Like"}
      </button>
      <VideoPlayer url={videoUrl} />
    </Modal>
  );
};

export default VideoModal;