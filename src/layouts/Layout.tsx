import { Outlet } from "react-router-dom";
import AppHeader from "../components/Header/AppHeader";
import Footer from "../components/Footer/Footer";

export default function Layout() {
  return (
    <>
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
