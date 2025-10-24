import image_svg_16 from '@assets/images/image 16.svg';
import logo from '@assets/images/Logo.svg';

export default function Box({ components, title }) {
  return (
    <div 
      className="flex justify-center w-full h-full bg-image align-center"
      style={{ backgroundImage: `url(${image_svg_16})` }}
    >
      {/* Lớp nội dung phía trước */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        <img src={logo} alt="Logo" className="w-24 h-auto mb-4" />
        <h1 className="mb-6 text-2xl font-bold">{title}</h1>
        <div>{components}</div>
      </div>
    </div>
  );
}
