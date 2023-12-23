import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

const BlackScholes = () => {
    const [inputs, setInputs] = useState({
        stockPrice: '',
        strikePrice: '',
        volatility: '',
        riskFreeRate: '',
        timeToExpiration: '',
        spaceSteps: '100',
        timeSteps: '100',
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
            const response = await fetch('http://localhost:8020/option-fdm-chart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    minStockPrice: parseFloat(inputs.stockPrice) - 20,
                    maxStockPrice: parseFloat(inputs.stockPrice) + 20,
                    stockPrice: parseFloat(inputs.stockPrice),
                    strikePrice: parseFloat(inputs.strikePrice),
                    volatility: parseFloat(inputs.volatility),
                    riskFreeRate: parseFloat(inputs.riskFreeRate),
                    timeToExpiration: parseFloat(inputs.timeToExpiration),
                    spaceSteps: parseInt(inputs.spaceSteps, 10),
                    timeSteps: parseInt(inputs.timeSteps, 10),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { prices, specificCallPrice } = await response.json();

            setResult({ callPrice: specificCallPrice });

            const chartData = {
                labels: prices.map(item => item.stockPrice.toFixed(2)),
                datasets: [{
                    label: 'Call Option Price',
                    data: prices.map(item => item.callPrice),
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
            <h1 className="text-xl font-bold text-center mb-4">Finite Difference Model</h1>
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
                    placeholder="Time to Expiration (T in years)"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="spaceSteps"
                    value={inputs.spaceSteps}
                    onChange={handleChange}
                    placeholder="Space Steps (Asset Price Grid)"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="timeSteps"
                    value={inputs.timeSteps}
                    onChange={handleChange}
                    placeholder="Time Steps (Time Grid)"
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
            {result && result.callPrice != null && (
                <div className="mt-4">
                    <p className="text-lg">Call Option Price at Stock Price {inputs.stockPrice}: {result.callPrice.toFixed(2)}</p>
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

export default BlackScholes;

