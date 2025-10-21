import image_svg_29 from '@assets/images/image 29.svg';
import Header from '@components/layout/Header'

export default function Page({ components }) {
  return (
    <div className="container">
      <div>
        <img src={image_svg_29} alt="Ảnh nền" />
        <div>
          <Header />
        </div>
        <div>{components}</div>
      </div>
    </div>
  );
}
