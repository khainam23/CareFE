import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Button from '@components/common/Button/Button';

const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  initialData = {},
  fields = [],
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData,
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-opacity-50 transition-opacity"
        style={{ background: "rgba(0,0,0,0.4)"}}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-chilled-gray-200">
            <h2 className="text-xl font-semibold text-charcoal-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-chilled-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-charcoal-900 mb-1"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={field.name}
                      {...register(field.name, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                      })}
                      className="w-full px-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      {...register(field.name, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                      })}
                      rows={4}
                      className="w-full px-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : field.type === 'file' ? (
                    <input
                      id={field.name}
                      type="file"
                      accept={field.accept || 'image/*'}
                      {...register(field.name, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                      })}
                      className="w-full px-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <input
                      id={field.name}
                      type={field.type || 'text'}
                      {...register(field.name, {
                        required: field.required
                          ? `${field.label} is required`
                          : false,
                      })}
                      className="w-full px-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  )}

                  {errors[field.name] && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-chilled-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className='px-5'
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className='text-white px-5'>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
