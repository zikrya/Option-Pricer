import React, { useState } from 'react';

const MonteCarlo = () => {
    const [inputs, setInputs] = useState({
        stockPrice: '',
        strikePrice: '',
        volatility: '',
        riskFreeRate: '',
        timeToExpiration: '',
        simulations: 10000,
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, valueAsNumber, value } = event.target;
        setInputs({
            ...inputs,
            [name]: valueAsNumber || value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8020/monte-carlo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("There was an error!", error);
            setError('Failed to run simulation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-4xl text-center font-bold mb-8">Monte Carlo Simulation</h1>
                </div>
                <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="number" name="stockPrice" value={inputs.stockPrice} onChange={handleChange}
                               className="w-full p-2 border border-gray-300 rounded mt-1"
                               placeholder="Stock Price" />
                        <input type="number" name="strikePrice" value={inputs.strikePrice} onChange={handleChange}
                               className="w-full p-2 border border-gray-300 rounded mt-1"
                               placeholder="Strike Price" />
                        <input type="number" name="volatility" value={inputs.volatility} onChange={handleChange}
                               className="w-full p-2 border border-gray-300 rounded mt-1"
                               placeholder="Volatility" />
                        <input type="number" name="riskFreeRate" value={inputs.riskFreeRate} onChange={handleChange}
                               className="w-full p-2 border border-gray-300 rounded mt-1"
                               placeholder="Risk-Free Rate" />
                        <input type="number" name="timeToExpiration" value={inputs.timeToExpiration} onChange={handleChange}
                               className="w-full p-2 border border-gray-300 rounded mt-1"
                               placeholder="Time to Expiration" />
                        <input type="number" name="simulations" value={inputs.simulations} onChange={handleChange}
                               className="w-full p-2 border border-gray-300 rounded mt-1"
                               placeholder="Simulations" />

                        <button type="submit"
                                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded-md text-white text-lg">
                            Run Simulation
                        </button>
                    </form>
                </div>
                {result && (
                    <div className="max-w-md w-full mx-auto mt-8 bg-white p-8 border border-gray-300">
                        <p className="text-lg">Call Price: <span className="font-semibold">{result.callPrice.toFixed(2)}</span></p>
                        <p className="text-lg">Put Price: <span className="font-semibold">{result.putPrice.toFixed(2)}</span></p>
                    </div>
                )}
            </div>
        </>
    );

};

export default MonteCarlo;
