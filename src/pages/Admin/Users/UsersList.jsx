import { useEffect, useState } from 'react';
import { Plus, UserCheck, UserX, Eye } from 'lucide-react';
import DataTable from '@components/admin/DataTable';
import UserForm from './UserForm';
import UserDetailModal from './UserDetailModal';
import Button from '@components/common/Button/Button';
import adminService from '@services/adminService';
import Swal from 'sweetalert2';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    document.title = 'Users Management - Admin';
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(0, 100);
      if (response.success) {
        // Filter out users with ROLE_ADMIN
        const filteredUsers = (response.data.content || []).filter(
          (user) => !user.roles?.includes('ROLE_ADMIN')
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load users',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUserId(user.id);
    setIsDetailOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete user "${user.fullName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.deleteUser(user.id);
        if (response.success) {
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          fetchUsers();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete user',
        });
      }
    }
  };

  const handleSuspend = async (user) => {
    try {
      const response = await adminService.suspendUser(user.id);
      if (response.success) {
        Swal.fire('Success', 'User has been suspended.', 'success');
        fetchUsers();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to suspend user',
      });
    }
  };

  const handleActivate = async (user) => {
    try {
      const response = await adminService.activateUser(user.id);
      if (response.success) {
        Swal.fire('Success', 'User has been activated.', 'success');
        fetchUsers();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to activate user',
      });
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      let avatarFile = null;
      let avatarImage = null;
      let imageSource = null;
      let submitData = data;
      
      if (data instanceof FormData) {
        avatarFile = data.get('avatar');
        avatarImage = data.get('avatarImage');
        imageSource = data.get('imageSource');
        
        if (avatarFile && avatarFile.size === 0) {
          avatarFile = null;
        }
        
        submitData = new FormData();
        data.forEach((value, key) => {
          if (key !== 'avatar' && key !== 'avatarImage' && key !== 'imageSource') {
            submitData.append(key, value);
          }
        });
      }
      
      let response;
      if (selectedUser) {
        response = await adminService.updateUser(selectedUser.id, submitData);
      } else {
        response = await adminService.createUser(submitData);
      }

      if (response.success) {
        const userId = response.data.id;
        
        if (avatarFile) {
          const avatarFormData = new FormData();
          avatarFormData.append('avatar', avatarFile);
          await adminService.uploadUserAvatar(userId, avatarFormData);
        } else if (avatarImage) {
          const avatarFormData = new FormData();
          avatarFormData.append('avatarImage', avatarImage);
          avatarFormData.append('imageSource', 'local');
          await adminService.uploadUserAvatar(userId, avatarFormData);
        }
        
        Swal.fire(
          'Success',
          `User has been ${selectedUser ? 'updated' : 'created'} successfully.`,
          'success'
        );
        setIsFormOpen(false);
        fetchUsers();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || `Failed to ${selectedUser ? 'update' : 'create'} user`,
      });
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'fullName',
      label: 'Full Name',
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
    },
    {
      key: 'roles',
      label: 'Role',
      render: (roles) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {roles && roles.length > 0 ? roles[0].replace('ROLE_', '') : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const statusColors = {
          ACTIVE: 'bg-green-100 text-green-800',
          SUSPENDED: 'bg-red-100 text-red-800',
          PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
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
          <h1 className="text-3xl font-bold text-charcoal-500">Users Management</h1>
          <p className="text-chilled-gray-400 mt-1">
            Manage all users in the system
          </p>
        </div>
        <Button onClick={handleCreate} className="w-30 text-white align-cetner flex">
          <Plus size={20} className="mr-2" />
          Create User
        </Button>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        customActions={(user) => (
          <>
            <button
              onClick={() => handleViewDetails(user)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            {user.status === 'ACTIVE' ? (
              <button
                onClick={() => handleSuspend(user)}
                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors active:bg-primary-600 active: active:hover:bg-primary-700"
                title="Suspend"
              >
                <UserX size={18} />
              </button>
            ) : (
              <button
                onClick={() => handleActivate(user)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors active:bg-primary-600 active: active:hover:bg-primary-700"
                title="Activate"
              >
                <UserCheck size={18} />
              </button>
            )}
          </>
        )}
      />

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        userId={selectedUserId}
      />
    </div>
  );
};

export default UsersList;
