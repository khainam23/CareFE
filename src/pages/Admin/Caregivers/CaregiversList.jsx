import { useEffect, useState } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '@components/admin/DataTable';
import CaregiverForm from './CaregiverForm';
import Button from '@components/common/Button/Button';
import adminService from '@services/adminService';
import Swal from 'sweetalert2';

const CaregiversList = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);

  useEffect(() => {
    document.title = 'Caregivers Management - Admin';
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCaregivers(0, 100);
      if (response.success) {
        setCaregivers(response.data.content || []);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load caregivers',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCaregiver(null);
    setIsFormOpen(true);
  };

  const handleEdit = (caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsFormOpen(true);
  };

  const handleDelete = async (caregiver) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete caregiver "${caregiver.fullName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.deleteCaregiver(caregiver.id);
        if (response.success) {
          Swal.fire('Deleted!', 'Caregiver has been deleted.', 'success');
          fetchCaregivers();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete caregiver',
        });
      }
    }
  };

  const handleApprove = async (caregiver) => {
    try {
      const response = await adminService.approveCaregiver(caregiver.id);
      if (response.success) {
        Swal.fire('Success', 'Caregiver has been approved.', 'success');
        fetchCaregivers();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to approve caregiver',
      });
    }
  };

  const handleReject = async (caregiver) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Caregiver',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter the reason for rejection...',
      inputAttributes: {
        'aria-label': 'Enter the reason for rejection',
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!';
        }
      },
    });

    if (reason) {
      try {
        const response = await adminService.rejectCaregiver(caregiver.id, reason);
        if (response.success) {
          Swal.fire('Success', 'Caregiver has been rejected.', 'success');
          fetchCaregivers();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to reject caregiver',
        });
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      let response;
      if (selectedCaregiver) {
        response = await adminService.updateCaregiver(selectedCaregiver.id, data);
      } else {
        response = await adminService.createCaregiver(data);
      }

      if (response.success) {
        Swal.fire(
          'Success',
          `Caregiver has been ${selectedCaregiver ? 'updated' : 'created'} successfully.`,
          'success'
        );
        setIsFormOpen(false);
        fetchCaregivers();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || `Failed to ${selectedCaregiver ? 'update' : 'create'} caregiver`,
      });
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'fullName',
      label: 'Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (experience) => experience || 'N/A',
    },
    {
      key: 'hourlyRate',
      label: 'Hourly Rate',
      render: (rate) => `$${rate || 0}`,
    },
    {
      key: 'verificationStatus',
      label: 'Status',
      render: (status) => {
        const statusColors = {
          APPROVED: 'bg-green-100 text-green-800',
          PENDING: 'bg-yellow-100 text-yellow-800',
          REJECTED: 'bg-red-100 text-red-800',
          SUSPENDED: 'bg-gray-100 text-gray-800',
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
            Caregivers Management
          </h1>
          <p className="text-chilled-gray-400 mt-1">
            Manage all caregivers in the system
          </p>
        </div>
        <Button className="text-white flex" onClick={handleCreate}>
          <Plus size={20} className="mr-2 text-white" />
          Create Caregiver
        </Button>
      </div>

      {/* Caregivers Table */}
      <DataTable
        columns={columns}
        data={caregivers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        customActions={(caregiver) => (
          <>
            {caregiver.verificationStatus === 'PENDING' && (
              <>
                <button
                  onClick={() => handleApprove(caregiver)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors active:bg-primary-600 active: active:hover:bg-primary-700"
                  title="Approve"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={() => handleReject(caregiver)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:bg-primary-600 active: active:hover:bg-primary-700"
                  title="Reject"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}
          </>
        )}
      />

      {/* Caregiver Form Modal */}
      <CaregiverForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCaregiver}
      />
    </div>
  );
};

export default CaregiversList;
