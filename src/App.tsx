import { Route, Routes } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import Cursor from './components/Cursor'
import Home from './pages/Home'
import ServicePage from './pages/ServicePage'
import { usePageMotion } from './hooks/use-page-motion'
import './App.css'

export default function App() {
  usePageMotion()
  return (
    <>
      <Cursor />
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:id" element={<ServicePage />} />
        </Routes>
      </main>
      <ChatBot />
      <Footer />
    </>
  )
}
