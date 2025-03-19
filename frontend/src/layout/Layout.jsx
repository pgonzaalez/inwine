// Layout.jsx
import Sidebar from '@components/SidebarComponent';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Outlet /> {/* Aquí se renderiza el contenido de las páginas */}
    </div>
  </div>
);

export default Layout;
