import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        const requestBody = {
            email,
            password,
            firstname,
            confirmPassword
        };

        try {
            const response = await fetch('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            console.log(result)

            if (response.ok) {
                toast.success("User Registered Successfully!", {
                    position: 'top-center',
                    style: { fontSize: '14px', padding: '10px' }
                });
                navigate('/dashboard');
            } else {
                throw new Error(result.message || "Registration failed");
            }
        } catch (error) {
            toast.error(error.message, {
                position: 'top-center',
                style: { fontSize: '14px', padding: '10px' }
            });
        }
    };



    return (
        <div className='col-12 col-sm-9 col-lg-5 overflow-hidden mx-auto bg-dark' style={{height: '100vh'}}>
            <div className='border col-12 d-flex gap-3 flex-column justify-content-center align-items-center' style={{height: '100vh'}}>
                <form onSubmit={handleSignUp} className='container'>
                    <div className='col-12 d-flex flex-column gap-2 text-white'>
                        <h1 style={{ color: '#fff'}}>Sign Up</h1>
                        <div className='d-flex flex-column'>
                            <label>Username</label>
                            <input className='p-3 border border-white rounded-pill' name='firstname' type='text' value={firstname} onChange={(e) => setFirstname(e.target.value)} required placeholder='Your first name' />
                        </div>
                        <div className='d-flex flex-column'>
                            <label>Email</label>
                            <input className='p-3 border border-white rounded-pill' name='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Your Email Address' />
                        </div>
                        <div className='d-flex flex-column'>
                            <label>Password</label>
                            <input className='p-3 border border-white rounded-pill' name='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Your password' />
                        </div>
                        <div className='d-flex flex-column'>
                            <label>Confirm Password</label>
                            <input className='p-3 border border-white rounded-pill' name='lastname' type='text' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder='Confirm Password' />
                        </div>

                        <button className='button mt-2 p-3 border border-white rounded-pill' type='submit'>SIGN UP</button>
                        <p style={{ textAlign: 'center', fontSize: '13px' }}>Already have an account? <span><Link className='link' to='/'>Sign in</Link></span></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp