import { useSwipeable } from 'react-swipeable';
import { useState, useEffect } from 'react';

import axios from "axios"
const Religion4 = () => {
  const [ministers, setMinisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL2}/getallleaders`);
        const allMinisters = response.data;

        const christianMinisters = allMinisters.filter(minister =>
          minister.religion.toLowerCase() === 'islam' || 
          minister.religion.toLowerCase() === 'muslim'
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
    <>
    

      <div className="bg-white p-6 rounded-lg shadow-md mb-8" {...handlers}>
      <div className="text-left mb-6">
        <h2 className="text-2xl lg:text-4xl font-bold text-blue-900 mb-4">
          Muslim
        </h2>
        <p className="text-lg text-gray-700">
          Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
          Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
          Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
        </p>
      </div>
        
        <h3 className="text-lg font-semibold mb-4">Icons in Islam</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ministers.map((minister, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-4 ${activeIndex === index ? 'block' : 'hidden'} sm:block`}
            >
              <img
                src={minister.profilePicture}
                alt={minister}
                className="w-full h-40 object-cover rounded-md mb-4 font-base"
              />
              <h4 className="font-bold text-gray-800 text-center">{minister.title} {minister.firstname} {minister.lastname}</h4>
              <p className="text-sm text-center text-gray-600">{minister.ministryname}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-indigo-600 text-white py-2 px-6 rounded-md mt-4 block mx-auto hover:bg-indigo-500"
        >
          Contact an Islamic Minister
        </button>
      </div>

    </>
   
  );
};

export default Religion4