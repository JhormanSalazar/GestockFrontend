import { useEffect, useState } from "react";

export const useBodyScroll = () => {
  const [showLogin, setShowLogin] = useState(false);

  // Bloquear scroll del modal de login
  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showLogin]);

  return {
    showLogin,
    setShowLogin,
  }
}