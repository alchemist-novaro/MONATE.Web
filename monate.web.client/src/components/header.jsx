import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DisplayRegion from './display-region';
import ModeSwitch from './mode-switch';
import { MonateIcon } from './svg-icons';
import { useLight, useAvatar, useUserName } from '../globals/redux_store';

import './header.css';

const Header = (props) => {
    const [scrolled, setScrolled] = useState(false);
    const lightMode = useLight();
    const userName = useUserName();
    const avatar = useAvatar();
    const navigate = useNavigate();

    // Monitor the scroll position and set "scrolled" state
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    let headerClasses = ['header' + (lightMode ? '-light' : '-dark')];
    if (scrolled) {
        headerClasses.push('header-scrolled');
    }

    const handleSignUp = () => {
        navigate('/signup');
    }

    return (
        <header className={headerClasses.join(' ')}>
            <nav className='header-nav'>
                <div>
                    <Link to='/' className={(lightMode ? 'header-light-link-title Large' : 'header-dark-link-title Large') + ' header-title-link'}>
                        <div className='header-title'><MonateIcon />ONATE</div>
                    </Link>
                </div>
                <div className='header-right'>
                    <div className='header-region'>
                        <DisplayRegion />
                    </div>
                    {userName ? (
                        <div>
                            <div className='header-avatar-container'>
                                {avatar ? (
                                    <img src={avatar} className='header-avatar-image'/>
                                ) : (
                                        <div className='header-avatar-div'>
                                        {userName.first[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className='header-name'>
                                {userName.first + ' ' + userName.last[0].toUpperCase() + '.'}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Button variant='text' className='header-log-in-button'
                                style={{ color: lightMode ? '#60f' : '#fff', }}>Log in</Button>
                            <Button variant='text' className='header-sign-up-button'
                                style={{ color: lightMode ? '#60f' : '#fff', }}
                                onClick={handleSignUp}>Sign up</Button>
                        </div>
                    )}
                    <ModeSwitch />
                </div>
            </nav>
        </header >
    );
};

export default Header;