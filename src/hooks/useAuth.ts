// TODO: Refactorizar con zustand, validar con zod 
import { useState } from "react"
import { useBodyScroll } from "./useBodyScroll";

export const useAuth = () => {

  const {showLogin, setShowLogin} = useBodyScroll() // custom hook 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Login section
  const handleLoginClick = () => {
    setShowLogin(true)
  }

  const handleLogoutClick = () => {
    setShowLogin(false)
    setIsLoggedIn(false)
  }
  
  const handleSimulateAuth = (user: string, password: string) => {
    if(user === "admin" && password === "123") {
      setIsLoggedIn(true)
      setShowLogin(false)
    } else {
        alert("Usuario o contraseña incorrectos")  
      }
  }

  return {
    isLoggedIn,
    showLogin, 
    setShowLogin,
    handleLoginClick,
    handleLogoutClick,
    handleSimulateAuth
  }
}