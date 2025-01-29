import React, { useState, useEffect } from 'react';
import mail from '../images/mail.png';
import password from '../images/padlock.png';
import Login_first from '../images/Login_first.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import invalidCredentials from '../images/invalidCredentials.png';
import CustomInput from '../smallComponents/CustomInput';
import CustomInputWithBtn from '../smallComponents/CustomInputWithBtn';

const Login = () => {
    const navigate = useNavigate();

    const [logindata, setLoginData] = useState({
        email: "",
        password: ""
    });

    const [isError, setIsError] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [typing, setTyping] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setLoginData({ ...logindata, [name]: value });
    };

    const checkAndClearExpiredData = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const currentTime = new Date().getTime();
            const timeDifference = currentTime - parsedUser.timestamp;

            if (timeDifference > 15*60000) {
                localStorage.removeItem('user');
                console.log("Stored data expired and was removed from localStorage");
            }
        }
    };

    useEffect(() => {
        checkAndClearExpiredData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', logindata);
            if (response.data) {
                const currentTime = new Date().getTime(); 
                const userDataWithTimestamp = {
                    data: response.data,
                    timestamp: currentTime
                };
                localStorage.setItem('user', JSON.stringify(userDataWithTimestamp));
                navigate('/home');
            }
        } catch (error) {
            if (error.response) {
                console.error("Server Error:", error.response.data);
                setIsError(true);

                setTimeout(() => {
                    setIsError(false);
                }, 5000);
            } else if (error.request) {
                console.error("Network Error:", error.request);
                alert("Network Error: Please check your connection.");
            } else {
                console.error("Error:", error.message);
                alert("Error: " + error.message);
            }
        }
    };

    const handleFocus = (field) => {
        setTyping(true);
        if (field === 'email') setEmailFocused(true);
        if (field === 'password') setPasswordFocused(true);
    };

    const handleBlur = (field) => {
        if (field === 'email' && !logindata.email) {
            setEmailFocused(false);
        }
        if (field === 'password' && !logindata.password) {
            setPasswordFocused(false);
        }
        
        if (!logindata.email && !logindata.password) {
            setTyping(false);
        }
    };
    

    return (
        <>
            <form className='mainContainer' onSubmit={handleSubmit}>
                <img src={isError ? invalidCredentials : Login_first} alt='Login' />
                <h3>Log on to your Account</h3>
                <p>Not a user yet? <span> <Link className='no-style-link' to='/register'>Register now</Link> </span> for a free demo.</p>

                <CustomInput
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    value={logindata.email}
                    label="E-mail Address"
                    imgSrc={mail}
                    isFocused={emailFocused}
                    name='email'
                    type='text'
                />
                <CustomInputWithBtn
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    value={logindata.password}
                    label="Password"
                    imgSrc={password}
                    isFocused={passwordFocused}
                    name='password'
                    type='password'
                />

                <div className='checkin'>
                    <label style={(typing ? { 'display': 'block' } : { 'display': 'none' })}>
                        <input type="checkbox" />Keep me signed in
                    </label>
                    <p><Link className='no-style-link' to='/verifyemail'>Forgot your password?</Link></p>
                </div>
                <button
                    type='submit'
                    className={`loginButton ${isError ? 'errorButton' : ''}`} // Add class name to toggle error class
                    disabled={isError}
                >
                    {isError ? (
                        <>
                            Invalid e-mail or password.
                            <span>Please try again.</span>
                        </>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>
        </>
    );
};

export default Login;
