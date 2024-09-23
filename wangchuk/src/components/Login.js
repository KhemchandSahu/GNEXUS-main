import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://gcnexus.onrender.com/api/auth/login', {
                name, password
            });

            if (res.status === 200) {
                console.log('Login successful');
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(res.data));

                const { userType } = res.data;

                if (userType === 'teacher') {
                    navigate('/teachers');
                } else {
                    navigate('/students');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className='body'>
            <div className="main">
                <form onSubmit={handleLogin}>
                    <label className="loginLabel">Login</label>
                    {error && <p>{error}</p>}
                    <input className='loginInput'
                        type="text"
                        placeholder="User name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input className='loginInput'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="">Select User Type</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    <button className="loginButton" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
