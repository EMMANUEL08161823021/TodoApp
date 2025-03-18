import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            const response = await fetch('', {
                method: 'POST',
                headers: {
                  
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.data.token);
                toast.success("Login successful!");
                navigate('/dashboard')
            } else {
                setError(data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            console.log(err);
            console.error("Login error:", err);
            setError("An error occurred. Please try again later.");
        }
    };




  return (
    <div className='col-12 col-sm-9 col-lg-5 mx-auto' style={{height: '100vh'}}>
        <div className='border d-flex flex-column justify-content-center align-items-center' style={{height: '35vh'}}>
            <h1 className='font-bold'>TO DO</h1>
            <h3>Reminds Everythings</h3>
        </div>
        <div className='border bg-dark d-flex flex-column justify-content-center align-items-center' style={{height: '65vh'}}>
                <form className='container' onSubmit={handleLogin}>
                    <div className='d-flex flex-column gap-3'>
                        <h2 className='mb-0 text-white'>Welcome Back</h2>
                        <p className='mb-0 text-white'>Enter your email and password to sign in</p>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <input
                                className='input border border-white p-3 rounded-pill'
                                name='email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder='Your Email Address'
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <input
                                className='p-3 border border-white rounded-pill'
                                name='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder='Your password'
                            />
                        </div>
                        <button className='button p-3 border border-white rounded-pill' type='submit'>SIGN IN</button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <Link to="/signup" className='text-white text-center'>Sign Up With Email </Link>
                 
                    </div>
                </form>
        </div>
    </div>
  )
}

export default Login