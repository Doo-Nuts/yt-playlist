import React, { useContext, useState } from "react";
import VideoModal from "./VideoModal";
import "./VideoList.css";
import { FavoriteStateContext } from "../App";

interface Video {
  id: string;
  title: string;
  videoId: string;
}

interface VideoListProps {
  videos: Video[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<{
    videoUrl: string;
    videoTitle: string;
    videoId: string;
  } | null>(null);

  const { favorite, toggleFavorite } = useContext(FavoriteStateContext);
  

  return (
    <div className="video_section">
      {videos.map((video) => (
        <div key={video.id} className="video_list">
          <div
            className="video_content"
            onClick={() =>
              setSelectedVideo({
                videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
                videoTitle: video.title,
                videoId: video.videoId,
              })
            }
          >
            {/* ✅ Favorite(⭐) 버튼 추가 */}
            <div
              className={`favorite-btn ${
                favorite[video.id] ? "favorited" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation(); // 부모 요소 클릭 방지
                toggleFavorite(video.id, video.title);
              }}
            >
              {favorite[video.id] ? "⭐ Favorite" : "☆ Favorite"}
            </div>
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
              alt="YouTube Thumbnail"
              className="thumbnail"
            />
            <p className="video_title">{video.title}</p>
          </div>
        </div>
      ))}

      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.videoUrl}
          videoTitle={selectedVideo.videoTitle}
        />
      )}
    </div>
  );
};

export default VideoList;
