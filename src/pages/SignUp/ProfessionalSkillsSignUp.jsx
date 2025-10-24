import { useState } from 'react';
import { Award, Stethoscope, Zap, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const PROFESSIONAL_STEPS = [
  {
    id: 1,
    title: 'Kinh nghiệm chăm sóc',
    description: 'Chọn mức độ kinh nghiệm của bạn',
  },
  {
    id: 2,
    title: 'Chuyên môn cơ bản',
    description: 'Chọn các lĩnh vực chuyên môn của bạn',
  },
  {
    id: 3,
    title: 'Khả năng thiết bị',
    description: 'Chọn các thiết bị bạn có thể sử dụng',
  },
  {
    id: 4,
    title: 'Xác nhận cam kết',
    description: 'Xác nhận thông tin và cam kết',
  },
];

const EXPERIENCE_OPTIONS = [
  'Chưa có kinh nghiệm',
  'Dưới 1 năm kinh nghiệm',
  '1-3 năm',
  '3-5 năm',
  'Trên 5 năm',
];

const SPECIALIZATIONS = [
  'Chăm sóc người già bị bệnh mãn tính (huyết áp, ...)',
  'Chăm sóc người già khó khăn trong vấn đề di chuyển',
  'Chăm sóc người già sau hậu phẫu thuật',
  'Chăm sóc trường hợp đặc biệt (đãng trí, khuyết tật, ...)',
  'Chăm sóc và hỗ trợ phục hồi chức năng',
];

const EQUIPMENT_OPTIONS = [
  'Sử dụng các thiết bị đo cơ bản (huyết áp, đường huyết, BMI, ...)',
  'Hỗ trợ các thiết bị sinh hoạt (xe lăn, giường bệnh đa năng, ...)',
  'Chăm sóc các vết thương',
  'Dùng máy theo dõi sức khỏe (máy theo dõi tim, ...)',
];

export default function ProfessionalSkillsSignUp({ onComplete, onBack }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [agreedToTraining, setAgreedToTraining] = useState(false);
  const [agreedToAssessment, setAgreedToAssessment] = useState(false);

  const handleSpecializationToggle = (spec) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleEquipmentToggle = (equip) => {
    setSelectedEquipment((prev) =>
      prev.includes(equip) ? prev.filter((e) => e !== equip) : [...prev, equip]
    );
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1 && !selectedExperience) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn',
        text: 'Vui lòng chọn mức độ kinh nghiệm',
        confirmButtonColor: '#22c55e',
      });
      return;
    }
    if (currentStep === 2 && selectedSpecializations.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn',
        text: 'Vui lòng chọn ít nhất một chuyên môn',
        confirmButtonColor: '#22c55e',
      });
      return;
    }
    if (currentStep === 3 && selectedEquipment.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn',
        text: 'Vui lòng chọn ít nhất một thiết bị',
        confirmButtonColor: '#22c55e',
      });
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleComplete = (e) => {
    e.preventDefault();
    if (!agreedToTraining || !agreedToAssessment) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa đồng ý',
        text: 'Vui lòng đồng ý với tất cả các cam kết',
        confirmButtonColor: '#22c55e',
      });
      return;
    }
    // Call complete handler
    console.log('Professional skills signup completed');
    Swal.fire({
      icon: 'success',
      title: 'Đăng ký thành công!',
      text: 'Chào mừng bạn trở thành Chuyên Viên Chăm Sóc của LifeEase',
      confirmButtonColor: '#22c55e',
    }).then(() => {
      onComplete?.();
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          {PROFESSIONAL_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep - 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep - 1 ? '✓' : step.id}
              </div>
              {index < PROFESSIONAL_STEPS.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 transition ${
                    index < currentStep - 1 ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={currentStep === 4 ? handleComplete : (e) => e.preventDefault()} className="space-y-8">
        {/* Step 1: Experience */}
        {currentStep >= 1 && (
          <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                {PROFESSIONAL_STEPS[0].title}
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {PROFESSIONAL_STEPS[0].description}
            </p>

            {currentStep === 1 ? (
              <div className="space-y-3">
                {EXPERIENCE_OPTIONS.map((option, idx) => (
                  <label key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition">
                    <input
                      type="radio"
                      name="experience"
                      checked={selectedExperience === option}
                      onChange={() => setSelectedExperience(option)}
                      className="w-4 h-4 text-green-500 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Đã chọn:</strong> {selectedExperience}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Specializations */}
        {currentStep >= 2 && (
          <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                {PROFESSIONAL_STEPS[1].title}
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {PROFESSIONAL_STEPS[1].description}
            </p>

            {currentStep === 2 ? (
              <div className="space-y-3">
                {SPECIALIZATIONS.map((spec, idx) => (
                  <label key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition">
                    <input
                      type="checkbox"
                      checked={selectedSpecializations.includes(spec)}
                      onChange={() => handleSpecializationToggle(spec)}
                      className="w-4 h-4 text-green-500 rounded cursor-pointer"
                    />
                    <span className="ml-3 text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {selectedSpecializations.map((spec, idx) => (
                  <div key={idx} className="p-2 bg-green-50 border border-green-200 rounded text-sm text-gray-700">
                    ✓ {spec}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Equipment */}
        {currentStep >= 3 && (
          <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                {PROFESSIONAL_STEPS[2].title}
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {PROFESSIONAL_STEPS[2].description}
            </p>

            {currentStep === 3 ? (
              <div className="space-y-3">
                {EQUIPMENT_OPTIONS.map((equip, idx) => (
                  <label key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition">
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(equip)}
                      onChange={() => handleEquipmentToggle(equip)}
                      className="w-4 h-4 text-green-500 rounded cursor-pointer"
                    />
                    <span className="ml-3 text-gray-700">{equip}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {selectedEquipment.map((equip, idx) => (
                  <div key={idx} className="p-2 bg-green-50 border border-green-200 rounded text-sm text-gray-700">
                    ✓ {equip}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                {PROFESSIONAL_STEPS[3].title}
              </h2>
            </div>

            {/* Training Agreement */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <p className="text-sm font-semibold text-gray-800">
                Bạn cần tham gia khóa đào tạo nghiệp vụ để có thể bắt đầu trở thành Chuyên Viên chăm sóc của LifeEase
              </p>
              <label className="flex items-center p-3 border border-blue-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition">
                <input
                  type="checkbox"
                  checked={agreedToTraining}
                  onChange={(e) => setAgreedToTraining(e.target.checked)}
                  className="w-4 h-4 text-green-500 rounded cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Có, Tôi đồng ý tham gia khóa đào tạo
                </span>
              </label>
            </div>

            {/* Assessment Agreement */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <p className="text-sm font-semibold text-gray-800">
                Bạn có cam kết tham gia và hoàn thành bài kiểm tra đánh giá không?
              </p>
              <label className="flex items-center p-3 border border-blue-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition">
                <input
                  type="checkbox"
                  checked={agreedToAssessment}
                  onChange={(e) => setAgreedToAssessment(e.target.checked)}
                  className="w-4 h-4 text-green-500 rounded cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Có, Tôi cam kết hoàn thành
                </span>
              </label>
            </div>

            {/* Important Note */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Lưu ý:</strong> Các thông tin chuyên môn sẽ được kiểm duyệt và thông báo cho bạn sau khóa đào tạo
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={currentStep === 1 ? onBack : handlePrevStep}
            className="px-6 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {currentStep === 1 ? 'Quay lại' : 'Quay lại'}
          </button>
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
            >
              Tiếp tục
            </button>
          ) : (
            <button
              type="submit"
              disabled={!agreedToTraining || !agreedToAssessment}
              className={`px-6 py-2 text-white transition rounded-lg ${
                agreedToTraining && agreedToAssessment
                  ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Hoàn tất đăng ký
            </button>
          )}
        </div>
      </form>
    </div>
  );
}