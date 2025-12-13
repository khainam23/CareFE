import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import image54 from '@/assets/images/image 54.svg';

const ServiceCard = ({ service, index }) => {
  const ref = useScrollAnimation(index % 2 === 0 ? 'animate__fadeInLeft' : 'animate__fadeInRight');

  return (
    <div
      ref={ref}
      className="relative group overflow-hidden rounded-lg h-80"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <img
        src={image54}
        alt={service.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
      <div className={`absolute text-white inset-x-0 px-4 pb-6  flex flex-col ${index % 2 === 0 ? 'justify-end' : 'justify-start'} h-full`}>
        <h6 className="text-lg font-bold mb-2">{service.title}</h6>
        <p className="text-sm leading-relaxed">{service.description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
