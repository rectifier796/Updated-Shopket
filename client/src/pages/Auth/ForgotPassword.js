import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

import '../../styles/AuthStyles.css'

import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/forgot-password', { email, newPassword, answer });
            if (res && res.data && res.data.success) {
                navigate("/login");
                toast.success(res.data.message);

            }
            else {
                toast.error(res.data.message);
            }
        }
        catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

  return (
    <Layout title={"Forgot Password - Shopket"}>
          <div className='form-container'>
              <form onSubmit={handleSubmit}>
                  <h1 className='title'>RESET PASSWORD</h1>
                  <div className="mb-3">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' className="form-control" id="exampleInputPassword1" required />
                  </div>
                  <div className="mb-3">
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Enter New Password' className="form-control" id="exampleInputPassword1" required />
                  </div>
                  <div className="mb-3">
                      <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="What is your best friend's name" className="form-control" id="exampleInputPassword1" required />
                  </div>
                  <button type="submit" className="btn btn-primary">RESET</button>
              </form>
          </div>
    </Layout>
  )
}

export default ForgotPassword