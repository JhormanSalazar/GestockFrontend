import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  
  const navigate = useNavigate();
  
  const handleSimulateAuth = (user: string, password: string) => {
    if(user === "admin" && password === "123") {
      navigate('/');
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  }

  return {
    handleSimulateAuth
  }
}