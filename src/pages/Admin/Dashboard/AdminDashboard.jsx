import { useEffect, useState } from 'react';
import { Users, Heart, Calendar, DollarSign, Ticket, CheckCircle } from 'lucide-react';
import StatCard from '@components/admin/StatCard';
import Loading from '@components/common/Loading/Loading';
import adminService from '@services/adminService';
import Swal from 'sweetalert2';

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
        <p className="text-chilled-gray-600">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900">Dashboard</h1>
        <p className="text-chilled-gray-600 mt-1">
          Overview of your care service platform
        </p>
      </div>

      {/* User Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-900 mb-4">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Booking Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-900 mb-4">
          Booking Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Financial Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-900 mb-4">
          Financial Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Support Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-900 mb-4">
          Support Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Caregiver Approval Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-charcoal-900 mb-4">
          Caregiver Approvals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
