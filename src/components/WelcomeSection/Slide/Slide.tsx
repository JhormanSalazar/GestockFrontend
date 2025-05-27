type SlideProps = {
  title: string;
  text: string;
  className: string;
  visible: boolean;
};

const Slide = ({ title, text, className, visible } : SlideProps) => {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1200 ease-in-out
        ${visible ? "opacity-100 z-10" : "opacity-0 z-0"}
        ${className} flex flex-col items-center justify-center text-center text-white p-4`}
    >
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="max-w-md mx-auto text-gray-200">{text}</p>
      
      <a href="" className="mt-12 bg-gray-100 hover:bg-gray-200 text-black p-3 rounded-full cursor-pointer text-sm transition-all duration-300 transform hover:scale-105">
        Más información
      </a>
    </div>
  );
};

export default Slide;