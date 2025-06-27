import { useSwipeable } from 'react-swipeable';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Religion2 = () => {
  const [leaders, setLeaders] = useState({
    Christianity: [],
    Islam: [],
    Traditional: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndices, setActiveIndices] = useState({ Christianity: 0, Islam: 0, Traditional: 0 });

  // Define swipe handlers at the top level
  const swipeHandlers = {
    Christianity: useSwipeable({
      onSwipedLeft: () => setActiveIndices(prev => ({
        ...prev,
        Christianity: Math.min(prev.Christianity + 1, Math.ceil(leaders.Christianity.length / 4) - 1),
      })),
      onSwipedRight: () => setActiveIndices(prev => ({
        ...prev,
        Christianity: Math.max(prev.Christianity - 1, 0),
      })),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    }),
    Islam: useSwipeable({
      onSwipedLeft: () => setActiveIndices(prev => ({
        ...prev,
        Islam: Math.min(prev.Islam + 1, Math.ceil(leaders.Islam.length / 4) - 1),
      })),
      onSwipedRight: () => setActiveIndices(prev => ({
        ...prev,
        Islam: Math.max(prev.Islam - 1, 0),
      })),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    }),
    Traditional: useSwipeable({
      onSwipedLeft: () => setActiveIndices(prev => ({
        ...prev,
        Traditional: Math.min(prev.Traditional + 1, Math.ceil(leaders.Traditional.length / 4) - 1),
      })),
      onSwipedRight: () => setActiveIndices(prev => ({
        ...prev,
        Traditional: Math.max(prev.Traditional - 1, 0),
      })),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    }),
  };

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leaders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const allMinisters = Array.isArray(response.data) ? response.data : response.data.data || [];
        if (!Array.isArray(allMinisters)) {
          throw new Error('Invalid data format from API');
        }

        // Separate leaders by religion
        const categorizedLeaders = {
          Christianity: allMinisters.filter(leader =>
            ['christianity', 'christian'].includes(leader.religion.toLowerCase())
          ),
          Islam: allMinisters.filter(leader =>
            ['islam', 'muslim'].includes(leader.religion.toLowerCase())
          ),
          Traditional: allMinisters.filter(leader =>
            leader.religion.toLowerCase() === 'traditional'
          ),
        };
        setLeaders(categorizedLeaders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaders:', err);
        setError(`Error fetching leader data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const religionCategories = [
    { name: 'Islamic Leaders', key: 'Islam' },
    { name: 'Christian Leaders', key: 'Christianity' },
    { name: 'Traditional Leaders', key: 'Traditional' },
  ];

  const religionDescriptions = {
    Islam: 'Islam in Nigeria is a vibrant faith with a rich history, practiced by millions across the northern and southwestern regions. Our platform features esteemed Islamic leaders—Imams, Alfas, and scholars—who guide their communities with wisdom, offering spiritual counsel, education, and support through mosques and Islamic centers. Explore the diverse leadership shaping Islamic devotion nationwide.',
    Christianity: 'Christianity thrives across Nigeria, with a diverse array of denominations from Pentecostals to Catholics. Our Christian leaders—Pastors, Reverends, and Bishops—serve as pillars of faith, leading congregations with sermons, outreach programs, and community initiatives. e-Religion connects you to these dedicated ministers, fostering spiritual growth across all 36 states.',
    Traditional: 'Traditional religion in Nigeria encompasses a deep cultural heritage, with leaders such as Chiefs, Priests, and Diviners preserving ancient practices. These spiritual guides maintain sacred groves, perform rituals, and offer wisdom rooted in local traditions. Discover the unique leadership upholding Nigeria’s indigenous faiths through our platform.',
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-yellow-30 p-6 rounded-lg shadow-md mb-8">
      {religionCategories.map((category) => (
        <div key={category.key} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{religionDescriptions[category.key]}</p>
          <div
            className="relative overflow-hidden"
            {...swipeHandlers[category.key]}
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-transform duration-300"
              style={{
                transform: `translateX(-${activeIndices[category.key] * 100}%)`,
                width: `${Math.ceil(leaders[category.key].length / 4) * 100}%`,
              }}
            >
              {leaders[category.key].map((leader, index) => (
                <div
                  key={leader._id || index}
                  className="bg-white rounded-lg shadow-md p-4 min-w-[200px] flex flex-col items-center"
                >
                  <img
                    src={leader.profilePicture || '/placeholder.jpg'}
                    alt={`${leader.title} ${leader.firstname} ${leader.lastname}`}
                    className="w-24 h-24 object-cover rounded-full mb-2"
                  />
                  <h4 className="font-bold text-gray-800 text-center">
                    {leader.title} {leader.firstname} {leader.lastname}
                  </h4>
                  <p className="text-sm text-center text-gray-600">{leader.ministryname}</p>
                  <button
                    onClick={() => window.location.href = `/leader/${leader.slug || 'default'}`}
                    className="bg-indigo-600 text-white py-1 px-3 rounded-md mt-2 hover:bg-indigo-500 text-xs"
                    disabled={!leader.slug}
                  >
                    View More
                  </button>
                </div>
              ))}
            </div>
          </div>
          {leaders[category.key].length > 4 && (
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">
                Slide {activeIndices[category.key] + 1} of {Math.ceil(leaders[category.key].length / 4)}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Religion2;