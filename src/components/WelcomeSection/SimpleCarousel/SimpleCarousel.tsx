import { useState, useEffect } from "react";
import Slide from "../Slide/Slide";
import styles from './SimpleCarousel.module.css';
import { slidesData } from "../../../data/slides";

export default function SimpleCarousel() {

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slidesData.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slidesData.length) % slidesData.length);

  // Autoplay cada 4 segundos 
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[28rem] overflow-hidden rounded-lg">
      
      {slidesData.map((slide, index) => (
        <Slide
          key={slide.id}
          title={slide.title}
          text={slide.text}
          className={styles[slide.className]}
          visible={index === current}
        />
      ))}

      {/* Botón anterior */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-md p-2 z-20 cursor-pointer"
        aria-label="Anterior"
      >
        ⬅
      </button>

      {/* Botón siguiente */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-md p-2 z-20 cursor-pointer"
        aria-label="Siguiente"
      >
        ➡
      </button>
    </div>
  );
}
