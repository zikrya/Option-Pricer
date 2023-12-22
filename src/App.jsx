import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MonteCarlo from './pages/MonteCarlo';
import BlackScholes from './pages/BlackScholes';
import BinomialOptions from './pages/BinomialOptions';
import NavBar from './components/NavBar';
function App() {


  return (
    <>
        <Router>
          <NavBar/>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/monte-carlo-simulation" element={<MonteCarlo/>} />
            <Route exact path="/finite-difference-simulation" element={<BlackScholes/>} />
            <Route exact path="/binomial-option-simulation" element={<BinomialOptions/>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
