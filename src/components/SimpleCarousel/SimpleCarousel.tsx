import { useState, useEffect } from "react";
import Slide from "../Slide/Slide";
import styles from "./SimpleCarousel.module.css";

const slidesData = [
  {
    id: 1,
    title: "Descubre la forma de hacer más",
    text: "Administra tu inventario en tiempo real, optimiza tus recursos y ten el control total de tus productos desde cualquier lugar.",
    className: styles["img-bg-descubre"],
  },
  {
    id: 2,
    title: "Transforma tu manera de gestionar productos.",
    text: "Optimiza y controla tu inventario como nunca antes. Gestionar productos es más fácil, rápido y eficiente.",
    className: styles["img-bg-transforma"],
  },
  {
    id: 3,
    title: "Todo lo que necesitas, en un solo lugar.",
    text: "Controla el stock en tiempo real, registra entradas y salidas, y genera reportes detallados.",
    className: styles["img-bg-optimiza"],
  },
];

export default function SimpleCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slidesData.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slidesData.length) % slidesData.length);

  // Autoplay cada 4 segundos (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[28rem] overflow-hidden rounded-lg">
      {slidesData.map((slide, index) => (
        <Slide
          key={slide.id}
          title={slide.title}
          text={slide.text}
          className={slide.className}
          visible={index === current}
        />
      ))}

      {/* Botón anterior */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-md p-2 z-20"
        aria-label="Anterior"
      >
        ⬅
      </button>

      {/* Botón siguiente */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-md p-2 z-20"
        aria-label="Siguiente"
      >
        ➡
      </button>
    </div>
  );
}
