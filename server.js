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
  function americanCallOptionFDM(S, K, T, r, sigma, M, N) {
    const Smax = 4 * S; // Increasing the stock price range to 4 times the current stock price
    const dt = T / M; // Time step size
    const ds = Smax / N; // Stock price step size
    let V = Array.from({ length: N + 1 }, () => Array(M + 1).fill(0));

    // Initial condition at maturity (payoff of the option)
    for (let i = 0; i <= N; i++) {
      V[i][M] = Math.max(i * ds - K, 0);
    }

    // Boundary conditions
    for (let j = 0; j <= M; j++) {
      V[0][j] = 0; // Value is 0 when the stock price is 0
      V[N][j] = Smax - K * Math.exp(-r * (T - j * dt)); // Value when the stock price is at Smax
    }

    // Iterate over the grid backwards in time
    for (let j = M - 1; j >= 0; j--) {
      for (let i = 1; i < N; i++) {
        const deltaPlus = V[i + 1][j + 1] - V[i][j + 1];
        const deltaMinus = V[i][j + 1] - V[i - 1][j + 1];
        const deltaSquared = V[i + 1][j + 1] - 2 * V[i][j + 1] + V[i - 1][j + 1];

        // Calculate the value at this grid point
        let value = V[i][j + 1] + dt * (0.5 * sigma * sigma * i * i * deltaSquared / (ds * ds) + r * i * deltaMinus / ds - r * V[i][j + 1]);

        // Enforce the early exercise condition
        V[i][j] = Math.max(value, i * ds - K);
      }
    }

    // Option price is the value at the grid point corresponding to the current asset price
    return V[Math.round(S / ds)][0];
  }



  /// Connections

  /// Monte Carlo
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
////// Black Scholes
app.post('/american-option-fdm', (req, res) => {
    try {
      const { stockPrice, strikePrice, timeToExpiration, riskFreeRate, volatility, spaceSteps, timeSteps } = req.body;

      if (!stockPrice || !strikePrice || !volatility || !riskFreeRate || !timeToExpiration || !spaceSteps || !timeSteps) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Parse the inputs to ensure they are numbers
      const parsedStockPrice = parseFloat(stockPrice);
      const parsedStrikePrice = parseFloat(strikePrice);
      const parsedVolatility = parseFloat(volatility);
      const parsedRiskFreeRate = parseFloat(riskFreeRate);
      const parsedTimeToExpiration = parseFloat(timeToExpiration);
      const parsedSpaceSteps = parseInt(spaceSteps, 10);
      const parsedTimeSteps = parseInt(timeSteps, 10);

      // Call the FDM function for the American option with parsed inputs
      const callPrice = americanCallOptionFDM(parsedStockPrice, parsedStrikePrice, parsedTimeToExpiration, parsedRiskFreeRate, parsedVolatility, parsedTimeSteps, parsedSpaceSteps);

      res.json({ callPrice });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error calculating option price' });
    }
  });


  const PORT = 8020;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});