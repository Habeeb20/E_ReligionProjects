
import im from '../../assets/religion/Rectangle 4.png';
import im1 from '../../assets/religion/Rectangle 5.png';
import im2 from '../../assets/religion/Rectangle 6.png';
import im3 from '../../assets/religion/Rectangle 7.png';
import im4 from '../../assets/religion/Rectangle 8.png';
import im5 from '../../assets/religion/Rectangle 9.png';
import CountUp from 'react-countup';


const Page2 = () => {
  return (
    <div className="bg-[#FAF3DD] p-4">
      {/* Image Grid Section */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[im, im1, im2, im3, im4].map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`religious-img-${index}`}
            className="w-36 h-36 object-cover rounded-md"
          />
        ))}
      </div>

      {/* Religious Stats Section */}
      <div className="flex flex-col items-center justify-center text-center mb-6 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-4">
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-bold text-[#0A0344]">
              <CountUp start={0} end={3000000} duration={3.75} separator="," />
              <br />
              <span className="text-xs sm:text-sm font-light">
                Religious Ministers of God
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-bold text-[#0A0344]">
              <CountUp start={0} end={3000} duration={3.75} separator="," />
              <br />
              <span className="text-xs sm:text-sm font-light">
                Christian Denominations
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-bold text-[#0A0344]">
              <CountUp start={0} end={3000} duration={3.75} separator="," />
              <br />
              <span className="text-xs sm:text-sm font-light">
                Islamic Communities
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-bold text-[#0A0344]">
              <CountUp start={0} end={3000} duration={3.75} separator="," />
              <br />
              <span className="text-xs sm:text-sm font-light">
                Traditional followers
              </span>
            </p>
          </div>
        </div>

        <div className="mb-4">
          <img
            src={im5}
            alt="religion-icons"
            className="w-48 h-32 object-cover rounded-md"
          />
        </div>
        <p className="text-lg text-[#6D6D6D]">
          e-religion is your search engine for anything and everything religion.
          As of today, we have <span className="font-bold">74,952,662</span> users worldwide. No annoying ads, no download limits.
        </p>
        <button className="bg-[#0A0344] text-white py-2 px-4 mt-4 rounded-md">
          Report a scam
        </button>
      </div>
    </div>
  );
};

export default Page2;






















