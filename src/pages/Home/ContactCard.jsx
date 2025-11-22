import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ContactCard = ({ icon: Icon, title, text, link, linkText, isAddress }) => {
  const ref = useScrollAnimation('animate__fadeInUp');

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
        <Icon className="text-green-600" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-3">
        {text}
      </p>
      {isAddress ? (
        <p className="text-center text-gray-700 font-medium">
          {linkText.split('<br/>').map((line, i) => (
            <span key={i}>
              {line}
              {i < linkText.split('<br/>').length - 1 && <br />}
            </span>
          ))}
        </p>
      ) : (
        <a
          href={link}
          className="block text-center text-green-600 font-semibold hover:text-green-700 break-all"
        >
          {linkText}
        </a>
      )}
    </div>
  );
};

export default ContactCard;
