import React, { useState } from 'react';

const BlackScholes = () => {
    const [inputs, setInputs] = useState({
        stockPrice: '',
        strikePrice: '',
        volatility: '',
        riskFreeRate: '',
        timeToExpiration: '',
        spaceSteps: '100',  // Default value for space grid steps
        timeSteps: '100',   // Default value for time grid steps
    });
    const [result, setResult] = useState(null);
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
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8020/american-option-fdm', {
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
            setError('Failed to calculate option price. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold text-center mb-4">Black-Scholes Model</h1>
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
            {result && (
                <div className="mt-4">
                    <p className="text-lg">Call Option Price: {result.callPrice}</p>
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

