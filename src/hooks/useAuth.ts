import { useNavigate } from "react-router-dom";
import user from "../data/userSimulateDB";
import { useAppStore } from "../stores/useAppStore";
import { getRandomId } from "../helpers/getRandomId";

export const useAuth = () => {

  // Zustand state
  const setIsLoggedIn = useAppStore(state => state.setIsLoggedIn)
  const setId = useAppStore(state => state.setId)
  
  // React router
  const navigate = useNavigate();
  
  const handleSimulateAuth = (email: string, password: string) => {
    
    // TODO: redirect to the correct page
    const userFound = user.find(user => user.email === email && user.password === password);

    if(userFound) {
      navigate('/');
      setIsLoggedIn();
      setId(userFound, getRandomId());
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  }

  return {
    handleSimulateAuth
  }
}