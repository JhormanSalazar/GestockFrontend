import { useNavigate } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore";
import { getRandomId } from "../helpers/getRandomId";
import user from "../data/db/userSimulateDB";

export const useAuth = () => {
  // React router
  const navigate = useNavigate();

  // Zustand state - usando selectores individuales
  const setIsLoggedIn = useAppStore(state => state.setIsLoggedIn);
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const setId = useAppStore(state => state.setId);
  const showNotification = useAppStore(state => state.showNotification);
  
  const handleSimulateAuth = (email: string, password: string) => {
    // TODO: mostar notificacion si el usuario no existe
    const userFound = user.find(u => u.email === email && u.password === password);

    // Validar si el usuario es admin o worker
    if (userFound?.role === "admin") {
      // Guardar en localStorage
      localStorage.setItem('authState', JSON.stringify({
        isLoggedIn: true,
        user: userFound,
        role: 'admin',
        id: setId(userFound, getRandomId())
      }));
      navigate("/admin");
      setIsLoggedIn();
    } else if (userFound?.role === "user") {
      // Guardar en localStorage
      localStorage.setItem('authState', JSON.stringify({
        isLoggedIn: true,
        user: userFound,
        role: 'user'
      }));
      navigate("/worker");
      setIsLoggedIn();
      setId(userFound, getRandomId());
    } else {
      showNotification({
        text: "Credenciales inválidas",
        error: true,
      });
    }
  }

  const handleLogoutClick = () => {
    // Limpiar localStorage
    localStorage.removeItem('authState');
    
    // Reset the auth state
    useAppStore.setState({ isLoggedIn: false, user: {
      email: "",
      password: "",
      id: "",
      role: "user"
    }});
    navigate('/');
    showNotification({
      text: "Sesión cerrada correctamente",
      error: false,
    });
  };

  return {
    handleSimulateAuth,
    isLoggedIn,
    handleLogoutClick
  };
}