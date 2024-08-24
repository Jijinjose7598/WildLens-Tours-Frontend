import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import { FaFilter } from 'react-icons/fa';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [schedule, setSchedule] = useState('');
  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Function to parse the searchTerm into individual filters
  const parseSearchTerm = (term) => {
    // Assume format: "Location|Budget|Schedule"
    const parts = term.split('|').map(part => part.trim());

    // Update state with parsed values
    setLocation(parts[0] || '');
    setBudget(parts[1] || '');
    setSchedule(parts[2] || '');
  };

  const handleSearch = async () => {
    try {
      // Convert budget to number if it's not empty
      const params = {
        location,
        budget: budget ? Number(budget) : undefined,
        schedule,
      };

      console.log('Searching with params:', params);

      const response = await axios.get('https://wildlens-tours-backend-q5lv.onrender.com/api/tours/search', {
        params,
      });

      console.log('Search results:', response.data);

      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('Error fetching search results');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setLocation('');
    setBudget('');
    setSchedule('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text "
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search tours (Location)"
          className="search-input"
        />
           <input
          type="number "
          value={budget}
         onChange={(e) => setBudget(e.target.value)}
          placeholder="Search tours (Budget)"
          className="search-input"
        />
           <input
          type="text "
          value={schedule}
         onChange={(e) => setSchedule(e.target.value)}
          placeholder="Search tours (Location|Budget|Schedule)"
          className="search-input"
        />
        <button onClick={handleSearch} className="btn btn-primary">Search</button>
       
        
      </div>
      <div className='filter ' style={{marginLeft:"1200px"}}>
        <button onClick={toggleFilters} className="filter-icon-btn"  style={{ borderRadius:"8px",border:"none"}}>
          <FaFilter size={24} />
        </button>
        </div>

      <div className="content-wrapper">
        {showFilters && (
          <div className="filter-sidebar">
            <h2>Filters</h2>
            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Budget</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Schedule</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-buttons">
              <button onClick={handleSearch} className="btn btn-primary" style={{marginRight:"10px"}}>Apply</button>
              <button onClick={handleClear} className="btn btn-secondary">Clear</button>
            </div>
          </div>
        )}

        <div className="search-results">
          <h2>Search Results</h2>
          <ul>
            {results.length > 0 ? (
              results.map((result) => (
                <li key={result._id}>
                  <h3>{result.title}</h3>
                  <p>{result.description}</p>
                  <p>Price: ₹{result.price}</p>
                  <p>Location: {result.location?.city}, {result.location?.country}</p>
                </li>
              ))
            ) : (
              <p>No tours found matching your criteria.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;
