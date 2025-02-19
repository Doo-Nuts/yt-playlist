import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { createContext, useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import Favorite from "./pages/Favorite";
import usePlaylist, { Video } from "./hooks/usePlaylist";

interface FavoriteContextType {
  favorite: { [key: string]: boolean };
  toggleFavorite: (id: string, title: string) => void;
}

export const VideoStateContext = createContext<Video[]>([]);
export const FavoriteStateContext = createContext<FavoriteContextType>({
  favorite: {},
  toggleFavorite: () => {},
});

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const videos: Video[] = usePlaylist();
  const [favorite, setFavorite] = useState<{ [key: string]: boolean }>({});

  // 로그인 유지 기능 (토큰 확인)
  useEffect(() => {
    const token = localStorage.getItem("token");   //33333
    if (token) {
      fetch("http://localhost:5000/api/auth/verify", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user.userId);

            // 사용자 favorite 목록 불러오기
            fetch(`http://localhost:5000/api/favorites/${data.user.userId}`)
              .then((res) => res.json())
              .then((favorites) => {
                const favoriteMap = favorites.reduce(
                  (
                    acc: { [key: string]: boolean },
                    item: { videoId: string }
                  ) => {
                    acc[item.videoId] = true;
                    return acc;
                  },
                  {}
                );
                setFavorite(favoriteMap);
              });
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  // favorite list 추가 기능
  const toggleFavorite = (id: string, title: string) => {
    // 로그인 안하면 favorite 버튼만 작동
    if (!user) {
      setFavorite((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      return;
    }

    fetch("http://localhost:5000/api/favorites/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user, videoId: id, title }),
    })
      .then((res) => res.json())
      .then(() => {
        fetch(`http://localhost:5000/api/favorites/${user}`)
          .then((res) => res.json())
          .then((favorites) => {
            const favoriteMap = favorites.reduce(
              (acc: { [key: string]: boolean }, item: { videoId: string }) => {
                acc[item.videoId] = true;
                return acc;
              },
              {}
            );
            setFavorite(favoriteMap);
          });
      });
  };

  return (
    <>
      <VideoStateContext.Provider value={videos}>
        <FavoriteStateContext.Provider value={{ favorite, toggleFavorite }}>
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
                <Home
                  openLoginModal={() => setIsLoginOpen(true)}
                  user={user}
                  setUser={setUser}
                />
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
