import AppHeader from "./components/Header/AppHeader"
import WelcomeSection from "./components/WelcomeSection/WelcomeSection"

function App() {

  return (
    <main>
      <AppHeader />
      <section className="pt-32">
      <WelcomeSection />
      </section>
    </main>
  )
}

export default App
