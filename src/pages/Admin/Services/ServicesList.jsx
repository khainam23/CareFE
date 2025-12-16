import { useEffect, useState } from 'react';
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import DataTable from '@components/admin/DataTable';
import ServiceForm from './ServiceForm';
import Button from '@components/common/Button/Button';
import adminService from '@services/adminService';
import Swal from 'sweetalert2';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    document.title = 'Services Management - Admin';
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllServices(0, 100);
      if (response.success) {
        setServices(response.data.content || []);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load services',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (service) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete service "${service.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.deleteService(service.id);
        if (response.success) {
          Swal.fire('Deleted!', 'Service has been deleted.', 'success');
          fetchServices();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete service',
        });
      }
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      const response = await adminService.toggleServiceStatus(service.id);
      if (response.success) {
        Swal.fire(
          'Success',
          `Service has been ${service.isActive ? 'deactivated' : 'activated'}.`,
          'success'
        );
        fetchServices();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to toggle service status',
      });
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      let response;
      if (selectedService) {
        response = await adminService.updateService(selectedService.id, data);
      } else {
        response = await adminService.createService(data);
      }

      if (response.success) {
        Swal.fire(
          'Success',
          `Service has been ${selectedService ? 'updated' : 'created'} successfully.`,
          'success'
        );
        setIsFormOpen(false);
        fetchServices();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || `Failed to ${selectedService ? 'update' : 'create'} service`,
      });
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'category',
      label: 'Category',
      render: (category) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
          {category?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'basePrice',
      label: 'Base Price',
      render: (price) => `$${price}`,
    },
    {
      key: 'durationMinutes',
      label: 'Duration',
      render: (duration) => `${duration} min`,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (isActive) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-500">
            Services Management
          </h1>
          <p className="text-chilled-gray-400 mt-1">
            Manage all services offered in the system
          </p>
        </div>
        <Button onClick={handleCreate} className="text-white flex">
          <Plus size={20} className="mr-2" />
          Create Service
        </Button>
      </div>

      {/* Services Table */}
      <DataTable
        columns={columns}
        data={services}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        customActions={(service) => (
          <button
            onClick={() => handleToggleStatus(service)}
            className={`p-2 rounded-lg transition-colors ${
              service.isActive
                ? 'text-orange-600 hover:bg-orange-50'
                : 'text-green-600 hover:bg-green-50'
            } active:bg-primary-600 active: active:hover:bg-primary-700`}
            title={service.isActive ? 'Deactivate' : 'Activate'}
          >
            {service.isActive ? (
              <ToggleRight size={18} />
            ) : (
              <ToggleLeft size={18} />
            )}
          </button>
        )}
      />

      {/* Service Form Modal */}
      <ServiceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedService}
      />
    </div>
  );
};

export default ServicesList;
