import React, { useState } from 'react';
import './App.css';
import api from './api';

// Sample data for fragrance brands and their specific fragrances
// In a real application, you might fetch this from a database/API
const fragranceData = {
  // Niche / High-End Brands
  "Xerjoff": ["Naxos", "Erba Pura", "Alexandria II", "Renaissance", "40 Knots", "Uden"],
  "Creed": ["Aventus", "Green Irish Tweed", "Silver Mountain Water", "Millésime Impérial", "Royal Oud"],
  "Parfums de Marly": ["Layton", "Herod", "Pegasus", "Carlisle", "Sedley", "Greenley"],
  "Maison Francis Kurkdjian": ["Baccarat Rouge 540", "Grand Soir", "Gentle Fluidity Silver", "Oud Satin Mood", "Amyris Homme"],
  "By Kilian": ["Angels' Share", "Black Phantom", "Straight to Heaven", "Love, Don't Be Shy", "Intoxicated"],
  "Mancera": ["Cedrat Boise", "Red Tobacco", "Instant Crush", "Aoud Lemon Mint", "Roses Vanille"],
  
  // Designer Brands
  "Tom Ford": ["Oud Wood", "Tobacco Vanille", "Black Orchid", "Ombré Leather", "Tuscan Leather", "Noir Extreme"],
  "Dior": ["Sauvage", "Fahrenheit", "Homme Intense", "J'adore", "Miss Dior"],
  "Chanel": ["Bleu de Chanel", "Allure Homme Sport", "No. 5", "Coco Mademoiselle", "Chance Eau Tendre"],
  "Giorgio Armani": ["Acqua di Gio", "Si", "My Way", "Code", "Stronger With You"],
  "Yves Saint Laurent": ["La Nuit de L'Homme", "Y", "Libre", "Black Opium", "Tuxedo"],
  "Guerlain": ["L'Homme Idéal", "Shalimar", "Mon Guerlain", "Vetiver", "Habit Rouge"],
  "Prada": ["L'Homme", "Luna Rossa Carbon", "Paradoxe", "Amber Pour Homme", "Luna Rossa Ocean"],
  "Versace": ["Eros", "Dylan Blue", "Bright Crystal", "Pour Homme", "Crystal Noir"],
  "Paco Rabanne": ["1 Million", "Invictus", "Phantom", "Lady Million", "Olympea"],
  "Jean Paul Gaultier": ["Le Male", "Scandal", "Ultra Male", "La Belle", "Le Beau"],
  "Dolce & Gabbana": ["Light Blue", "The One", "K", "Q", "Pour Homme Intenso"],
  "Carolina Herrera": ["Good Girl", "Bad Boy", "212 Men", "CH Men Privé"],

  // Clone / Affordable Brands
  "Afnan": ["9 PM", "Supremacy Not Only Intense", "Turathi Blue", "Modest Une", "Supremacy in Heaven"],
  "Lattafa": ["Asad", "Khamrah", "Oud for Glory (Bade'e Al Oud)", "Ramz Silver", "Fakhar"],
  "Armaf": ["Club de Nuit Intense Man", "Club de Nuit Sillage", "Club de Nuit Milestone", "Tres Nuit", "Club de Nuit Untold"]
};

function App() {
  // State for each input field
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedFragrance, setSelectedFragrance] = useState('');
  const [fragranceType, setFragranceType] = useState('EDP'); // Default to EDP
  const [volume, setVolume] = useState('');

  // State for API response and loading/error handling
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handler for brand selection. Resets the fragrance when the brand changes.
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedFragrance(''); // Reset fragrance selection
    setResult(null); // Clear previous results
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBrand || !selectedFragrance || !volume) {
      setError('Please fill out all fields.');
      return;
    }
    setLoading(true);
    setResult(null);
    setError('');

    try {
      // Construct the full fragrance name for the API
      const fullFragranceName = `${selectedBrand} ${selectedFragrance}`;
      
      // The payload must match the backend's `FragranceRequest` model
      const requestData = {
        name: fullFragranceName,
        type: fragranceType.toLowerCase(), // API expects "edt" or "edp"
        ml: parseInt(volume, 10)
      };

      const response = await api.post('/scrape', requestData);
      setResult(response.data);
    } catch (err) {
      setError('An error occurred. The requested fragrance may not be available.');
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-box">
        <h1>Find Your Fragrance Deal 💎</h1>
        <form onSubmit={handleSubmit}>
          {/* Brand Dropdown */}
          <select value={selectedBrand} onChange={handleBrandChange} required>
            <option value="" disabled>-- Select a Brand --</option>
            {Object.keys(fragranceData).map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Fragrance Dropdown - enabled only after a brand is selected */}
          <select 
            value={selectedFragrance} 
            onChange={(e) => setSelectedFragrance(e.target.value)} 
            disabled={!selectedBrand}
            required
          >
            <option value="" disabled>-- Select a Fragrance --</option>
            {selectedBrand && fragranceData[selectedBrand].map(fragrance => (
              <option key={fragrance} value={fragrance}>{fragrance}</option>
            ))}
          </select>

          {/* Fragrance Type (EDP/EDT) Dropdown */}
          <select value={fragranceType} onChange={(e) => setFragranceType(e.target.value)} required>
            <option value="EDP">Eau de Parfum (EDP)</option>
            <option value="EDT">Eau de Toilette (EDT)</option>
          </select>

          {/* Volume Input */}
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="Enter volume (e.g., 100)"
            required
          />

          <button type="submit" disabled={loading || !selectedFragrance}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && <p className="loading-message">Loading... please wait</p>}

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
                  **Site:** <a href={result.url} target="_blank" rel="noopener noreferrer">{result.site}</a>
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