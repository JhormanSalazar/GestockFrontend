import SimpleCarousel from "../SimpleCarousel/SimpleCarousel";

export default function WelcomeSection() {
  const fondoHexagonos = {
  backgroundColor: "#111827", // gris oscuro (bg-gray-900)
  backgroundImage: `
    linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.2), rgba(255,255,255,0)), 
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%236b7280' fill-opacity='0.12' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
  `,
  backgroundRepeat: "repeat",
  backgroundSize: "auto",
};




  return (
    <section className="bg-gray-900 text-white px-6 py-12" style={fondoHexagonos}>
      <div className="max-w-screen-lg mx-auto flex flex-col gap-12 text-center">

        <div>
          
        </div>
        {/* Título principal */}
        <div>
          <h2 className="text-4xl font-bold mb-2">GESTOR DE INVENTARIOS</h2>
          <p className="text-lg text-gray-300">
            ¡Automatiza tu inventario, impulsa tu negocio!
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full hover:cursor-pointer">
            Empieza ahora
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition hover:cursor-pointer">
            Sobre nosotros
          </button>
        </div>

        {/* Carrusel de marcas <div> BrandCarousel aquí </div>*/}

        
        {/* Carousel de servicios */}
        <SimpleCarousel/>
      </div>
    </section>
  );
}
