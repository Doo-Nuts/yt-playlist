import {  useEffect, useState} from "react";
import Header from "../components/Header";
import VideoList from "../components/VideoList";
import { HeaderProps} from "../types";
import "./Favorite.css";
import { useNavigate } from "react-router-dom";

export default function Favorite({openLoginModal, user, setUser}: HeaderProps){
  const [favoriteVideos, setFavoriteVideos] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/favorites/${user}`)
        .then((res) => res.json())
        .then((data) => {
          setFavoriteVideos(data)
        })
    } else {
      alert("로그인이 필요합니다.");
      nav('/')
    }
  }, [user, nav])
  
  return (
    <div className="Favorite">
      <Header openLoginModal={openLoginModal} user={user} setUser={setUser} />
      <VideoList videos={favoriteVideos} />
    </div>
  )
}