import image_svg_16 from '@assets/images/image 16.svg';
import logo from '@assets/images/Logo.svg';

export default function Box({ components, title }) {
  return (
    <div className="container">
      <div>
        <img src={image_svg_16} alt="Ảnh nền" />
        <div>
          <img src={logo} alt="Logo" />
          <h1>{title}</h1>
        </div>
        <div>{components}</div>
      </div>
    </div>
  );
}
