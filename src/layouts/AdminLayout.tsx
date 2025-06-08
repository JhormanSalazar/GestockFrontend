import { Outlet } from "react-router-dom";
import AppHeader from "../components/Header/AppHeader";
import Footer from "../components/Footer/Footer";
import Notification from "../components/Notification";


export default function AdminLayout() {
  return (
    <>
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Notification />
    </>
  )
}
