import { useState } from 'react';
import FormModal from '@components/admin/FormModal';

const UserForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: !initialData,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: !initialData,
    },
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'tel',
      required: true,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'ROLE_CUSTOMER', label: 'Customer' },
        { value: 'ROLE_CAREGIVER', label: 'Caregiver' },
        { value: 'ROLE_SUPPORT', label: 'Support' },
        { value: 'ROLE_ADMIN', label: 'Admin' },
      ],
    },
  ];

  // Add status field for edit mode
  if (initialData) {
    fields.push({
      name: 'status',
      label: 'Status',
      type: 'select',
      required: false,
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'SUSPENDED', label: 'Suspended' },
        { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
        { value: 'REJECTED', label: 'Rejected' },
      ],
    });
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit User' : 'Create New User'}
      onSubmit={handleSubmit}
      initialData={
        initialData
          ? {
              ...initialData,
              role: initialData.roles?.[0] || '',
            }
          : {}
      }
      fields={fields}
      loading={loading}
    />
  );
};

export default UserForm;
