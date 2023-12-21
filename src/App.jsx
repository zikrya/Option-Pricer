import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MonteCarlo from './pages/MonteCarlo';
import BlackScholes from './pages/BlackScholes';
import BinomialOptions from './pages/BinomialOptions';
function App() {


  return (
    <>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/monte-carlo-simulation" element={<MonteCarlo/>} />
            <Route exact path="/black-scholes-simulation" element={<BlackScholes/>} />
            <Route exact path="/binomial-option-simulation" element={<BinomialOptions/>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
