import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { favoriteVideos } from "../api/fetch-favorite-videos";
import videosMapping from "../util/videosMapping";
import { useContext } from "react";
import { FavoriteStateContext } from "../App";

interface HeaderProps {
  user: string | null;
  setUser: (user: string | null) => void;
  openLoginModal: () => void;
}

const Header = ({ user, setUser, openLoginModal }: HeaderProps) => {
  const nav = useNavigate();
  const location = useLocation(); // ✅ 현재 경로 확인
  const isFavoritePage = location.pathname === "/favorite"; // Favorite 페이지 여부 확인
  const { setFavorite } = useContext(FavoriteStateContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    alert("로그아웃 되었습니다.");
  };

  const onClickFavoritePage = async (user: string | null) => {
    const videos = await favoriteVideos(user);
    const videosMap = videosMapping(videos);
    setFavorite(videosMap);
    nav("/favorite");
  };

  return (
    <>
      <header>
        <h1 className="header_title" onClick={() => nav("/")}>
          ▶️ My Playlist
        </h1>

        <div
          className={`header_favorite ${isFavoritePage ? "centered" : ""}`}
          onClick={() => onClickFavoritePage(user)}
        >
          ⭐ Favorite List
        </div>

        {user ? (
          <h3 className="header_login" onClick={handleLogout}>
            My Information (Logout)
          </h3>
        ) : (
          <h3 className="header_login" onClick={openLoginModal}>
            Sign In
          </h3>
        )}
      </header>
    </>
  );
};

export default Header;
