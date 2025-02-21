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

// T썸네일 선택(화질 제일 좋은거 우선)
const getBestThumbnail = (thumbnails?: YouTubeVideoItem["snippet"]["thumbnails"]) => {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    "https://via.placeholder.com/480x270?text=No+Thumbnail" // 없을 경우 대체 이미지
  );
};

export default async function fetchVideos(): Promise<Video[]> {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=KR&key=${API_KEY}&maxResults=${videoCnt}`;

  try {
    const response = await fetch(url);

    // HTTP 요청 실패 처리
    if (!response.ok) throw new Error("Failed to fetch trending videos");

    const { items = [] }: YouTubeAPIResponse = await response.json();

    // 데이터가 비어있다면 경고 로그 출력
    if (items.length === 0) console.warn("No trending videos found");

    const videos = 
      items.filter((item) => item.id) // videoId가 없는 영상 제외
        .map((item) => ({
          id: item.id,
          title: item.snippet.title,
          videoId: item.id,
          thumbnail: getBestThumbnail(item.snippet.thumbnails),
    }));

    return videos
  } catch (error) {
    console.error("🚨 영상 불러오기 실패:", error);
    return [];
  }
}