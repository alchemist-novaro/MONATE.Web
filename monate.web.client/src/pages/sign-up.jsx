import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useLight, useEmail, useSaveEmail } from '../globals/redux_store';
import { MyTextField } from '../components/my-controls';
import { GoogleIcon, MonateIcon, AppleIcon } from '../components/svg-icons';
import ModeSwitch from '../components/mode-switch';
import './sign-up.css';

const SignUp = (props) => {
    const lightMode = useLight();
    const email = useEmail();
    const saveEmail = useSaveEmail();

    const [emailAddr, setEmailAddr] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordValid, setPasswordValid] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const signupImage = `/sign-up/mails/mail-${lightMode ? 'light' : 'dark'}.jpg`;

    const handleEmailChange = (e) => {
        setEmailAddr(e.target.value);
    }

    const handlePasswordInputChange = (e) => {
        setPasswordInput(e.target.value);
    }

    const handlePasswordValidChange = (e) => {
        setPasswordValid(e.target.value);
    }

    return (
        <div>
            <div className={lightMode ? 'signup-light-header' : 'signup-dark-header'}>
                <Link
                    to='/'
                    className={(lightMode ? 'signup-light-link-title' : 'signup-dark-link-title') + ' Large signup-title-link'}
                >
                    <div className='signup-title'>
                        <MonateIcon width='45px' height='45px' />ONATE
                    </div>
                </Link>
                <ModeSwitch />
            </div>
            <span className='signup-body'>
                <div
                    className={lightMode ? 'signup-navbar-light' : 'signup-navbar-dark'}
                    style={{ backgroundImage: `url("${signupImage}")` }}
                ></div>
                <div className={lightMode ? 'signup-main-light' : 'signup-main-dark'}>
                    <div className={(lightMode ? 'signup-main-light-title' : 'signup-main-dark-title') + ' Large'}>
                        Sign Up
                    </div>
                    <div className={lightMode ? 'signup-main-light-inputs' : 'signup-main-dark-inputs'}>
                        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <MyTextField
                                required
                                name='Email Address'
                                id='emial-address'
                                style={{ marginTop: 'calc(7vh - 12px)', width: '30vw' }}
                                error={emailError}
                                autoComplete='username'
                                onChange={handleEmailChange}
                            />
                            <MyTextField
                                required
                                name='Password'
                                id='password'
                                style={{ marginTop: 'calc(5vh - 12px)', width: '30vw' }}
                                error={passwordError}
                                type='password'
                                autoComplete='new-password'
                                onChange={handlePasswordInputChange}
                            />
                            <MyTextField
                                required
                                name='Password Validation'
                                id='password-validation'
                                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                                error={passwordError}
                                autoComplete='new-password'
                                type='password'
                                onChange={handlePasswordValidChange}
                            />
                            <Button
                                varient='contained'
                                style={{
                                    marginTop: 'calc(5vh - 12px)', width: '17vw', height: '5vh', fontSize: '3vh',
                                    color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#1f2f2f' : '#cfdfdf' }}
                            >Submit</Button>
                            <Button
                                varient='contained'
                                style={{
                                    marginTop: 'calc(10vh - 12px)', width: '30vw', height: '5vh', fontSize: '2.5vh',
                                    color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#3f4f4f' : '#cfdfdf'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'row', flexDirection: 'row', alignItems: 'center' }}>
                                    <GoogleIcon width='2vw' height='2vw' /><span style={{ marginLeft: '1vw', textTransform: 'none', }}>Sign up with Google</span>
                                </div>
                            </Button>
                            <Button
                                varient='contained'
                                style={{
                                    marginTop: 'calc(3vh - 12px)', width: '30vw', height: '5vh', fontSize: '2.5vh',
                                    color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#3f4f4f' : '#cfdfdf'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'row', flexDirection: 'row', alignItems: 'center' }}>
                                    <AppleIcon width='2vw' height='2vw' /><span style={{ marginLeft: '1vw', textTransform: 'none', }}>Sign up with Apple</span>
                                </div>
                            </Button>
                        </form>
                    </div>
                </div>
            </span>
        </div>
    );
};

export default SignUp;
