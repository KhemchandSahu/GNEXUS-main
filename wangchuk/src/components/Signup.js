import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const AuthForm = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin 
            ? 'http://localhost:5000/api/auth/login' 
            : 'http://localhost:5000/api/auth/signup';
        const payload = { name, password, userType };

        try {
            const res = await axios.post(url, payload);

            if (res.status === 200 || res.status === 201) {
                localStorage.setItem('user', JSON.stringify(res.data));
                if (res.data.userType === 'teacher') {
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
                <form onSubmit={handleSubmit}>
                    <label className="loginLabel">{isLogin ? 'Login' : 'Sign up'}</label>
                    {error && <p>{error}</p>}
                    <input
                        className='loginInput'
                        type="text"
                        placeholder="User name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        className='loginInput'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {!isLogin && (
                        <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
                            <option value="">Select User Type</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    )}
                    <button className="loginButton" type="submit">{isLogin ? 'Login' : 'Sign up'}</button>
                    <p className='paralogin'>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" className="loginButton" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
