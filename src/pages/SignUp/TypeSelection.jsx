import { Users, Briefcase } from 'lucide-react';

const typeConfig = {
  customer: {
    label: 'Khách hàng',
    description: 'Đăng ký để tìm dịch vụ',
    icon: Users,
  },
  employee: {
    label: 'Nhân viên',
    description: 'Đăng ký để cung cấp dịch vụ',
    icon: Briefcase,
  },
};

export default function TypeSelection({ types, onSelectType }) {
  return (
    <div className="flex flex-col w-full max-w-2xl gap-6 mx-auto">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {types.map((type) => {
          const config = typeConfig[type];
          const Icon = config.icon;

          return (
            <button
              key={type}
              onClick={() => onSelectType(type)}
              className="relative p-8 transition duration-300 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:shadow-lg hover:bg-blue-50 group"
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 transition bg-blue-100 rounded-full group-hover:bg-blue-200">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {/* Label */}
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {config.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 group-hover:text-gray-700">
                {config.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}