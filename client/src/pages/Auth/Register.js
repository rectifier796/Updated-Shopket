import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

import '../../styles/AuthStyles.css'

import axios from 'axios';

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('/api/v1/auth/register',{name,email,password,phone,answer,address});
            if(res && res.data && res.data.success){
                navigate("/login");
                toast.success(res.data.message);

            }
            else{
                toast.error(res.data.message);
            }
        }
        catch(error){
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

    return (
        <Layout title={"Register - Shopket"}>
            <div className='form-container' style={{ minHeight: "90vh" }}>
                <form onSubmit={handleSubmit}>
                    <h1 className='title'>REGISTER FORM</h1>
                    <div className="mb-3">
                        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter Your Name' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
                    </div>
                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Your Email' className="form-control" id="exampleInputPassword1" required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Your Password' className="form-control" id="exampleInputPassword1" required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Enter Phone Number' className="form-control" id="exampleInputPassword1" required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter Address' className="form-control" id="exampleInputPassword1" required/>
                    </div>
                    <div className="mb-3">
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="What is your best friend's name" className="form-control" id="exampleInputPassword1" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

            </div>
        </Layout>
    )
}

export default Register