export default function TypeSelection({ types, onSelectType }) {
  return (
    <div className="flex flex-col w-full max-w-md gap-6 mx-auto">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelectType(type)}
          className="p-6 text-lg font-semibold capitalize transition border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50"
        >
          {type === 'customer' ? 'Khách hàng' : 'Nhân viên'}
        </button>
      ))}
    </div>
  );
}