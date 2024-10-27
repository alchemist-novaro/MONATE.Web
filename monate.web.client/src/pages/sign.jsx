import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useLight, useRegion, useSaveRegion, initRegion } from '../globals/redux-store';
import { MonateIcon } from '../components/svg-icons';
import ModeSwitch from '../components/mode-switch';
import MailVerificationDialog from '../components/mail-verification-dialog';
import MailInfoControl from '../components/mail-info-control';
import LocationInfoControl from '../components/location-info-control';
import './sign.css';

const Sign = (props) => {
    const { signUp } = props;

    const lightMode = useLight();
    const region = useRegion();
    const saveRegion = useSaveRegion();

    const [openMailVerifyDialog, setOpenMailVerifyDialog] = useState(false);
    const [signMode, setSignMode] = useState('mail-info');

    const signupImage = `/sign-up/mails/mail-${lightMode ? 'light' : 'dark'}.jpg`;

    useEffect(() => {
        const fetchRegion = () => {
            const email = sessionStorage.getItem('email');
            const emailPassword = sessionStorage.getItem('emailPassword');
            if (email !== null) {
                setSignMode('location-info');
            }
        };
        fetchRegion();
    }, []);

    const handleMailVerifyDialogClose = () => {
        setOpenMailVerifyDialog(false);
    }

    const handleMailVerifySuccess = async() => {
        setOpenMailVerifyDialog(false);
        const fetchRegion = async () => {
            if (region === null) {
                const regionData = await initRegion();
                saveRegion(regionData);
            }
        };
        await fetchRegion();
        setSignMode('location-info');
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
                            <MailInfoControl setOpenMailVerifyDialog={setOpenMailVerifyDialog} signUp={signUp} />
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
