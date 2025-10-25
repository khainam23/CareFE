import React, { useState } from 'react';
import { Button, Input } from '@/components/common';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Check, X } from 'lucide-react';

const PersonalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0912345678',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    dateOfBirth: '1990-01-15',
    gender: 'Nam',
    notes: 'Có bệnh tiểu đường, cần chăm sóc đặc biệt',
  });

  const [editForm, setEditForm] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Profile Avatar Section */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 flex items-center gap-6">
        <div className="w-24 h-24 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={48} className="text-teal-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
          <p className="text-gray-600 mt-1">Khách hàng</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <User size={16} />
                Họ và tên
              </span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Mail size={16} />
                Email
              </span>
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Phone size={16} />
                Số điện thoại
              </span>
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.phone}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                Ngày sinh
              </span>
            </label>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={editForm.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            {isEditing ? (
              <select
                name="gender"
                value={editForm.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.gender}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Địa chỉ
              </span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editForm.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.address}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú y tế
          </label>
          {isEditing ? (
            <textarea
              name="notes"
              value={editForm.notes}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Thêm ghi chú về tình trạng sức khỏe, dị ứng hoặc yêu cầu đặc biệt..."
            />
          ) : (
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-wrap">
              {profile.notes}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              <Check size={18} />
              Lưu thay đổi
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <X size={18} />
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalProfile;