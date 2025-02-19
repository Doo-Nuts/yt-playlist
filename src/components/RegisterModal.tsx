import React, { useRef, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./RegisterModal.css"; // 스타일 추가

const API_URL = "http://localhost:5000"; // 백엔드 주소

Modal.setAppElement("#root");

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void; // 📌 로그인 모달 열기 위한 함수
}

export default function RegisterModal({ isOpen, onClose, onLogin }: RegisterModalProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userIdRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const submitRef = useRef<HTMLButtonElement>(null!);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLInputElement | HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault(); // 기본 `Tab` 기능 방지
      nextRef.current?.focus(); // 다음 입력창으로 포커스 이동
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null) // 에러 메세지 초기화

    // 빈값 방지
    if (!userId.trim() || !password.trim()) {
      setErrorMessage("ID와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { userId, password });
      alert("회원가입 되었습니다! 로그인 해주세요.");

      // 입력 필드 초기화
      setUserId("");
      setPassword("")
      // 로그인 모달로 이동
      onLogin();
      console.log(res.data.userId)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("❌ 회원가입 실패:", err.response?.data || err.message);
        setErrorMessage(err.response?.data?.error || "회원가입에 실패했습니다.");
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
      className="register-modal" 
      overlayClassName="overlay"
    >
      <button className="close-btn" onClick={onClose}>✖</button>
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="ID"
          autoFocus
          value={userId} 
          onChange={(e) => setUserId(e.target.value)}
          ref={userIdRef}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          ref={passwordRef}
          onKeyDown={(e) => handleKeyDown(e, submitRef)}
        />  
        <div className="button-group">
          <button 
            className="register-btn" 
            type="submit" 
            ref={submitRef}
          >
            Register
          </button>
          <button 
            className="login-back-btn" 
            type="button" 
            onClick={onLogin}
          >
            Back to Login
          </button>
        </div>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}    
    </Modal>
  );
}