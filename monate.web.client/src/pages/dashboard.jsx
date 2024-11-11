import { useState } from 'react';
import Header from '../components/header.jsx';
import { useLight } from '../globals/redux-store.jsx';
import AnimatedBackgrounds from '../components/animated-backgrounds.jsx';
import { useAlert } from '../components/alerts.jsx';
import DashboardTabs from '../components/dashboard-tabs.jsx';
import PortfolioControl from '../components/portfolio-control.jsx'
import UserControl from '../components/user-control.jsx';
import Footer from '../components/footer.jsx';
import CryptionHelper from '../../helpers/cryption-helper.js';

import './dashboard.css';

const Dashboard = (props) => {
    const lightMode = useLight();
    const { showAlert } = useAlert();

    const [currentPage, setCurrentPage] = useState('portfolios');

    const onPortfolios = async() => {
        setCurrentPage('portfolios');
    }
    const onUsers = async() => {
        const permition = await validateToken();
        if (permition) {
            setCurrentPage('users');
        }
    }
    const onEndpoints = async () => {
        const permition = await validateToken();
        if (permition) {
            setCurrentPage('endpoints');
        }
    }
    const onAboutUs = async () => {
        const permition = await validateToken();
        if (permition) {
            setCurrentPage('aboutus');
        }
    }

    const validateToken = async () => {
        const token = sessionStorage.getItem('token');
        const email = sessionStorage.getItem('email');
        if (email && token) {
            const cryptor = new CryptionHelper();
            await cryptor.initialize();
            const tokenData = {
                email: await cryptor.encrypt(email.toLowerCase()),
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
                    return false;
                }
                else {
                    const newToken = await cryptor.decrypt(data.token);
                    sessionStorage.setItem('token', newToken);

                    if (data.state === 'pending') {
                        showAlert({ severity: 'error', message: 'Your account is pending now. Please contact with support team.' });
                        return false;
                    }
                    if (data.state === 'suspended') {
                        showAlert({ severity: 'error', message: 'Your account is suspended now. Please contact with support team.' });
                        return false;
                    }
                    return true;
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                return false;
            }
        }
        else {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            return false;
        }
    }

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <AnimatedBackgrounds />
                <DashboardTabs onPortfolios={onPortfolios} onUsers={onUsers} onEndpoints={onEndpoints} onAboutUs={onAboutUs} />
                {currentPage === 'portfolios' &&
                    <PortfolioControl />}
                {currentPage === 'users' &&
                    <UserControl />}
                <Footer />
            </div>
            <Header />
        </div>
    );
}

export default Dashboard;