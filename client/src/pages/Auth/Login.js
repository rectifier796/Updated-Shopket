import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from "react-hot-toast";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth';

import '../../styles/AuthStyles.css'

import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location=useLocation();

    const [auth,setAuth]=useAuth();

    useEffect(()=>{
        if(auth && auth.user){
            navigate("/");
        }
    },);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/login', { email, password});
            if (res && res.data && res.data.success) {
                setAuth({
                    ...auth,
                    user:res.data.user,
                    token:res.data.token
                });
                localStorage.setItem('auth',JSON.stringify(res.data));
                navigate(location.state || "/");
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
      <Layout title={"Login - Shopket"}>
          <div className='form-container' style={{minHeight:"90vh"}}>
              <form onSubmit={handleSubmit}>
                  <h1 className='title'>Login FORM</h1>
                  <div className="mb-3">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' className="form-control" id="exampleInputPassword1" required />
                  </div>
                  <div className="mb-3">
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Your Password' className="form-control" id="exampleInputPassword1" required />
                  </div>
                  <div className='mb-3'>
                  <button type="submit" className="btn forgot-btn" onClick={()=>{navigate("/forgot-password")}}>Forgot Password</button>
                  </div>
                  <button type="submit" className="btn btn-primary">LOGIN</button>
              </form>
          </div>
      </Layout>
  )
}

export default Login