import { useEffect, useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import DataTable from '@components/admin/DataTable';
import BookingForm from './BookingForm';
import BookingDetail from './BookingDetail';
import Button from '@components/common/Button/Button';
import adminService from '@services/adminService';
import Swal from 'sweetalert2';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    document.title = 'Bookings Management - Admin';
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllBookings(0, 100);
      if (response.success) {
        setBookings(response.data.content || []);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load bookings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBooking(null);
    setIsFormOpen(true);
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleDelete = async (booking) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete booking "${booking.bookingCode}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.deleteBooking(booking.id);
        if (response.success) {
          Swal.fire('Deleted!', 'Booking has been deleted.', 'success');
          fetchBookings();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete booking',
        });
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      let response;
      if (selectedBooking) {
        response = await adminService.updateBooking(selectedBooking.id, data);
      } else {
        response = await adminService.createBooking(data);
      }

      if (response.success) {
        Swal.fire(
          'Success',
          `Booking has been ${selectedBooking ? 'updated' : 'created'} successfully.`,
          'success'
        );
        setIsFormOpen(false);
        fetchBookings();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || `Failed to ${selectedBooking ? 'update' : 'create'} booking`,
      });
    }
  };

  const filteredBookings =
    statusFilter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const columns = [
    {
      key: 'bookingCode',
      label: 'Booking Code',
    },
    {
      key: 'customerName',
      label: 'Customer',
    },
    {
      key: 'caregiverName',
      label: 'Caregiver',
      render: (name) => name || 'Not Assigned',
    },
    {
      key: 'serviceName',
      label: 'Service',
    },
    {
      key: 'scheduledStartTime',
      label: 'Date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'totalPrice',
      label: 'Price',
      render: (price) => `$${price}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const statusColors = {
          PENDING: 'bg-yellow-100 text-yellow-800',
          CONFIRMED: 'bg-blue-100 text-blue-800',
          ASSIGNED: 'bg-purple-100 text-purple-800',
          IN_PROGRESS: 'bg-cyan-100 text-cyan-800',
          COMPLETED: 'bg-green-100 text-green-800',
          CANCELLED: 'bg-red-100 text-red-800',
          REJECTED: 'bg-gray-100 text-gray-800',
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusColors[status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-500">
            Bookings Management
          </h1>
          <p className="text-chilled-gray-400 mt-1">
            Manage all bookings in the system
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          Create Booking
        </Button>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-chilled-gray-400" />
          <label className="text-sm font-medium text-charcoal-500">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <DataTable
        columns={columns}
        data={filteredBookings}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedBooking}
      />

      {/* Booking Detail Modal */}
      <BookingDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBooking}
        onRefresh={fetchBookings}
      />
    </div>
  );
};

export default BookingsList;
