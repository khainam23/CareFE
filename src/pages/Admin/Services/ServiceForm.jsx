import { useState } from 'react';
import FormModal from '@components/admin/FormModal';

const ServiceForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      // Convert numeric fields
      const formattedData = {
        ...data,
        basePrice: parseFloat(data.basePrice),
        durationMinutes: parseInt(data.durationMinutes),
        isActive: data.isActive === 'true' || data.isActive === true,
      };
      await onSubmit(formattedData);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'name',
      label: 'Service Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'ELDERLY_CARE', label: 'Elderly Care' },
        { value: 'CHILD_CARE', label: 'Child Care' },
        { value: 'MEDICAL_CARE', label: 'Medical Care' },
        { value: 'COMPANION', label: 'Companion' },
        { value: 'HOUSEKEEPING', label: 'Housekeeping' },
        { value: 'NURSING', label: 'Nursing' },
        { value: 'REHABILITATION', label: 'Rehabilitation' },
        { value: 'OTHER', label: 'Other' },
      ],
    },
    {
      name: 'basePrice',
      label: 'Base Price ($)',
      type: 'number',
      required: true,
    },
    {
      name: 'durationMinutes',
      label: 'Duration (minutes)',
      type: 'number',
      required: true,
    },
    {
      name: 'isActive',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Service' : 'Create New Service'}
      onSubmit={handleSubmit}
      initialData={
        initialData
          ? {
              ...initialData,
              isActive: initialData.isActive ? 'true' : 'false',
            }
          : { isActive: 'true' }
      }
      fields={fields}
      loading={loading}
    />
  );
};

export default ServiceForm;
