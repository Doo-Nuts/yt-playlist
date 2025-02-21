import { useEffect, useState } from "react";
import fetchVideos from "../api/fetch-yt-videos";

export interface Video {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
}

const usePlaylist = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      const videoList = await fetchVideos();
      setVideos(videoList);
      setLoading(false);
    };

    loadVideos();
  }, []);

  return { videos, loading };
};

export default usePlaylist;
