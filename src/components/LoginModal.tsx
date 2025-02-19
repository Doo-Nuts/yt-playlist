import React, { useRef, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./LoginModal.css"; // 스타일 추가

const API_URL = "http://localhost:5000"; // 백엔드 주소

// 모달의 접근성을 위해 App 루트를 설정
Modal.setAppElement("#root");

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  setUser: (user: string | null) => void;

}

interface LoginResponse {
  token: string;
}

export default function LoginModal({ isOpen, onClose, onSignUp, setUser }: LoginModalProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const userIdRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const submitRef = useRef<HTMLButtonElement>(null!);

  const tabKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLInputElement | HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault(); // 기본 `Tab` 기능 방지
      nextRef.current?.focus(); // 다음 입력창으로 포커스 이동
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 빈 값 방지
    if (!userId.trim() || !password.trim()) {
      setErrorMessage("ID와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post<LoginResponse>(`${API_URL}/api/auth/login`, { userId, password });
      console.log("✅ 서버 응답:", res.data);
      
      localStorage.setItem("token", res.data.token); 
      setUser(userId);
      onClose();
      setUserId("");
      setPassword("");
    } catch (err: unknown) {
      if(axios.isAxiosError(err))
        if (axios.isAxiosError(err)) {
          console.error("❌ 로그인 실패:", err.response?.data || err.message);
          setErrorMessage(err.response?.data?.error || "로그인에 실패했습니다."); // ✅ 에러 메시지 저장
        } else {
          console.error("❌ 예상치 못한 오류 발생:", err);
          setErrorMessage("예상치 못한 오류가 발생했습니다.");
        }
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="login-modal" 
      overlayClassName="overlay"
    >
      <button className="close-btn" onClick={onClose}>✖</button>
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="ID" 
          autoFocus
          value={userId} 
          onChange={(e) => setUserId(e.target.value)}
          ref={userIdRef}
          onKeyDown={(e) => tabKeyDown(e, passwordRef)}
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordRef}
          onKeyDown={(e) => tabKeyDown(e, submitRef)} 
        />        
        <div className="button-group">
          <button 
            className="submit-btn" 
            type="submit"
            ref={submitRef}
          >
            Submit
          </button>
          <button 
            onClick={onSignUp}
            className="register-btn" 
            type="button"
          >
            Sign Up
          </button>
        </div>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </Modal>
  );
}