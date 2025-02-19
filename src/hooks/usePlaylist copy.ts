import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const PLAYLIST_ID = import.meta.env.VITE_PLAYLIST_ID;
const videoCnt = 20

export interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
}

interface YouTubePlaylistItem {
  id: string;
  snippet: {
    title: string;
    resourceId?: { videoId: string };
    thumbnails?: {
      medium?: { url: string };
    };
  };
}

interface YouTubeAPIResponse {
  items: YouTubePlaylistItem[];
}

const usePlaylist = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchPlaylistVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=${videoCnt}`
        );
        const data: YouTubeAPIResponse = await response.json();

        console.log("API Response:", data); // 응답 데이터 확인

        if (!data.items || data.items.length === 0) {
          console.error("Error: No items in response", data);
          return;
        }

        const videoList: Video[] = data.items.map((item: YouTubePlaylistItem) => ({
          id: item.id,
          title: item.snippet.title,
          videoId: item.snippet.resourceId?.videoId ?? "",
          thumbnail: item.snippet.thumbnails?.medium?.url ?? "",
        }));

        console.log("Parsed Videos:", videoList);

        setVideos(videoList);
      } catch (error) {
        console.error("영상 불러오기 실패", error);
      }
    };
    fetchPlaylistVideos();
  }, []);

  return videos;
};

export default usePlaylist;