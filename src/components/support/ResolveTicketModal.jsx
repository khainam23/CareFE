import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const ResolveTicketModal = ({ isOpen, onClose, onSubmit, ticketNumber }) => {
  const [resolution, setResolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (resolution.trim().length < 10) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(resolution);
      setResolution('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setResolution('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const charCount = resolution.length;
  const isValid = charCount >= 10;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-chilled-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-charcoal-900">
                  Resolve Ticket
                </h2>
                <p className="text-xs sm:text-sm text-chilled-gray-600">
                  Ticket #{ticketNumber}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-chilled-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <X className="w-5 h-5 text-chilled-gray-600" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label 
                  htmlFor="resolution" 
                  className="block text-sm font-medium text-charcoal-900 mb-2"
                >
                  Resolution Details
                </label>
                <textarea
                  id="resolution"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how you resolved this ticket..."
                  rows={6}
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-chilled-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none disabled:bg-chilled-gray-100 disabled:cursor-not-allowed"
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mt-2">
                  <p className={`text-xs sm:text-sm ${
                    charCount < 10 
                      ? 'text-red-600' 
                      : 'text-chilled-gray-600'
                  }`}>
                    {charCount < 10 
                      ? `Min 10 chars (${10 - charCount} more)` 
                      : `${charCount} characters`
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-chilled-gray-500">
                    {charCount} / 1000
                  </p>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-cyan-900">
                  <strong>Note:</strong> Once you resolve this ticket, the status will be updated to "Resolved" 
                  and the customer will be notified of the resolution.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-chilled-gray-200 bg-chilled-gray-50">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-chilled-gray-700 bg-white border border-chilled-gray-300 rounded-lg hover:bg-chilled-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Resolve Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResolveTicketModal;
