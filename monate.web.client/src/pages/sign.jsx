import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useLight, useRegion, useSaveRegion, initRegion } from '../globals/redux-store';
import { MonateIcon } from '../components/svg-icons';
import ModeSwitch from '../components/mode-switch';
import MailVerificationDialog from '../components/mail-verification-dialog';
import MailInfoControl from '../components/mail-info-control';
import LocationInfoControl from '../components/location-info-control';
import CryptionHelper from '../../helpers/cryption-helper';
import { useAlert } from '../components/alerts';
import './sign.css';

const Sign = (props) => {
    const { signUp } = props;

    const { showAlert } = useAlert();
    const lightMode = useLight();
    const region = useRegion();
    const saveRegion = useSaveRegion();

    const [openMailVerifyDialog, setOpenMailVerifyDialog] = useState(false);
    const [signMode, setSignMode] = useState('mail-info');

    const signupImage = `/sign-up/mails/mail-${lightMode ? 'light' : 'dark'}.jpg`;

    useEffect(() => {
        const validateToken = async() => {
            const email = sessionStorage.getItem('email');
            const token = sessionStorage.getItem('token');
            if (email && token) {
                const cryptor = new CryptionHelper();
                await cryptor.initialize();
                const tokenData = {
                    email: await cryptor.encrypt(email),
                    token: await cryptor.encrypt(token),
                };
                try {
                    const response = await fetch(`user/validatetoken`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(tokenData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                    }
                    else {
                        const newToken = await cryptor.decrypt(data.token);
                        sessionStorage.setItem('token', newToken);
                        showAlert({ severity: 'success', message: 'Logged in successfully.' });

                        handleLoginSuccess(data.state);
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                }
            }
        };
        if (!signUp)
            validateToken();
    }, []);

    const handleMailVerifyDialogClose = () => {
        setOpenMailVerifyDialog(false);
    }

    const handleMailVerifySuccess = () => {
        setOpenMailVerifyDialog(false);
        setSignMode('location-info');
    }

    const handleLoginSuccess = (state) => {
        console.log(state);

        if (state === 'location')
            setSignMode('location-info');
        if (state === 'success')
            setSignMode('user-profile');
    }

    const handleNext = () => {

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
                        {signUp ? 'Sign Up' : 'Log In'}
                    </div>
                    <div className={lightMode ? 'signup-main-light-inputs' : 'signup-main-dark-inputs'}>
                        {signMode === 'mail-info' ?
                            <MailInfoControl setOpenMailVerifyDialog={setOpenMailVerifyDialog} signUp={signUp} onLoginSuccess={handleLoginSuccess} />
                            : <div>
                                {signMode === 'location-info' ?
                                    <LocationInfoControl />
                                    : <div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </span>
            <MailVerificationDialog
                onClose={handleMailVerifyDialogClose}
                onVerifySuccess={handleMailVerifySuccess}
                open={openMailVerifyDialog}
            />
        </div>
    );
};

export default Sign;
