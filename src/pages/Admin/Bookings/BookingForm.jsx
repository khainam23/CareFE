import { useState } from 'react';
import FormModal from '@components/admin/FormModal';

const BookingForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      // Convert date strings to ISO format
      const formattedData = {
        ...data,
        scheduledStartTime: data.scheduledStartTime
          ? new Date(data.scheduledStartTime).toISOString()
          : undefined,
        scheduledEndTime: data.scheduledEndTime
          ? new Date(data.scheduledEndTime).toISOString()
          : undefined,
        totalPrice: parseFloat(data.totalPrice),
        customerId: parseInt(data.customerId),
        serviceId: parseInt(data.serviceId),
        caregiverId: data.caregiverId ? parseInt(data.caregiverId) : undefined,
      };
      await onSubmit(formattedData);
    } finally {
      setLoading(false);
    }
  };

  const fields = initialData
    ? [
        // Edit mode - limited fields
        {
          name: 'caregiverId',
          label: 'Caregiver ID',
          type: 'number',
          required: false,
        },
        {
          name: 'scheduledStartTime',
          label: 'Scheduled Start Time',
          type: 'datetime-local',
          required: false,
        },
        {
          name: 'scheduledEndTime',
          label: 'Scheduled End Time',
          type: 'datetime-local',
          required: false,
        },
        {
          name: 'totalPrice',
          label: 'Total Price',
          type: 'number',
          required: false,
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: false,
          options: [
            { value: 'PENDING', label: 'Pending' },
            { value: 'CONFIRMED', label: 'Confirmed' },
            { value: 'ASSIGNED', label: 'Assigned' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
            { value: 'REJECTED', label: 'Rejected' },
          ],
        },
        {
          name: 'customerNote',
          label: 'Customer Note',
          type: 'textarea',
          required: false,
        },
        {
          name: 'caregiverNote',
          label: 'Caregiver Note',
          type: 'textarea',
          required: false,
        },
        {
          name: 'location',
          label: 'Location',
          type: 'text',
          required: false,
        },
        {
          name: 'cancellationReason',
          label: 'Cancellation Reason',
          type: 'textarea',
          required: false,
        },
      ]
    : [
        // Create mode - all required fields
        {
          name: 'customerId',
          label: 'Customer ID',
          type: 'number',
          required: true,
        },
        {
          name: 'serviceId',
          label: 'Service ID',
          type: 'number',
          required: true,
        },
        {
          name: 'caregiverId',
          label: 'Caregiver ID (Optional)',
          type: 'number',
          required: false,
        },
        {
          name: 'scheduledStartTime',
          label: 'Scheduled Start Time',
          type: 'datetime-local',
          required: true,
        },
        {
          name: 'scheduledEndTime',
          label: 'Scheduled End Time',
          type: 'datetime-local',
          required: true,
        },
        {
          name: 'totalPrice',
          label: 'Total Price',
          type: 'number',
          required: true,
        },
        {
          name: 'customerNote',
          label: 'Customer Note',
          type: 'textarea',
          required: false,
        },
        {
          name: 'location',
          label: 'Location',
          type: 'text',
          required: false,
        },
      ];

  // Format datetime for input
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formattedInitialData = initialData
    ? {
        ...initialData,
        scheduledStartTime: formatDateTimeForInput(initialData.scheduledStartTime),
        scheduledEndTime: formatDateTimeForInput(initialData.scheduledEndTime),
      }
    : {};

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Booking' : 'Create New Booking'}
      onSubmit={handleSubmit}
      initialData={formattedInitialData}
      fields={fields}
      loading={loading}
    />
  );
};

export default BookingForm;
