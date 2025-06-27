import { useSwipeable } from 'react-swipeable';
import { useState, useEffect } from 'react';

import axios from "axios"
const Religion5 = () => {
  const [ministers, setMinisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leaders`);
        const allMinisters = response.data;

        const christianMinisters = allMinisters.filter(minister =>
          minister.religion.toLowerCase() === 'traditional' || 
          minister.religion.toLowerCase() === 'herbalist' 
        );

        setMinisters(christianMinisters);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchMinisters();
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveIndex((prev) => Math.min(prev + 1, ministers.length - 1)),
    onSwipedRight: () => setActiveIndex((prev) => Math.max(prev - 1, 0)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8" {...handlers}>
      <h3 className="text-lg font-semibold mb-4">Icons in Traditional</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ministers.map((minister, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md p-4 ${activeIndex === index ? 'block' : 'hidden'} sm:block`}
          >
            {/* <img
              src={minister.profilePicture}
              alt={minister}
              className="w-full h-40 object-cover rounded-md mb-4 font-base"
            /> */}
            <h4 className="font-bold text-gray-800 text-center">{minister.title} {minister.firstname} {minister.lastname}</h4>
            <p className="text-sm text-center text-gray-600">{minister.ministryname}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => window.location.href = '/login'}
        className="bg-indigo-600 text-white py-2 px-6 rounded-md mt-4 block mx-auto hover:bg-indigo-500"
      >
        Contact a traditional leader
      </button>
    </div>
  );
};

export default Religion5