import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MonteCarlo from './pages/MonteCarlo';
import BlackScholes from './pages/BlackScholes';
function App() {


  return (
    <>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/monte-carlo-simulation" element={<MonteCarlo/>} />
            <Route exact path="/black-scholes-simulation" element={<BlackScholes/>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
