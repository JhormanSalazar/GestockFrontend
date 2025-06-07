// TODO: Refactorizar con zustand, validar con zod 
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    navigate('/');
  }
  
  const handleSimulateAuth = (user: string, password: string) => {
    if(user === "admin" && password === "123") {
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  }

  return {
    isLoggedIn,
    handleLogoutClick,
    handleSimulateAuth
  }
}