// import { useNavigate } from "react-router-dom";
// import { LoginModalProps } from "../types";
// import "./Header.css"

// const Header = ({ openLoginModal }: LoginModalProps) => {
//   const nav = useNavigate();

//   const isFavoritePage = location.pathname === "/favorite";

//   return (
//     <>
//       <header>
//         <div className={`header_left ${isFavoritePage ? "centered" : ""}`}>
//           <h1 
//             className="header_title"
//             onClick={()=>nav("/")}
//           >▶️ My Playlist
//             </h1>
//           <h3 
//             className="header_favorite"
//             onClick={()=>nav("/favorite")}
//           >⭐Favorite List
//           </h3>
//         </div>
//         <h3 onClick={openLoginModal} className="header_login">Sign In</h3>
//       </header>
//     </>
//   )
// }

// export default Header;

import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  user: string | null;
  setUser: (user: string | null) => void;
  openLoginModal : () => void;
}

const Header = ({ user, setUser, openLoginModal } : HeaderProps) => {
  const nav = useNavigate();
  const location = useLocation(); // ✅ 현재 경로 확인
  const isFavoritePage = location.pathname === "/favorite"; // Favorite 페이지 여부 확인

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    alert("로그아웃 되었습니다.")
  }

  return (
    <>
      <header>
        <h1 className="header_title" onClick={() => nav("/")}>
          ▶️ My Playlist
        </h1>

        <div className={`header_favorite ${isFavoritePage ? "centered" : ""}`} onClick={() => nav("/favorite")}>
          ⭐ Favorite List
        </div>

        {user ? (
        <h3 className="header_login" onClick={handleLogout}>My Information (Logout)</h3>
      ) : (
        <h3 className="header_login" onClick={openLoginModal}>Sign In</h3>
      )}
      </header>
    </>
  );
};

export default Header;