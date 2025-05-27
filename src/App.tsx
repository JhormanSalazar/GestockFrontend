import Footer from "./components/Footer/Footer";
import AppHeader from "./components/Header/AppHeader"
import WelcomeSection from "./components/WelcomeSection/WelcomeSection"

function App() {

  return (
    <>
      <AppHeader /> {/* mostrar el header en toda las secciones */}
        <main>
          <section className="pt-32">
            <WelcomeSection />
          </section>
        </main>
      <Footer />
    </>
  );
}

export default App
