import Header from "@/components/HeaderComponent";
import { Outlet } from "react-router-dom";

export default function HeaderLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}