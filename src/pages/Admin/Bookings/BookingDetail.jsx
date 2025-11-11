import { X } from 'lucide-react';
import Button from '@components/common/Button/Button';
import adminService from '@services/adminService';
import Swal from 'sweetalert2';
import { useState } from 'react';

const BookingDetail = ({ isOpen, onClose, booking, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      const response = await adminService.updateBookingStatus(booking.id, newStatus);
      if (response.success) {
        Swal.fire('Success', 'Booking status updated successfully.', 'success');
        onRefresh();
        onClose();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update booking status',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-chilled-gray-200">
            <h2 className="text-xl font-semibold text-charcoal-900">
              Booking Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-chilled-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Booking Information */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Booking Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-chilled-gray-600">Booking Code</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {booking.bookingCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-chilled-gray-600">Status</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {booking.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-chilled-gray-600">Total Price</p>
                  <p className="text-base font-medium text-charcoal-900">
                    ${booking.totalPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-chilled-gray-600">Created At</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Customer Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-chilled-gray-600">Name</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {booking.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-chilled-gray-600">Customer ID</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {booking.customerId}
                  </p>
                </div>
              </div>
            </div>

            {/* Caregiver Details */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Caregiver Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-chilled-gray-600">Name</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {booking.caregiverName || 'Not Assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-chilled-gray-600">Caregiver ID</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {booking.caregiverId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Service Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-chilled-gray-600">Service Name</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {booking.serviceName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-chilled-gray-600">Service ID</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {booking.serviceId}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-chilled-gray-600">Scheduled Start</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {formatDate(booking.scheduledStartTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-chilled-gray-600">Scheduled End</p>
                  <p className="text-base font-medium text-charcoal-900">
                    {formatDate(booking.scheduledEndTime)}
                  </p>
                </div>
                {booking.actualStartTime && (
                  <div>
                    <p className="text-sm text-chilled-gray-600">Actual Start</p>
                    <p className="text-base font-medium text-charcoal-900">
                      {formatDate(booking.actualStartTime)}
                    </p>
                  </div>
                )}
                {booking.actualEndTime && (
                  <div>
                    <p className="text-sm text-chilled-gray-600">Actual End</p>
                    <p className="text-base font-medium text-charcoal-900">
                      {formatDate(booking.actualEndTime)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {(booking.customerNote || booking.caregiverNote || booking.location) && (
              <div>
                <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                  Additional Information
                </h3>
                <div className="space-y-3">
                  {booking.location && (
                    <div>
                      <p className="text-sm text-chilled-gray-600">Location</p>
                      <p className="text-base font-medium text-charcoal-900">
                        {booking.location}
                      </p>
                    </div>
                  )}
                  {booking.customerNote && (
                    <div>
                      <p className="text-sm text-chilled-gray-600">Customer Note</p>
                      <p className="text-base text-charcoal-900">
                        {booking.customerNote}
                      </p>
                    </div>
                  )}
                  {booking.caregiverNote && (
                    <div>
                      <p className="text-sm text-chilled-gray-600">Caregiver Note</p>
                      <p className="text-base text-charcoal-900">
                        {booking.caregiverNote}
                      </p>
                    </div>
                  )}
                  {booking.cancellationReason && (
                    <div>
                      <p className="text-sm text-chilled-gray-600">
                        Cancellation Reason
                      </p>
                      <p className="text-base text-charcoal-900">
                        {booking.cancellationReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Update Actions */}
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Update Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {booking.status !== 'CONFIRMED' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusUpdate('CONFIRMED')}
                    disabled={loading}
                  >
                    Confirm
                  </Button>
                )}
                {booking.status !== 'IN_PROGRESS' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                    disabled={loading}
                  >
                    Start
                  </Button>
                )}
                {booking.status !== 'COMPLETED' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={loading}
                  >
                    Complete
                  </Button>
                )}
                {booking.status !== 'CANCELLED' && (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-chilled-gray-200">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
