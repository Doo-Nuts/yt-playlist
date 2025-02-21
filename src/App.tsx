import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { createContext, useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import Favorite from "./pages/Favorite";
import usePlaylist, { Video } from "./hooks/usePlaylist";
import loginVerify from "./api/fetch-auth-verify";
import { toggledFavorite } from "./api/fetch-favorite-videos";

interface FavoriteContextType {
  favorite: { [key: string]: boolean };
  setFavorite: (favorite: { [key: string]: boolean }) => void;
  toggleFavorite: (id: string, title: string) => void;
}

export const VideoStateContext = createContext<Video[]>([]);

export const FavoriteStateContext = createContext<FavoriteContextType>({
  favorite: {},
  setFavorite: () => {},
  toggleFavorite: () => {},
});

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const { videos, loading } = usePlaylist();
  const [favorite, setFavorite] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const asyncRequest = async () => {
      // 로그인 검증
      const fatchData = await loginVerify();
      if (!fatchData.user) {
        localStorage.removeItem("token");
        setUser(null);
      }
      setUser(fatchData.user.userId);
    };
    asyncRequest();
  }, []);

  const toggleFavorite = async (id: string, title: string) => {
    // 로그인 안하면 favorite 버튼만 작동
    if (!user) {
      setFavorite((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      return;
    }

    await toggledFavorite(user, id, title);
    setFavorite((prev) => ({
      ...prev,
      [id]: !prev[id], // 기존 상태 반전
    }));
  };

  return (
    <>
      <VideoStateContext.Provider value={videos}>
        <FavoriteStateContext.Provider
          value={{ favorite, setFavorite, toggleFavorite }}
        >
          {/* 로그인 모달 */}
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSignUp={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true); // 회원가입 모달 열기
            }}
            setUser={setUser}
          />

          {/* 회원가입 모달 */}
          <RegisterModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            onLogin={() => {
              setIsRegisterOpen(false);
              setIsLoginOpen(true); // 로그인 모달 열기
            }}
          />

          <Routes>
            <Route
              path="/"
              element={
                loading ? (
                  <p> 영상을 불러오는 중...</p>
                ) : (
                  <Home
                    openLoginModal={() => setIsLoginOpen(true)}
                    user={user}
                    setUser={setUser}
                  />
                )
              }
            />
            <Route
              path="/favorite"
              element={
                <Favorite
                  openLoginModal={() => setIsLoginOpen(true)}
                  user={user}
                  setUser={setUser}
                />
              }
            />
          </Routes>
        </FavoriteStateContext.Provider>
      </VideoStateContext.Provider>
    </>
  );
}

export default App;
