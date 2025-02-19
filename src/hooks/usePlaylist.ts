import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const videoCnt = 20;

export interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
}

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    channelTitle?: string;
    thumbnails?: {
      maxres?: { url: string };
      standard?: { url: string };
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface YouTubeAPIResponse {
  items: YouTubeVideoItem[];
}

const usePlaylist = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=KR&key=${API_KEY}&maxResults=${videoCnt}`
        );
        const data: YouTubeAPIResponse = await response.json();

        console.log("API Response:", data); // 🔍 API 응답 확인

        if (!data.items || data.items.length === 0) {
          console.error("Error: No trending videos found", data);
          return;
        }

        const videoList: Video[] = data.items
          .filter((item) => item.id) // videoId가 없는 영상 제외
          .map((item: YouTubeVideoItem) => ({
            id: item.id,
            title: item.snippet.title,
            videoId: item.id,
            thumbnail:
              item.snippet.thumbnails?.maxres?.url ||  // ✅ 최대 해상도 우선
              item.snippet.thumbnails?.standard?.url ||
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.default?.url ||
              "https://via.placeholder.com/480x270?text=No+Thumbnail", // ❗ 없을 경우 대체 이미지
          }));

        console.log("Parsed Videos:", videoList); // 🔍 최종 가공된 데이터 확인

        setVideos(videoList);
      } catch (error) {
        console.error("영상 불러오기 실패", error);
      }
    };
    fetchTrendingVideos();
  }, []);

  return videos;
};

export default usePlaylist;