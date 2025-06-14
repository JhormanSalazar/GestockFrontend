import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faXTwitter} from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 md:py-10 mt-auto">
      <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-8 lg:gap-x-45 w-full text-sm text-gray-800 max-w-7xl mx-auto">
        {/* 1ra columna */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-xs mx-auto md:mx-0">
          <section>
            <h2 className="font-semibold text-base mb-2">Sobre Nosotros</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
              alias sunt ut blanditiis dolorem dolores cum?
            </p>
          </section>
          <nav>
            <h2 className="font-semibold text-base mb-2">Enlaces útiles</h2>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a href="#" className="hover:underline inline">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline inline">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* 2da columna */}
        <div className="flex flex-col items-center md:items-start gap-4 max-w-xs mx-auto md:mx-0">
          <section>
            <h2 className="font-semibold text-base mb-2">Redes Sociales</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <FontAwesomeIcon
                  icon={faFacebook}
                  style={{ color: "#006ec2" }}
                  beat
                  size="lg"
                />
                <a className="hover:text-blue-600 mx-2 cursor-pointer">
                  Facebook
                </a>
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faInstagram}
                  beat
                  size="lg"
                  style={{ color: "#E4405F" }}
                />
                <a className="hover:text-[#E4405F] mx-2 cursor-pointer">
                  Instagram
                </a>
              </li>
              <li>
                <FontAwesomeIcon icon={faXTwitter} beat size="lg" />
                <a className="hover:text-gray-500 mx-2 cursor-pointer">
                  Twitter
                </a>
              </li>
            </ul>
          </section>

          <section className="text-center md:text-left">
            <h2 className="font-semibold text-base mb-2">Contacto</h2>
            <p>Email: gestock@correo.com</p>
            <p>Teléfono: +57 123 456 7890</p>
            <p>Dirección: Calle 12, Medellín, Colombia</p>
          </section>
        </div>

        {/* 3ra columna */}
        <div className="flex items-center justify-center text-center max-w-xs mx-auto lg:mx-0 w-full">
          <p className="text-sm">
            &copy; 2025 Gestock. <br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
