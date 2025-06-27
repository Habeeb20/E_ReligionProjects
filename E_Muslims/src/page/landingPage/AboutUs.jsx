import React from 'react';
import re from '../../assets/religion/sc.png';
import im from '../../assets/religion/Oman Bu.jpeg';
import im2 from '../../assets/religion/Mosque Muhammad al-Amin, Muscat, Oman_ (1).jpeg';
import LeaderCount from '../../components/Landing/LeaderCount';
import Footer from '../../components/Footer';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const AboutUs = () => {
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
      const formattedData = {
        ...formData,
        dateOfIncident: new Date(formData.dateOfIncident).toISOString(),
      };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/scam/scam-report`, formattedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    <div className="min-h-screen bg-[#F5F5DC] text-gray-800">
      {/* Header */}
      <header className="bg-[#001f3f] text-white py-4 px-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold">e-religion</div>
          <nav className="space-x-6 hidden md:flex">
            <a href="#" className="hover:text-[#C0C0C0]">Home</a>
            <a href="#" className="hover:text-[#C0C0C0]">About us</a>
            <a href="#" className="hover:text-[#C0C0C0]">Religions</a>
            <a href="#" className="hover:text-[#C0C0C0]">Report</a>
            <a href="#" className="hover:text-[#C0C0C0]">Profile</a>
          </nav>
          <button className="md:hidden text-2xl">☰</button>
        </div>
      </header>

      {/* About Section */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">ABOUT US</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">About E-Religion</h2>
            <p className="text-lg leading-relaxed">
              e-Religion is a pioneering platform dedicated to connecting individuals with religious leaders and worship grounds across Nigeria. Our mission is to bridge the gap between communities and their spiritual leaders, offering a comprehensive database of ministers from Christian, Islamic, and Traditional faiths. Launched to foster unity and accessibility, we provide tools to locate places of worship, report issues, and access support services like e-Ride for safe transportation to religious events. With a commitment to inclusivity, we strive to empower every Nigerian to find their spiritual home.
            </p>
          </div>
          <div className="flex justify-center h-25">
            <img src={im} alt="Spiritual Connection" className="rounded-lg" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative flex items-center py-6 rounded-lg mb-8">
          {/* Image on the left */}
          <div className="w-1/3 hidden md:block">
            <img
              src={re}
              alt="Religious Gathering"
              className="rounded-lg"
            />
          </div>

          <div className="w-full md:w-2/3 flex justify-around text-center px-4">
            <div>
              <h3 className="text-2xl font-bold">3M+</h3>
              <p className="text-gray-600">Registered Religious Leaders</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">3000</h3>
              <p className="text-gray-600">Christian Denominations</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">3000</h3>
              <p className="text-gray-600">Islamic Communities</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">3000</h3>
              <p className="text-gray-600">Traditional Worship Sites</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleOpenModal}
            className="bg-[#001f3f] text-white px-6 py-3 rounded-lg"
          >
            Report a Scam
          </button>
        </div>

        {/* Ministries Section */}
        <h2 className="text-xl font-bold text-center mb-4">We are all over Nigeria</h2>
        <p className="text-center text-gray-600 mb-6">Explore the distribution of religious leaders across key states in Nigeria</p>
        <LeaderCount />
        {/* <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center mb-8">
          <div className="bg-white shadow p-4 rounded-lg">Ministries in Lagos</div>
          <div className="bg-white shadow p-4 rounded-lg">Ministries in Abuja</div>
          <div className="bg-white shadow p-4 rounded-lg">Ministries in Port Harcourt</div>
          <div className="bg-white shadow p-4 rounded-lg">Ministries in Ibadan</div>
          <div className="bg-white shadow p-4 rounded-lg">Ministries in Kaduna</div>
          <div className="bg-white shadow p-4 rounded-lg">Ministries in Ilorin</div>
        </div> */}

        {/* Bottom Image and Text Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex justify-center">
            <img src={im2} alt="Community Worship" className="rounded-lg" />
          </div>
          <div>
            <p className="text-lg leading-relaxed">
              At e-Religion, we are committed to supporting religious communities by providing a platform where leaders can register their grounds and followers can connect with them. Our services extend to delivering essential supplies through our hauling network and organizing events that celebrate Nigeria’s diverse spiritual heritage. Whether you seek a local mosque, church, or traditional shrine, our platform ensures you find a welcoming space tailored to your beliefs.
            </p>
          </div>
        </div>

        <div className="text-lg leading-relaxed">
          <p>
            e-Religion was founded with the vision of uniting Nigeria’s rich tapestry of faiths under one digital roof. We collaborate with religious leaders to verify and update our database, ensuring accuracy and trust. Our team works tirelessly to address community needs, from resolving disputes to enhancing accessibility through innovative solutions. Join us today to explore, connect, and grow within your faith community across all 36 states and the FCT.
          </p>
        </div>
      </section>
      <Footer />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-bold text-[#001f3f] mb-4">Report a Scam</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Complaints</label>
                <textarea
                  name="complaints"
                  value={formData.complaints}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                  placeholder="Describe your complaint"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Observations</label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                  placeholder="Add any observations"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date of Incident</label>
                <input
                  type="date"
                  name="dateOfIncident"
                  value={formData.dateOfIncident}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
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
                  className="bg-[#001f3f] text-white py-2 px-4 rounded-md hover:bg-[#003366] disabled:bg-gray-500"
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

export default AboutUs;