import { useNavigate } from "react-router-dom";
import user from "../data/userSimulateDB";
import { useAppStore } from "../stores/useAppStore";
import { getRandomId } from "../helpers/getRandomId";

export const useAuth = () => {
  // React router
  const navigate = useNavigate();

  // Zustand state - usando selectores individuales
  const setIsLoggedIn = useAppStore(state => state.setIsLoggedIn);
  const setId = useAppStore(state => state.setId);
  // const showNotification = useAppStore(state => state.showNotification)
  
  const handleSimulateAuth = (email: string, password: string) => {
    const userFound = user.find(u => u.email === email && u.password === password);

    if(userFound) {
      navigate('/');
      setIsLoggedIn();
      setId(userFound, getRandomId());
      // showNotification({
      //   text: "Usuario logueado correctamente",
      //   error: false
      // })
    } else {
        // showNotification({
        //   text: "Credenciales inválidas",
        //   error: true,
        // });
    } 
  }

  return {
    handleSimulateAuth
  };
}