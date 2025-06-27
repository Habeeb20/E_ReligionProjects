import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import Home from './page/landingPage/Home';
import Login from './page/auth/Login';
import Signup from './page/auth/Signup';
import VerifyEmail from './page/auth/VerifyEmail';
import PaystackPayment from './page/payment/PaystackPayment';
import PaymentSuccess from './page/payment/PaymentSuccess';
import ProfileForm from './page/auth/ProfileForm';
import UserDashboard from './page/dashboard/UserDashboard';
import LeaderDashboard from './page/dashboard/LeaderDashboard';
import ChatInterface from "./page/chat/ChatInterface"
import UserChat from './page/chat/UserChat';
import LeaderBanner from './page/dashboard/LeaderBanner';
import { ThemeProvider } from './page/ThemeContext';
import LeaderChat from './page/chat/LeaderChat';
import LeaderProfile from './page/Leader/LeaderProfile';
import AboutUs from './page/landingPage/AboutUs';
import Religion from './page/landingPage/Religion';
import Report from './page/landingPage/Report';
import ReligiousDashboard from './page/dashboard/ReligiousDashboard';
import PaymentVerification from './components/Listing/PaymentVerification';
const App = () => {
  return (
    <ThemeProvider>
        <Router>
          <Navbar />
          <Routes>
          <Route path='/' element={<Home />}/>

          <Route path='/login' element={<Login />}/>

          <Route path='/signup' element={<Signup />}/>
          <Route path='/verifyemail' element={<VerifyEmail />}/>
          <Route path='/paystackpayment' element={<PaystackPayment />}/>
          <Route path='/paystacksuccess' element={<PaymentSuccess />}/>
          
          <Route path='/profileform' element={<ProfileForm />}/>
          <Route path='/userdashboard' element={<UserDashboard />}/>
          <Route path='/leaderdashboard' element={<LeaderDashboard />}/>
          <Route path="/choice" element={<LeaderBanner />} />
          <Route path="/chatlogin" element={<ChatInterface />} />
          <Route path="/chat/:leaderId" element={<ChatInterface />} />
          <Route path="/leaderchat" element={<LeaderChat />} />
          <Route path="/leader-chat" element={<LeaderChat />} />
          <Route path="/leader-chat/:sessionUserId" element={<LeaderChat />} />
          <Route path="/leader/:slug" element={<LeaderProfile />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/religion" element={<Religion />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile/verify-payment" element={<PaymentVerification />} />
          <Route path="/religiousdashboard" element={<ReligiousDashboard />} />

          </Routes>
        <Toaster />
        </Router>

    </ThemeProvider>
    
  
  )
}

export default App





