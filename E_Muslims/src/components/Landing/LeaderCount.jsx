import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CountUp from 'react-countup';

const LeaderCount = () => {
  const [counts, setCounts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const states = [
          'Oyo', 'Lagos', 'Abuja', 'Delta', 'Imo', 'Ogun', 'Ondo', 'Osun', 'Anambra', 'Kano',
          'Katsina', 'Sokoto', 'Kwara', 'Borno', 'Nasarawa'
        ];
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/getcountleader`, {
          params: { state: states }, // Ensure state is an array
          paramsSerializer: params => {
            return Object.entries(params)
              .map(([key, value]) => value.map(v => `${key}[]=${encodeURIComponent(v)}`).join('&'))
              .join('&');
          }
        });

        setCounts(response.data);
      } catch (error) {
        console.log('Error fetching leader counts:', error);
        // toast.error('An error occurred while fetching the leader count');
      }
    };
    fetchCounts();
  }, []);

  const handleSeeMore = () => {
    setVisibleCount(prevCount => prevCount + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  return (
    <div>
      <h2 className="heading">Number of Religious Leaders in Different Locations</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {counts.length > 0 ? (
          counts.slice(0, visibleCount).map(({ state, count }) => (
            <div className="border-2 border-[#0A0344] rounded-md text-center p-4 w-44" key={state}>
              <h3 className="text-[#0A0344] font-semibold">{`Religious leaders in ${state}`}</h3>
              <CountUp className="text-[#6D6D6D]" start={0} end={parseInt(count)} duration={9.75} separator="" />
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
      <div className="button-container">
        {visibleCount < counts.length && (
          <button className="btn see-more" onClick={handleSeeMore}>
            See More
          </button>
        )}
        {visibleCount >= counts.length && counts.length > 5 && (
          <button className="btn show-less" onClick={handleShowLess}>
            Show Less
          </button>
        )}
      </div>
      {/* Mobile responsiveness */}
      <style jsx>{`
        .heading {
          text-align: center;
          margin-bottom: 20px;
          font-weight: bolder;
        }

        .button-container {
          text-align: center;
          margin-top: 20px;
        }

        .btn {
          background-color: indigo;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }

        .show-less {
          background-color: red;
        }

        @media (max-width: 768px) {
          .card {
            flex: 1 1 calc(50% - 20px);
            max-width: calc(50% - 20px);
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderCount;