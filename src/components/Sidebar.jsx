import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/auth';
import { ROLES } from '../utils/auth';
import { 
  Users, Truck, Calendar, Building2, 
 LogOut, 
  ChevronDown, 
  Pin, PinOff,

  PersonStanding,
  CassetteTape
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, setIsOpen, isPinned, setIsPinned }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsPinned(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsPinned]);

  if (!user) return null;

  const toggleDropdown = (menuName) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleMouseEnter = () => {
    if (!isMobile && !isPinned) {
      setIsOpen(true);
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isPinned) {
      setIsOpen(false);
      setIsHovered(false);
      setOpenDropdown({});
    }
  };

  const togglePin = () => {
    if (!isMobile) {
      setIsPinned(!isPinned);
      setIsOpen(!isPinned);
    }
  };

 

  const menuItems = [
    // {
    //   path: '/dashboard',
    //   name: 'Dashboard',
    //   icon: LayoutDashboard,
    //   roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ]
    // },
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

  const sidebarWidth = isOpen ? 'w-64' : 'w-16';
  const sidebarClass = `h-screen ${sidebarWidth} bg-gray-800 text-white flex flex-col fixed left-0 transition-all duration-300 ease-in-out z-50`;
  
  return (
    <aside 
      className={`${sidebarClass} ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isOpen && (
          <>
            <h2 className="text-xl font-bold">Trip Management</h2>
            {!isMobile && (
              <button onClick={togglePin} className="text-gray-400 hover:text-white">
                {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
              </button>
            )}
          </>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2 space-y-2">
        {menuItems.map((item) => (
          hasPermission(user.role, item.roles) && (
            <div key={item.path || item.name} className="relative">
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      openDropdown[item.name] ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 min-w-[1.25rem]" />
                    {isOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.name}</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-200 ${
                            openDropdown[item.name] ? 'rotate-180' : ''
                          }`}
                        />
                      </>
                    )}
                  </button>
                  
                  {isOpen && openDropdown[item.name] && (
                    <div className="mt-1 space-y-1 px-2">
                      {item.subItems.map((subItem) =>
                        hasPermission(user.role, subItem.roles) && (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                              location.pathname === subItem.path
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4" />
                            <span className="ml-2">{subItem.name}</span>
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 min-w-[1.25rem]" />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              )}
            </div>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center justify-center w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={16} />
          {isOpen && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

// Export without memoization to keep menu items dynamic
export default Sidebar;