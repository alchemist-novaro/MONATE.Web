import React, { useState, useEffect } from 'react';
import './header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

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

    // Change the class of the header based on the "scrolled" state
    let headerClasses = ['header'];
    if (scrolled) {
        headerClasses.push('scrolled');
    }

    return (
        <header className={headerClasses.join(' ')}>
            
        </header>
    );
};

export default Header;