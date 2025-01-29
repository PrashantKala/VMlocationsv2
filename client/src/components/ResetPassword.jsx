import React, { useState } from 'react';
import mail from '../images/mail.png';
import passwordIcon from '../images/padlock.png';
import hide from '../images/private.png';
import unhide from '../images/view.png';
import verifyEmail from '../images/verifyEmail.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import CustomInputWithBtn from '../smallComponents/CustomInputWithBtn';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [logindata, setLoginData] = useState({
    password: "",
    Cpassword: ""
  });

  const [hideUnhidePass, setHideUnhidePass] = useState(1);
  const [hideUnhideCpass, setHideUnhideCpass] = useState(1);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [CpasswordFocused, setCpasswordFocused] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginData({ ...logindata, [name]: value });
  };

  const handleFocus = (field) => {
    if (field === 'password') setPasswordFocused(true);
    if (field === 'Cpassword') setCpasswordFocused(true);
  };

  const handleBlur = (field) => {
    if (field === 'password') setPasswordFocused(false);
    if (field === 'Cpassword') setCpasswordFocused(false);
  };

  const managePassContent = () => {
    setHideUnhidePass(!hideUnhidePass);
  };

  const manageCpassContent = () => {
    setHideUnhideCpass(!hideUnhideCpass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (logindata.password !== logindata.Cpassword) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 1000);
      return;
    }

    try {
      const email = localStorage.getItem('email');
      const response = await axios.put('http://localhost:5000/user/updatePassword', {
        email: email,
        password: logindata.password,
      });

      if (response.data) {
        setIsPopupVisible(true);
        setTimeout(() => {
          setIsPopupVisible(false);
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        setErrorMsg(error.response.data.message || "An error occurred.");
      } else if (error.request) {
        console.error("Network Error:", error.request);
        setErrorMsg("Network Error: Please check your connection.");
      } else {
        console.error("Error:", error.message);
        setErrorMsg("Error: " + error.message);
      }
      setIsError(true);
    }
  };

  return (
    <>
      <form className='mainContainer' onSubmit={handleSubmit}>
        <img src={verifyEmail} alt='Login' />
        <h3>Create New Password</h3>
        <p>Enter your new password below. Read our <span><Link className='no-style-link' to=''>Password complexity requirements policy.</Link></span></p>

        <CustomInputWithBtn
          onChange={handleChange}
          onFocus={() => handleFocus('password')}
          onBlur={() => handleBlur('password')}
          value={logindata.password}
          label="Password"
          imgSrc={passwordIcon}
          isFocused={passwordFocused}
          name='password'
          type={hideUnhidePass ? 'password' : 'text'}
          toggleVisibility={managePassContent}
          icon={hideUnhidePass ? hide : unhide}
        />

        <CustomInputWithBtn
          onChange={handleChange}
          onFocus={() => handleFocus('Cpassword')}
          onBlur={() => handleBlur('Cpassword')}
          value={logindata.Cpassword}
          label="Confirm Password"
          imgSrc={passwordIcon}
          isFocused={CpasswordFocused}
          name='Cpassword'
          type={hideUnhideCpass ? 'password' : 'text'}
          toggleVisibility={manageCpassContent}
          icon={hideUnhideCpass ? hide : unhide}
        />

        <button
          type='submit'
          className={`loginButton ${isError ? 'errorButton' : ''}`}
          disabled={isError}
        >
          {isError ? (
            <>
              Passwords do not match.
              <span>Please try again.</span>
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>

      {isPopupVisible && (
        <div className="popup">
          <p>Password changed successfully! Redirecting to login...</p>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
