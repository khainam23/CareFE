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
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Support Dashboard</h1>
        <p className="text-sm sm:text-base text-chilled-gray-600 mt-2">
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

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900">
                Average Resolution Time
              </h3>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {stats.avgResolutionTime}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900">
                Resolution Rate
              </h3>
              <p className="text-2xl font-bold text-teal-600 mt-1">
                {stats.totalTickets > 0 
                  ? Math.round(((stats.ticketsByStatus.RESOLVED || 0) / stats.totalTickets) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-charcoal-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleViewUnassigned}
            className="flex items-center justify-between p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="text-orange-600" size={24} />
              <div className="text-left">
                <p className="font-semibold text-charcoal-900">Unassigned Tickets</p>
                <p className="text-sm text-chilled-gray-600">
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
                <p className="font-semibold text-charcoal-900">My Tickets</p>
                <p className="text-sm text-chilled-gray-600">
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

      {/* Ticket Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-charcoal-900" size={20} />
            <h2 className="text-xl font-semibold text-charcoal-900">
              Tickets by Category
            </h2>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.ticketsByCategory).length > 0 ? (
              Object.entries(stats.ticketsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-chilled-gray-700 capitalize">
                    {category.toLowerCase().replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-chilled-gray-200 rounded-full h-2">
                      <div
                        className="bg-cyan-600 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.totalTickets) * 100}%`
                        }}
                      />
                    </div>
                    <span className="font-semibold text-charcoal-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-chilled-gray-500 text-center py-4">No tickets yet</p>
            )}
          </div>
        </div>

        {/* By Priority */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-charcoal-900" size={20} />
            <h2 className="text-xl font-semibold text-charcoal-900">
              Tickets by Priority
            </h2>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.ticketsByPriority).length > 0 ? (
              Object.entries(stats.ticketsByPriority).map(([priority, count]) => {
                const priorityColors = {
                  URGENT: 'bg-red-600',
                  HIGH: 'bg-orange-600',
                  MEDIUM: 'bg-yellow-600',
                  LOW: 'bg-gray-600'
                };
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <span className="text-chilled-gray-700 capitalize">
                      {priority.toLowerCase()}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-chilled-gray-200 rounded-full h-2">
                        <div
                          className={`${priorityColors[priority]} h-2 rounded-full`}
                          style={{
                            width: `${(count / stats.totalTickets) * 100}%`
                          }}
                        />
                      </div>
                      <span className="font-semibold text-charcoal-900 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-chilled-gray-500 text-center py-4">No tickets yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
