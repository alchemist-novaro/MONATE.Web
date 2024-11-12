import { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import './style.css';

import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found';
import Portfolio from './pages/portfolio';
import Sign from './pages/sign';
import AlertProvider from './components/alerts';
import NavbarProvider from './components/navbar';
import { initRegion, useSaveRegion } from './globals/redux-store';

const App = (props) => {
    const saveRegion = useSaveRegion();

    const region = localStorage.getItem('region');
    const password = localStorage.getItem('password');
    useEffect(() => {
        const fetchRegion = async () => {
            if (password === null)
                localStorage.setItem('password', '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF');
            if (region === null) {
                const regionData = await initRegion();
                localStorage.setItem('region', regionData.country);
                saveRegion(regionData.country);
            }
        };
        fetchRegion();
    }, []);

    return (
        <AlertProvider>
            <NavbarProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/signup" element={<Sign signUp />} />
                        <Route path="/login" element={<Sign />} />
                        <Route path="/upload-portfolio" element={<Portfolio />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </NavbarProvider>
        </AlertProvider>
    );
}

export default App;
