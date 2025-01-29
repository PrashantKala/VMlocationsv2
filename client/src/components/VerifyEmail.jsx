import React, { useState } from 'react';
import mail from '../images/mail.png';
import verifyEmailImage from '../images/verifyEmail.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../smallComponents/CustomInput';

const VerifyEmail = () => {
    const navigate = useNavigate();

    const [verifyEmail, setVerifyEmail] = useState({
        email: "",
    });

    const [typing, setTyping] = useState(false);
    const [isError, setIsError] = useState(false); // State to manage button error state
    const [isFocused, setIsFocused] = useState(false); // State to manage focus for floating label and image
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setVerifyEmail({ ...verifyEmail, [name]: value });
    };

    const handleFocus = (field) => {
        setTyping(true);
        if (field === 'email') setEmailFocused(true);
    };

    const handleBlur = (field) => {
        if (field === 'email' && !verifyEmail.email) {
            setEmailFocused(false);
        }
        if (!verifyEmail.email) {
            setTyping(false);
        }
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const findEmail = async () => {
        const email = verifyEmail.email.trim(); // Ensure no leading/trailing spaces
        console.log('Attempting to find email:', email);

        try {
            const response = await axios.get('http://localhost:5000/auth/findUser', { params: { email } });

            if (response.status === 200 && response.data) {
                localStorage.setItem('email', email);
                navigate('/resetPassword');
            }
        } catch (error) {
            console.error('Error during API request:', error);
            if (error.response && error.response.status === 404) {
                setIsPopupVisible(true);
                setTimeout(() => {
                    setIsPopupVisible(false);
                }, 1000);
            } else {
                alert("An unexpected error occurred.");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(verifyEmail.email)) {
            setIsError(true);
            // Hide error after 2 seconds
            setTimeout(() => {
                setIsError(false);
            }, 2000);
            return;
        }
        findEmail();
    };

    return (
        <>
            <form className='mainContainer' onSubmit={handleSubmit}>
                <img src={verifyEmailImage} alt='Login' />
                <h3>Reset Password</h3>
                <p style={{ 'margin': '0px', 'padding': '0px' }}>To reset your password, enter the e-mail address you use to sign in.</p>
                <p style={{ 'margin': '0px', 'padding': '0px', 'marginBottom': '20px' }}>A reset password link will be sent to that address.</p>
                <CustomInput
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    value={verifyEmail.email}
                    label="E-mail Address"
                    imgSrc={mail}
                    isFocused={emailFocused}
                    name='email'
                    type='text'
                />
                <div className='buttons'>
                    <button className='cancelButton' onClick={handleCancelClick}>Cancel</button>
                    <button
                        type='submit'
                        className={`loginButton ${isError ? 'errorButton' : ''}`} // Add error class if isError is true
                        disabled={isError}
                    >
                        {isError ? (
                            <>
                                Invalid e-mail.
                                <span>Please try again.</span>
                            </>
                        ) : (
                            'Send'
                        )}
                    </button>
                </div>
            </form>
            {isPopupVisible && (
                <div className="popup">
                    <p>Email not registered!!</p>
                </div>
            )}
        </>
    );
};

export default VerifyEmail;
