import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

const BinomialOptions = () => {
    const [inputs, setInputs] = useState({
        stockPrice: '',
        strikePrice: '',
        volatility: '',
        riskFreeRate: '',
        timeToExpiration: '',
        dividendYield: '',
        steps: ''
    });
    const [result, setResult] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setResult(null);
        setChartData(null);
        setLoading(true);

        try {
            // Fetch the option prices for a range of stock prices
            const response = await fetch('http://localhost:8020/binomial-option-chart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    minStockPrice: parseFloat(inputs.stockPrice) - 20,
                    maxStockPrice: parseFloat(inputs.stockPrice) + 20,
                    strikePrice: parseFloat(inputs.strikePrice),
                    volatility: parseFloat(inputs.volatility),
                    riskFreeRate: parseFloat(inputs.riskFreeRate),
                    timeToExpiration: parseFloat(inputs.timeToExpiration),
                    dividendYield: parseFloat(inputs.dividendYield),
                    steps: parseInt(inputs.steps, 10)
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Prepare data for the chart
            const chartData = {
                labels: data.map(item => item.stockPrice.toFixed(2)),
                datasets: [{
                    label: 'Call Option Price',
                    data: data.map(item => item.callPrice),
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 2,
                }],
            };
            setChartData(chartData);
        } catch (error) {
            console.error("There was an error!", error);
            setError('Failed to calculate option prices. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold text-center mb-4">Binomial Options Pricing Model</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    name="stockPrice"
                    value={inputs.stockPrice}
                    onChange={handleChange}
                    placeholder="Stock Price"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="strikePrice"
                    value={inputs.strikePrice}
                    onChange={handleChange}
                    placeholder="Strike Price"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="volatility"
                    value={inputs.volatility}
                    onChange={handleChange}
                    placeholder="Volatility (σ)"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="riskFreeRate"
                    value={inputs.riskFreeRate}
                    onChange={handleChange}
                    placeholder="Risk-Free Rate (r)"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="timeToExpiration"
                    value={inputs.timeToExpiration}
                    onChange={handleChange}
                    placeholder="Time to Expiration (years)"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="dividendYield"
                    value={inputs.dividendYield}
                    onChange={handleChange}
                    placeholder="Dividend Yield (q)"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="steps"
                    value={inputs.steps}
                    onChange={handleChange}
                    placeholder="Number of Steps"
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Calculating...' : 'Calculate Option Price'}
                </button>
            </form>
            {result && (
                <div className="mt-4">
                    <p className="text-lg">Call Option Price: {result.callPrice}</p>
                </div>
            )}
            {chartData && (
                <div className="mt-4">
                    <Line data={chartData} />
                </div>
            )}

            {error && (
                <div className="mt-4 text-red-500">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default BinomialOptions;
