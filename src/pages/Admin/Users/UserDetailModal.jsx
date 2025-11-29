import { useEffect, useState } from 'react';
import { X, User, Mail, Phone, Calendar, Shield, Image as ImageIcon } from 'lucide-react';
import Modal from '@components/common/Modal/Modal';
import adminService from '@services/adminService';
import Swal from 'sweetalert2';

const UserDetailModal = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUserById(userId);
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load user details',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      SUSPENDED: 'bg-red-100 text-red-800',
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-charcoal-500">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-chilled-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-chilled-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-charcoal-500 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <User className="text-primary-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-chilled-gray-400">Full Name</p>
                    <p className="font-medium text-charcoal-500">{user.fullName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="text-primary-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-chilled-gray-400">Email</p>
                    <p className="font-medium text-charcoal-500">{user.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="text-primary-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-chilled-gray-400">Phone Number</p>
                    <p className="font-medium text-charcoal-500">{user.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="text-primary-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-chilled-gray-400">Role</p>
                    <p className="font-medium text-charcoal-500">
                      {user.roles && user.roles.length > 0
                        ? user.roles[0].replace('ROLE_', '')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="text-primary-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-chilled-gray-400">Created At</p>
                    <p className="font-medium text-charcoal-500">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-primary-500 mt-1"></div>
                  <div>
                    <p className="text-sm text-chilled-gray-400">Status</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Caregiver Specific Info */}
            {user.roles?.includes('ROLE_CAREGIVER') && user.caregiverProfile && (
              <div className="bg-chilled-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-charcoal-500 mb-4">
                  Caregiver Profile
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-chilled-gray-400">Bio</p>
                    <p className="text-charcoal-500">{user.caregiverProfile.bio || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-chilled-gray-400">Experience (years)</p>
                      <p className="font-medium text-charcoal-500">
                        {user.caregiverProfile.experienceYears || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-chilled-gray-400">Hourly Rate</p>
                      <p className="font-medium text-charcoal-500">
                        ${user.caregiverProfile.hourlyRate || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {user.caregiverProfile.specializations && (
                    <div>
                      <p className="text-sm text-chilled-gray-400 mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-2">
                        {user.caregiverProfile.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Uploaded Images */}
            <div className="bg-chilled-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <ImageIcon className="text-primary-500" size={20} />
                <h3 className="text-lg font-semibold text-charcoal-500">Uploaded Images</h3>
              </div>
              {(() => {
                const hasAvatar = user.avatarUrl;
                const hasIdCard = user.caregiverProfile?.idCardUrl;
                const certificateUrls = user.caregiverProfile?.certificateUrls
                  ? (() => {
                      try {
                        // Try to parse as JSON array
                        return JSON.parse(user.caregiverProfile.certificateUrls);
                      } catch {
                        // If not JSON, treat as comma-separated string
                        return user.caregiverProfile.certificateUrls
                          .split(',')
                          .map((url) => url.trim())
                          .filter((url) => url);
                      }
                    })()
                  : [];
                const hasCertificates = certificateUrls.length > 0;
                const hasAnyImage = hasAvatar || hasIdCard || hasCertificates;

                return hasAnyImage ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Avatar Image */}
                    {hasAvatar && (
                      <div className="space-y-2">
                        <p className="text-sm text-chilled-gray-400">Avatar</p>
                        <img
                          src={user.avatarUrl}
                          alt="Avatar"
                          className="w-full h-40 object-cover rounded-lg border-2 border-chilled-gray-200 cursor-pointer hover:border-primary-500 transition-colors"
                          onClick={() => window.open(user.avatarUrl, '_blank')}
                        />
                      </div>
                    )}
                    {/* ID Card Image */}
                    {hasIdCard && (
                      <div className="space-y-2">
                        <p className="text-sm text-chilled-gray-400">ID Card</p>
                        <img
                          src={user.caregiverProfile.idCardUrl}
                          alt="ID Card"
                          className="w-full h-40 object-cover rounded-lg border-2 border-chilled-gray-200 cursor-pointer hover:border-primary-500 transition-colors"
                          onClick={() => window.open(user.caregiverProfile.idCardUrl, '_blank')}
                        />
                      </div>
                    )}
                    {/* Certificate Images */}
                    {certificateUrls.map((url, index) => (
                      <div key={index} className="space-y-2">
                        <p className="text-sm text-chilled-gray-400">
                          Certificate {index + 1}
                        </p>
                        <img
                          src={url}
                          alt={`Certificate ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border-2 border-chilled-gray-200 cursor-pointer hover:border-primary-500 transition-colors"
                          onClick={() => window.open(url, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-chilled-gray-400">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No images uploaded</p>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-chilled-gray-400">
            <p>User not found</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserDetailModal;
