import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import Swal from 'sweetalert2';
import StatCard from '@components/admin/StatCard';
import Loading from '@components/common/Loading';
import supportService from '@services/supportService';
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

const SupportDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    unassignedTickets: 0,
    myAssignedTickets: 0,
    resolvedToday: 0,
    avgResolutionTime: '0h',
    ticketsByCategory: {},
    ticketsByPriority: {},
    ticketsByStatus: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all tickets data
      const [allTicketsRes, unassignedRes, assignedRes] = await Promise.all([
        supportService.getTickets(),
        supportService.getUnassignedTickets(),
        supportService.getAssignedTickets()
      ]);

      const allTickets = allTicketsRes.data || [];
      const unassignedTickets = unassignedRes.data || [];
      const assignedTickets = assignedRes.data || [];

      // Calculate resolved today
      const today = new Date().toDateString();
      const resolvedToday = allTickets.filter(ticket => {
        if (ticket.status === 'RESOLVED' && ticket.resolvedAt) {
          const resolvedDate = new Date(ticket.resolvedAt).toDateString();
          return resolvedDate === today;
        }
        return false;
      }).length;

      // Calculate average resolution time
      const resolvedTickets = allTickets.filter(t => t.resolvedAt && t.createdAt);
      let avgResolutionTime = '0h';
      if (resolvedTickets.length > 0) {
        const totalTime = resolvedTickets.reduce((sum, ticket) => {
          const created = new Date(ticket.createdAt);
          const resolved = new Date(ticket.resolvedAt);
          return sum + (resolved - created);
        }, 0);
        const avgMs = totalTime / resolvedTickets.length;
        const avgHours = Math.round(avgMs / (1000 * 60 * 60));
        avgResolutionTime = `${avgHours}h`;
      }

      // Calculate tickets by category
      const ticketsByCategory = allTickets.reduce((acc, ticket) => {
        acc[ticket.category] = (acc[ticket.category] || 0) + 1;
        return acc;
      }, {});

      // Calculate tickets by priority
      const ticketsByPriority = allTickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
      }, {});

      // Calculate tickets by status
      const ticketsByStatus = allTickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalTickets: allTickets.length,
        unassignedTickets: unassignedTickets.length,
        myAssignedTickets: assignedTickets.length,
        resolvedToday,
        avgResolutionTime,
        ticketsByCategory,
        ticketsByPriority,
        ticketsByStatus
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUnassigned = () => {
    navigate('/support/unassigned');
  };

  const handleViewMyTickets = () => {
    navigate('/support/my-tickets');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-500">Support Dashboard</h1>
        <p className="text-sm sm:text-base text-chilled-gray-400 mt-2">
          Overview of support tickets and performance metrics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets}
          icon="Ticket"
          color="blue"
        />
        <StatCard
          title="Unassigned Tickets"
          value={stats.unassignedTickets}
          icon="AlertCircle"
          color="orange"
        />
        <StatCard
          title="My Assigned Tickets"
          value={stats.myAssignedTickets}
          icon="Users"
          color="cyan"
        />
        <StatCard
          title="Resolved Today"
          value={stats.resolvedToday}
          icon="CheckCircle"
          color="green"
        />
      </div>

      {/* Performance Metrics Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-charcoal-500" size={20} />
          <h2 className="text-xl font-semibold text-charcoal-500">
            Performance Metrics
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              {
                name: 'Avg Resolution Time',
                value: parseInt(stats.avgResolutionTime) || 0,
                label: stats.avgResolutionTime
              },
              {
                name: 'Resolution Rate',
                value: stats.totalTickets > 0 
                  ? Math.round(((stats.ticketsByStatus.RESOLVED || 0) / stats.totalTickets) * 100)
                  : 0,
                label: `${stats.totalTickets > 0 
                  ? Math.round(((stats.ticketsByStatus.RESOLVED || 0) / stats.totalTickets) * 100)
                  : 0}%`
              },
              {
                name: 'Resolved Today',
                value: stats.resolvedToday
              }
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name, props) => {
                if (props.payload.label) return props.payload.label;
                return value;
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-charcoal-500 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleViewUnassigned}
            className="flex items-center justify-between p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="text-orange-600" size={24} />
              <div className="text-left">
                <p className="font-semibold text-charcoal-500">Unassigned Tickets</p>
                <p className="text-sm text-chilled-gray-400">
                  {stats.unassignedTickets} tickets need attention
                </p>
              </div>
            </div>
            <span className="text-orange-600 font-bold text-xl">
              {stats.unassignedTickets}
            </span>
          </button>

          <button
            onClick={handleViewMyTickets}
            className="flex items-center justify-between p-4 border-2 border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="text-cyan-600" size={24} />
              <div className="text-left">
                <p className="font-semibold text-charcoal-500">My Tickets</p>
                <p className="text-sm text-chilled-gray-400">
                  View your assigned tickets
                </p>
              </div>
            </div>
            <span className="text-cyan-600 font-bold text-xl">
              {stats.myAssignedTickets}
            </span>
          </button>
        </div>
      </div>

      {/* Ticket Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category - Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-charcoal-500" size={20} />
            <h2 className="text-xl font-semibold text-charcoal-500">
              Tickets by Category
            </h2>
          </div>
          {Object.entries(stats.ticketsByCategory).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(stats.ticketsByCategory).map(([category, count]) => ({
                    name: category.toLowerCase().replace('_', ' '),
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(stats.ticketsByCategory).map((entry, index) => {
                    const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-chilled-gray-400 text-center py-4">No tickets yet</p>
          )}
        </div>

        {/* By Priority - Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-charcoal-500" size={20} />
            <h2 className="text-xl font-semibold text-charcoal-500">
              Tickets by Priority
            </h2>
          </div>
          {Object.entries(stats.ticketsByPriority).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(stats.ticketsByPriority).map(([priority, count]) => ({
                  name: priority,
                  value: count
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {Object.entries(stats.ticketsByPriority).map(([priority], index) => {
                    const priorityColors = {
                      URGENT: '#ef4444',
                      HIGH: '#f59e0b',
                      MEDIUM: '#eab308',
                      LOW: '#6b7280'
                    };
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={priorityColors[priority] || '#6b7280'} 
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-chilled-gray-400 text-center py-4">No tickets yet</p>
          )}
        </div>
      </div>

      {/* Tickets by Status Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-charcoal-500" size={20} />
          <h2 className="text-xl font-semibold text-charcoal-500">
            Tickets by Status
          </h2>
        </div>
        {Object.entries(stats.ticketsByStatus).length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={Object.entries(stats.ticketsByStatus).map(([status, count]) => ({
                name: status,
                value: count
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {Object.entries(stats.ticketsByStatus).map(([status], index) => {
                  const statusColors = {
                    OPEN: '#3b82f6',
                    IN_PROGRESS: '#f59e0b',
                    RESOLVED: '#10b981',
                    CLOSED: '#6b7280',
                    PENDING: '#8b5cf6'
                  };
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={statusColors[status] || '#6b7280'} 
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-chilled-gray-400 text-center py-4">No tickets yet</p>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;
