import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

//////// Monte Carlo Calculations
function boxMullerTransform() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  // The Monte Carlo simulation function for option pricing
  function monteCarloSim(stockPrice, strikePrice, volatility, riskFreeRate, timeToExpiration, simulations) {
    let callPayoffs = 0;
    let putPayoffs = 0;
    const dt = timeToExpiration / 252; // Assuming 252 trading days in a year
    const discountFactor = Math.exp(-riskFreeRate * timeToExpiration);

    for (let i = 0; i < simulations; i++) {
      let pathPrice = stockPrice;

      // Generate path
      for (let t = 0; t < 252 * timeToExpiration; t++) {
        const normRandom = boxMullerTransform();
        pathPrice *= Math.exp((riskFreeRate - 0.5 * volatility * volatility) * dt + volatility * Math.sqrt(dt) * normRandom);
      }

      // Calculate payoffs for call and put
      callPayoffs += Math.max(pathPrice - strikePrice, 0);
      putPayoffs += Math.max(strikePrice - pathPrice, 0);
    }

    // Average the payoffs
    const avgCallPayoff = callPayoffs / simulations;
    const avgPutPayoff = putPayoffs / simulations;

    // Discount the average payoffs to get present value
    const callPrice = discountFactor * avgCallPayoff;
    const putPrice = discountFactor * avgPutPayoff;

    return { callPrice, putPrice };
  }

  ////////// Black Scholes Calculations
  app.post('/monte-carlo', (req, res) => {
    try {
      const { stockPrice, strikePrice, volatility, riskFreeRate, timeToExpiration, simulations } = req.body;

      // Ensure all parameters are present and valid
      if (!stockPrice || !strikePrice || !volatility || !riskFreeRate || !timeToExpiration || !simulations) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Parse the inputs to ensure they are numbers
      const parsedStockPrice = parseFloat(stockPrice);
      const parsedStrikePrice = parseFloat(strikePrice);
      const parsedVolatility = parseFloat(volatility);
      const parsedRiskFreeRate = parseFloat(riskFreeRate);
      const parsedTimeToExpiration = parseFloat(timeToExpiration);
      const parsedSimulations = parseInt(simulations, 10);

      // Call the simulation function with parsed inputs
      const results = monteCarloSim(parsedStockPrice, parsedStrikePrice, parsedVolatility, parsedRiskFreeRate, parsedTimeToExpiration, parsedSimulations);

      // Send the results
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error during simulation' });
    }
});

  const PORT = 8020;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});