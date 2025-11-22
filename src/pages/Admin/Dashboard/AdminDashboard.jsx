import { useEffect, useState } from 'react';
import { Users, Heart, Calendar, DollarSign, Ticket, CheckCircle } from 'lucide-react';
import StatCard from '@components/admin/StatCard';
import Loading from '@components/common/Loading/Loading';
import adminService from '@services/adminService';
import Swal from 'sweetalert2';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard - Care Service';
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load dashboard statistics',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-chilled-gray-400">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-500">Dashboard</h1>
        <p className="text-chilled-gray-400 mt-1">
          Overview of your care service platform
        </p>
      </div>

      {/* User Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-500 mb-4">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon="Users"
            color="blue"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers || 0}
            icon="UserCheck"
            color="green"
          />
          <StatCard
            title="Total Caregivers"
            value={stats.totalCaregivers || 0}
            icon="Heart"
            color="pink"
          />
          <StatCard
            title="Pending Caregivers"
            value={stats.pendingCaregivers || 0}
            icon="Clock"
            color="orange"
          />
        </div>
        {/* Biểu đồ cột User Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Tổng Users', value: stats.totalUsers || 0 },
                { name: 'Customers', value: stats.totalCustomers || 0 },
                { name: 'Caregivers', value: stats.totalCaregivers || 0 },
                { name: 'Pending', value: stats.pendingCaregivers || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-500 mb-4">
          Booking Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings || 0}
            icon="Calendar"
            color="purple"
          />
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings || 0}
            icon="Clock"
            color="orange"
          />
          <StatCard
            title="Completed Bookings"
            value={stats.completedBookings || 0}
            icon="CheckCircle"
            color="green"
          />
          <StatCard
            title="Cancelled Bookings"
            value={stats.cancelledBookings || 0}
            icon="XCircle"
            color="red"
          />
        </div>
        {/* Biểu đồ tròn Booking Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Completed', value: stats.completedBookings || 0 },
                  { name: 'Pending', value: stats.pendingBookings || 0 },
                  { name: 'Cancelled', value: stats.cancelledBookings || 0 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#22c55e" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-500 mb-4">
          Financial Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <StatCard
            title="Total Payments"
            value={stats.totalPayments || 0}
            icon="CreditCard"
            color="cyan"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue?.toLocaleString() || 0}`}
            icon="DollarSign"
            color="green"
          />
        </div>
        {/* Biểu đồ cột Financial Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Total Payments', value: stats.totalPayments || 0 },
                { name: 'Total Revenue', value: stats.totalRevenue || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Support Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-500 mb-4">
          Support Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <StatCard
            title="Open Tickets"
            value={stats.openTickets || 0}
            icon="Ticket"
            color="orange"
          />
          <StatCard
            title="Unresolved Tickets"
            value={stats.unresolvedTickets || 0}
            icon="AlertCircle"
            color="red"
          />
        </div>
        {/* Biểu đồ cột Support Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Open Tickets', value: stats.openTickets || 0 },
                { name: 'Unresolved Tickets', value: stats.unresolvedTickets || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Caregiver Approval Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-500 mb-4">
          Caregiver Approvals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <StatCard
            title="Approved Caregivers"
            value={stats.approvedCaregivers || 0}
            icon="CheckCircle"
            color="green"
          />
          <StatCard
            title="Pending Approval"
            value={stats.pendingCaregivers || 0}
            icon="Clock"
            color="orange"
          />
        </div>
        {/* Biểu đồ cột Caregiver Approvals */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Approved', value: stats.approvedCaregivers || 0 },
                { name: 'Pending', value: stats.pendingCaregivers || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
