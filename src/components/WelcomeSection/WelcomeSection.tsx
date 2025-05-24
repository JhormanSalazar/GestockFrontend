export default function WelcomeSection() {
  return (
    <section className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-screen-md mx-auto flex flex-col gap-12 text-center">
        {/* Título principal */}
        <div>
          <h2 className="text-4xl font-bold mb-2">Gestock</h2>
          <p className="text-lg text-gray-300">
            ¡Automatiza tu inventario, impulsa tu negocio!
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
            Empieza ahora
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition">
            Sobre nosotros
          </button>
        </div>

        {/* Carrusel de marcas */}
        <div>{/* BrandCarousel aquí */}</div>

        {/* Sección descriptiva principal */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">
            Descubre la forma de hacer más
          </h3>
          <p className="text-gray-300 max-w-md mx-auto">
            Administra tu inventario en tiempo real, optimiza tus recursos y ten
            el control total de tus productos desde cualquier lugar. ¡Eficiencia y
            organización en un solo clic!
          </p>
        </div>

        {/* Sección: Gestionar productos */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">
            Transforma tu manera de gestionar productos.
          </h3>
          <p className="text-gray-300 max-w-md mx-auto">
            Optimiza y controla tu inventario como nunca antes. Con nuestra
            aplicación, gestionar productos es más fácil, rápido y eficiente,
            permitiéndote tomar mejores decisiones en todo momento.
          </p>
        </div>

        {/* Sección: Todo en un lugar */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">
            Todo lo que necesitas, en un solo lugar.
          </h3>
          <p className="text-gray-300 max-w-md mx-auto">
            Optimiza la gestión de tu inventario con una plataforma integral.
            Controla el stock en tiempo real, registra entradas y salidas y
            genera reportes detallados.
          </p>
        </div>
      </div>
    </section>
  );
}
