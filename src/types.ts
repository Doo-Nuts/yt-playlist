export interface HeaderProps {
  openLoginModal: () => void;
  user: string | null;
  setUser: (user: string | null) => void;
}