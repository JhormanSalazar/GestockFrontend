import Footer from "./components/Footer/Footer";
import AppHeader from "./components/Header/AppHeader"
import WelcomeSection from "./views/WelcomeSection"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow">
        <section className="pt-32">
          <WelcomeSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App
