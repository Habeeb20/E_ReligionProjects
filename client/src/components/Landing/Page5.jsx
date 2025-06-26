import { useState, useEffect } from 'react';
import im from '../../assets/religion/Container (1).png';
import im1 from '../../assets/religion/Container (2).png';
import im2 from '../../assets/religion/Container (3).png';
import im3 from '../../assets/religion/Container (4).png';
import im4 from '../../assets/religion/Container (5).png';
import im5 from '../../assets/religion/Container.png';
import axios from 'axios';
import toast from 'react-hot-toast';

const CityCard = ({ city }) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
      <img
        src={city.image}
        alt={city.name}
        className="w-full h-64 object-cover" // Fixed height for consistency
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-semibold text-white">{city.count}</h2>
        <p className="text-lg text-white">{city.name}</p>
      </div>
    </div>
  );
};

const Page5 = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const images = [im, im1, im2, im3, im4, im5];

  useEffect(() => {
    const fetchCityCounts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leaders/count-by-state`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const statesData = response.data.data.map((item, index) => ({
          name: item.state, // Use raw state name
          count: item.count || 0,
          image: images[index % images.length], // Cycle through images
        }));
        setCities(statesData);
      } catch (err) {
        console.error('Error fetching city counts:', err);
        toast.error('Failed to load city data');
        setCities([
          { name: 'Lagos', count: 0, image: im },
          { name: 'Abuja', count: 0, image: im1 },
          { name: 'Calabar', count: 0, image: im2 },
          { name: 'Port-Harcourt', count: 0, image: im3 },
          { name: 'Owerri', count: 0, image: im4 },
          { name: 'Uyo', count: 0, image: im5 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCityCounts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

  const visibleCities = showAll ? cities : cities.slice(0, 6);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Popular cities with Popular Ministers
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          See the top destinations people are finding the top ministers
        </p>
        <div className="mt-4 w-24 h-1 bg-blue-500 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCities.map((city, index) => (
          <CityCard key={index} city={city} />
        ))}
      </div>

      {cities.length > 6 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            {showAll ? 'View Less' : `View More (${cities.length - 6} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Page5;