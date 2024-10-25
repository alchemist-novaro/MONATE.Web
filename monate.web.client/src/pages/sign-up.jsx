import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useLight } from '../globals/redux-store';
import { MonateIcon } from '../components/svg-icons';
import ModeSwitch from '../components/mode-switch';
import MailVerificationDialog from '../components/mail-verification-dialog';
import MailInfoControl from '../components/mail-info-control';
import LocationInfoControl from '../components/location-info-control';
import './sign-up.css';

const SignUp = (props) => {
    const lightMode = useLight();

    const [openMailVerifyDialog, setOpenMailVerifyDialog] = useState(false);
    const [signUpMode, setSignUpMode] = useState('location-info');

    const signupImage = `/sign-up/mails/mail-${lightMode ? 'light' : 'dark'}.jpg`;

    const handleMailVerifyDialogClose = () => {
        setOpenMailVerifyDialog(false);
    }

    const handleMailVerifySuccess = () => {
        setOpenMailVerifyDialog(false);
        setSignUpMode('location-info');
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
                        Sign Up
                    </div>
                    <div className={lightMode ? 'signup-main-light-inputs' : 'signup-main-dark-inputs'}>
                        {signUpMode === 'mail-info' ?
                            <MailInfoControl setOpenMailVerifyDialog={setOpenMailVerifyDialog} />
                            : <div>
                                {signUpMode === 'location-info' ?
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

export default SignUp;
