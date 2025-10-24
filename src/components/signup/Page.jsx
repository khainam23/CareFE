import image_svg_29 from '@assets/images/image 29.svg';
import Header from '@components/layout/Header';

export default function Page({ components }) {
  return (
    <div 
      className="flex justify-center w-full h-full bg-image align-center"
      style={{ backgroundImage: `url(${image_svg_29})` }}
    >
      {/* Nội dung phía trên */}
      <div className="relative z-10 flex flex-col w-full min-h-screen">
        <Header />

        <main className="flex-grow p-8">
          {components}
        </main>
      </div>
    </div>
  );
}
