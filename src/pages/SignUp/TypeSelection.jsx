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
    <div className="flex flex-col w-[180%] gap-6 ml-[-35%]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {types.map((type) => {
          const config = typeConfig[type];
          const Icon = config.icon;

          return (
            <button
              key={type}
              onClick={() => onSelectType(type)}
              className="relative p-8 transition duration-300 border-2 border-chilled-gray-300 rounded-xl hover:border-primary-500 hover:shadow-lg hover:bg-primary-50 group active:bg-primary-600 active:text-white active:border-primary-600 active:hover:bg-primary-700"
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 transition bg-primary-100 rounded-full group-hover:bg-primary-200 group-active:bg-primary-700">
                  <Icon className="w-8 h-8 text-primary-600 group-active:text-white" />
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