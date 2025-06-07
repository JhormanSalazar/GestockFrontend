import { useNavigate } from "react-router-dom";
import user from "../data/userSimulateDB";

export const useAuth = () => {
  
  const navigate = useNavigate();
  
  const handleSimulateAuth = (email: string, password: string) => {
    const userFound = user.find(user => user.email === email && user.password === password);

    if(userFound) {
      navigate('/');
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  }

  return {
    handleSimulateAuth
  }
}