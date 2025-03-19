import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/auth';
import { ROLES } from '../utils/auth';
import { 
  Users, Truck, Calendar, Building2, 
  LayoutDashboard, LogOut, 
  PersonStanding,
  CassetteTape
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth() || { user: {}, logout: () => {} };
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  console.log("User Data:", user); // Debugging user data

  const toggleSidebar = () => setIsOpen(!isOpen);
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ]
    },
    {
      path: '/manage-admins',
      name: 'Admins',
      icon: PersonStanding,
      roles: [ROLES.SUPER_ADMIN]
    },
    {
      path: '/manage-category',
      name: 'Category',
      icon: CassetteTape,
      roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,]
    },
    {
      path: '/clients',
      name: 'Company',
      icon: Users,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
    },
    {
      path: '/driver',
      name: 'Driver',
      icon: Truck,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN,]
    },
    {
      path: '/tripsheet-list',
      name: 'TripSheet',
      icon: Calendar,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
    },
    {
      path: '/vendors',
      name: 'Vendors',
      icon: Building2,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
    }
  ];

  return (
    <div className="h-screen w-64 bg-gray-300 text-black p-4 fixed left-0">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Trip Sheet Management</h2>
        <p className="text-black-400 text-sm">Welcome, {user?.name || "Guest"}</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          hasPermission(user?.role, item.roles) && (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-gray-400 text-black'
                  : 'hover:bg-gray-400'}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        ))}
      </nav>

      <button
        onClick={logout}
        className="absolute bottom-4 left-4 right-4 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
