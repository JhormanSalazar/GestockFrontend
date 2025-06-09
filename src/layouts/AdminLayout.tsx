import { Outlet } from "react-router-dom";
import Notification from "../components/Notification";
import AdminHeader from "../components/routes/AdminHeader";


export default function AdminLayout() {
  return (
    <>
      <AdminHeader />
        <main>
          <Outlet />
        </main> 
      <Notification />
    </>
  )
}
