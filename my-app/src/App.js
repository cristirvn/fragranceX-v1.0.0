import React, { useState } from 'react';
import './App.css';
import api from './api';

function App() {
  const [fragranceName, setFragranceName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await api.post('/scrape', { name: fragranceName });
      setResult(response.data);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-box">
        <h1>Find Your Fragrance Deal 💎</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={fragranceName}
            onChange={(e) => setFragranceName(e.target.value)}
            placeholder="Enter fragrance name..."
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && <p>Loading... please wait</p>}

        {error && <p className="error-message">{error}</p>}

        {result && (
          <div className="result-container">
            {result.message ? (
              <p>{result.message}</p>
            ) : (
              <div>
                <h2>Best Price Found! 🛍️</h2>
                <p>
                  **Price:** {result.price} RON
                </p>
                <p>
                  **Site:** {result.site}
                </p>
                <p>
                  **Volume:** {result.ml} ml
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;