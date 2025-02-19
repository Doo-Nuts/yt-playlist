import { useContext } from "react";
import Header from "../components/Header";
import VideoList from "../components/VideoList";
import "./Home.css";
import { VideoStateContext } from "../App";
import { Video } from "../hooks/usePlaylist";
import { HeaderProps } from "../types";

export default function Home({ openLoginModal, user, setUser }: HeaderProps) {
  const videos: Video[] = useContext(VideoStateContext);

  return (
    <div className="Home">
      <Header user={user} setUser={setUser} openLoginModal={openLoginModal} />
      <VideoList videos={videos} />
    </div>
  );
}
