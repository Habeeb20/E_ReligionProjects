import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import im from '../../assets/religion/Rectangle 4.png';
import im1 from '../../assets/religion/Rectangle 5.png';
import im2 from '../../assets/religion/Rectangle 6.png';
import im3 from '../../assets/religion/Rectangle 7.png';
import im4 from '../../assets/religion/Rectangle 8.png';
import im5 from '../../assets/religion/Rectangle 9.png';
import CountUp from 'react-countup';

const Page2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    complaints: '',
    observations: '',
    dateOfIncident: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ complaints: '', observations: '', dateOfIncident: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/scam/scam-report`, formData, {
        timeout: 10000,
      });
      toast.success(response.data.message);
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit scam report';
      console.error('Error submitting scam report:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code,
      });
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
        <button
          className="bg-[#0A0344] text-white py-2 px-4 mt-4 rounded-md"
          onClick={handleOpenModal}
        >
          Report a scam
        </button>
      </div>

      {/* Scam Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#0A0344]">Report a Scam</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Complaints</label>
                <textarea
                  name="complaints"
                  value={formData.complaints}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0344]"
                  rows="4"
                  required
                  placeholder="Describe the scam"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Observations</label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0344]"
                  rows="4"
                  required
                  placeholder="Any additional details"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date of Incident</label>
                <input
                  type="date"
                  name="dateOfIncident"
                  value={formData.dateOfIncident}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0344]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A0344] text-white py-2 px-4 rounded-md hover:bg-[#1f1f7a] disabled:bg-gray-500"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page2;