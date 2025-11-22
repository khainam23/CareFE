import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ProcessStep = ({ step, index }) => {
  const ref = useScrollAnimation('animate__fadeInUp');

  return (
    <div
      ref={ref}
      className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-200 last:border-b-0"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {index % 2 === 0 ? (
        <>
          <div className="flex-shrink-0 md:w-1/3">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h6 className="text-lg font-bold text-teal-600 mb-2">
              {step.number}. {step.title}
            </h6>
            <p className="text-gray-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="md:w-2/3">
            <h6 className="text-lg font-bold text-teal-600 mb-2">
              {step.number}. {step.title}
            </h6>
            <p className="text-gray-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
          <div className="flex-shrink-0 md:w-1/3">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProcessStep;
