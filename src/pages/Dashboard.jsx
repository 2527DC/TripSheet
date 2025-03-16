import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/auth';

const Dashboard = () => {
  const { user } = useAuth();



  const stats = [
    {
      title: 'Total Vehicles',
      value: '156',
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDOR]
    },
    {
      title: 'Active Bookings',
      value: '42',
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
    },
    {
      title: 'Total Clients',
      value: '89',
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
    },
    {
      title: 'Total Revenue',
      value: '$45,289',
      roles: [ROLES.SUPER_ADMIN]
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
  <h1> thie will  be the Dashboard overview </h1>
    </div>
  );
};

export default Dashboard;
