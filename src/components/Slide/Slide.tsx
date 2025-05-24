import React from "react";
import { type SlideProps } from "../../types";


const Slide: React.FC<SlideProps> = ({ title, text, className, visible }) => {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1200 ease-in-out
        ${visible ? "opacity-100 z-10" : "opacity-0 z-0"}
        ${className} flex flex-col items-center justify-center text-center text-white p-4`}
    >
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="max-w-md mx-auto text-gray-200">{text}</p>
    </div>
  );
};

export default Slide;