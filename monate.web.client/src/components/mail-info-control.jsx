import { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useLight, useSaveEmail } from '../globals/redux_store';
import { MyTextField } from './my-controls';
import { GoogleIcon, AppleIcon } from './svg-icons';
import { useAlert } from './alerts';
import CryptionHelper from '../../helpers/cryption-helper';
import '../pages/sign-up.css';

const MailInfoControl = (props) => {
    const { setOpenMailVerifyDialog } = props;

    const lightMode = useLight();
    const saveEmail = useSaveEmail();
    const { showAlert } = useAlert();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [emailAddr, setEmailAddr] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordValid, setPasswordValid] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmailChange = (e) => {
        setEmailAddr(e.target.value);
    }

    const handlePasswordInputChange = (e) => {
        setPasswordInput(e.target.value);
    }

    const handlePasswordValidChange = (e) => {
        setPasswordValid(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailRegex.test(emailAddr)) {
            setEmailError('Email format is not correct.');
            return;
        }
        else setEmailError('');
        if (passwordValid != passwordInput) {
            setPasswordError('Input password correctly.');
            return;
        }
        else setPasswordError('');

        const cryptor = new CryptionHelper();
        await cryptor.initialize();
        const userMail = {
            email: await cryptor.encrypt(emailAddr),
        };

        try {
            const response = await fetch(`verifyemail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userMail),
            });

            if (!response.ok) {
                const data = await response.json();
                showAlert({ severity: 'error', message: data.message });
                return;
            }
            else {
                saveEmail(emailAddr);
                setOpenMailVerifyDialog(true);
                showAlert({ severity: 'success', message: 'Verification code sent.' });
            }
        } catch (error) {
            showAlert({ severity: 'error', message: error.message });
        }
    }

    return (
        <div className={lightMode ? 'signup-main-light-inputs' : 'signup-main-dark-inputs'}>
            <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <MyTextField
                    required
                    name='Email Address'
                    id='email-address'
                    type='email'
                    style={{ marginTop: 'calc(8vh - 12px)', width: '30vw' }}
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
                <FormControlLabel control={<Checkbox defaultChecked style={{ color: lightMode ? '#1f2f2f' : '#cfdfdf' }} />}
                    style={{ color: lightMode ? '#1f2f2f' : '#cfdfdf', marginTop: 'calc(2.5vh - 12px)' }}
                    label="I agree to sign up with this email." />
                <Button
                    varient='contained'
                    onClick={handleSubmit}
                    style={{
                        marginTop: 'calc(1vh - 12px)', width: '17vw', height: '5vh', fontSize: '3vh',
                        color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#3f4f4f' : '#afbfbf'
                    }}
                >Submit</Button>
                <Button
                    varient='contained'
                    style={{
                        marginTop: 'calc(7vh - 12px)', width: '30vw', height: '5vh', fontSize: '2.4vh',
                        color: lightMode ? '#3f4f4f' : '#cfdfdf', backgroundColor: lightMode ? '#cfdfdf' : '#1f2f2f'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <GoogleIcon width='2vw' height='2vw' /><span style={{ marginLeft: '1vw', textTransform: 'none', }}>Sign up with Google</span>
                    </div>
                </Button>
                <Button
                    varient='contained'
                    style={{
                        marginTop: 'calc(3vh - 12px)', width: '30vw', height: '5vh', fontSize: '2.4vh',
                        color: lightMode ? '#3f4f4f' : '#cfdfdf', backgroundColor: lightMode ? '#cfdfdf' : '#1f2f2f'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <AppleIcon width='2vw' height='2vw' /><span style={{ marginLeft: '1vw', textTransform: 'none', }}>Sign up with Apple</span>
                    </div>
                </Button>
            </form>
        </div>
    )
};

export default MailInfoControl;