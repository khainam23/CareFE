import { useState } from 'react';
import FormModal from '@components/admin/FormModal';
import Ellipse18_1 from '@assets/images/Ellipse 18 (1).svg';
import Ellipse18_2 from '@assets/images/Ellipse 18 (2).svg';
import Ellipse18_3 from '@assets/images/Ellipse 18 (3).svg';
import Ellipse18_4 from '@assets/images/Ellipse 18 (4).svg';
import Ellipse18_5 from '@assets/images/Ellipse 18 (5).svg';
import Ellipse19 from '@assets/images/Ellipse 19.svg';

const AVATAR_OPTIONS = [
  { value: 'Ellipse 18 (1).svg', label: 'Avatar 1', image: Ellipse18_1 },
  { value: 'Ellipse 18 (2).svg', label: 'Avatar 2', image: Ellipse18_2 },
  { value: 'Ellipse 18 (3).svg', label: 'Avatar 3', image: Ellipse18_3 },
  { value: 'Ellipse 18 (4).svg', label: 'Avatar 4', image: Ellipse18_4 },
  { value: 'Ellipse 18 (5).svg', label: 'Avatar 5', image: Ellipse18_5 },
  { value: 'Ellipse 19.svg', label: 'Avatar 6', image: Ellipse19 },
];

const UserForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const hasAvatarFile = data.avatar && data.avatar[0];
      const hasAvatarImage = data.avatarImage && data.avatarImage.trim() !== '';
      
      if (hasAvatarFile || hasAvatarImage) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === 'avatar') {
            if (data.avatar && data.avatar[0]) {
              formData.append('avatar', data.avatar[0]);
            }
          } else {
            formData.append(key, data[key]);
          }
        });
        if (hasAvatarImage) {
          formData.append('imageSource', 'local');
        } else if (hasAvatarFile) {
          formData.append('imageSource', 'url');
        }
        await onSubmit(formData);
      } else {
        await onSubmit(data);
      }
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
    {
      name: 'avatarImage',
      label: 'Select Avatar from Project',
      type: 'select',
      required: false,
      options: [
        { value: '', label: 'None' },
        ...AVATAR_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))
      ],
    },
    {
      name: 'avatar',
      label: 'Or Upload Avatar',
      type: 'file',
      accept: 'image/*',
      required: false,
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
