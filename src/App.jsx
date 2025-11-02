import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Payment from './pages/Payment'
import Admin from './pages/Admin'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
    return (
        <div className="min-h-screen gradient-bg">
            <Header />
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </AnimatePresence>
            <Footer />
        </div>
    )
}

export default App