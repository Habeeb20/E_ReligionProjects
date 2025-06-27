import React, { useEffect, useState, useCallback } from 'react';
import im from '../../assets/religion/image 6.png';
import e from '../../assets/religion/n.png';
import c from '../../assets/religion/n1.png';
import r from '../../assets/religion/Rectangle 326 (2).png';
import axios from 'axios';
import toast from 'react-hot-toast';
import { statesAndLgas } from '../../stateAndLga';

const Page7 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [religionFilter, setReligionFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [lgaFilter, setLgaFilter] = useState('');
  const [ministers, setMinisters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  // Fetch ministers with role = 'religious_ground' via backend
  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          search: searchTerm,
          religion: religionFilter,
          state: stateFilter,
          lga: lgaFilter,
        }).toString();

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/religious-ground?${queryParams}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.status && Array.isArray(response.data.data)) {
          setMinisters(response.data.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching ministers:', error);
        toast.error('Failed to load ministers.');
        setMinisters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMinisters();
  }, [searchTerm, religionFilter, stateFilter, lgaFilter]);

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Religion options
  const religionOptions = [ 'Traditional'];

  // State options
  const stateOptions = Object.keys(statesAndLgas);

  // LGA options based on selected state
  const lgaOptions = stateFilter ? statesAndLgas[stateFilter] || [] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 min-h-screen p-8">
      {/* Search Section */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img src={im} alt="Man thinking" className="w-full h-auto object-cover" />
        </div>

        {/* Search Section */}
        <div className="w-full md:w-1/2 text-center md:text-left p-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-4">
            Don't know where to worship? <br />
            Scan through our database to see worship centers around you
          </h1>
          <div className="flex flex-col md:flex-row items-center md:justify-start space-y-2 md:space-y-0">
            <input
              type="text"
              placeholder="Search by Name, LGA, State, or Religion"
              className="p-2 border border-gray-400 rounded-md w-full md:w-2/3"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            <select
              value={religionFilter}
              onChange={(e) => setReligionFilter(e.target.value)}
              className="p-2 border border-gray-400 rounded-md w-full md:w-1/3 md:ml-2 mt-2 md:mt-0"
            >
              <option value="">Select Religion</option>
              {religionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row items-center md:justify-start space-y-2 md:space-y-0 mt-2">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="p-2 border border-gray-400 rounded-md w-full md:w-1/3"
            >
              <option value="">Select State</option>
              {stateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={lgaFilter}
              onChange={(e) => setLgaFilter(e.target.value)}
              className="p-2 border border-gray-400 rounded-md w-full md:w-1/3 md:ml-2"
            >
              <option value="">Select Local Govt Area</option>
              {lgaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              className="ml-2 bg-indigo-900 text-white p-2 rounded-md hover:bg-indigo-700 transition w-full md:w-auto mt-2 md:mt-0"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {(searchTerm || religionFilter || stateFilter || lgaFilter) && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ministers.length > 0 ? (
              ministers.map((minister, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-md">
                  <h3 className="text-sm font-semibold text-indigo-900">
                    Name of Imam/Pastor: {minister.title} {minister.firstname} {minister.lastname}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">LGA: {minister.localGovtArea || 'N/A'}</p>
                  <p className="text-gray-600 text-sm mb-2">Church/Mosque: {minister.ministryname || 'N/A'}</p>
                  <p className="text-gray-600 text-sm mb-2">Religion: {minister.religion || 'N/A'}</p>
                  <div className="flex items-center">
                    <a href={`mailto:${minister.email || 'N/A'}`} className="text-indigo-600 hover:underline">
                      {minister.email || 'N/A'}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No results found.</p>
            )}
          </div>
        </div>
      )}

      {/* Our Other Choices */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Our Other Choices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="flex items-center space-x-4">
            <img src={e} alt="e-ride" className="w-20 h-20 object-cover rounded-md" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-900">e-Ride</h3>
              <p className="text-gray-600 text-sm">
                Enjoy safe and reliable transportation to your worship centers with our e-Ride service.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-center space-x-4">
            <img src={r} alt="hauling" className="w-20 h-20 object-cover rounded-md" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-900">Hauling</h3>
              <p className="text-gray-600 text-sm">
                Our hauling services help deliver religious materials and supplies to your community efficiently.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-center space-x-4">
            <img src={c} alt="Pride of Nigeria" className="w-20 h-20 object-cover rounded-md" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-900">Pride of Nigeria</h3>
              <p className="text-gray-600 text-sm">
                Celebrate Nigeria's rich cultural and religious heritage with our curated events and gatherings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page7;