import { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import './style.css';

import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found';
import Sign from './pages/sign';
import AlertProvider from './components/alerts';
import NavbarProvider from './components/navbar';
import { initRegion, useSaveRegion } from './globals/redux-store';

const App = (props) => {
    sessionStorage.setItem('password', '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF');

    const saveRegion = useSaveRegion();

    const region = sessionStorage.getItem('region');
    useEffect(() => {
        const fetchRegion = async () => {
            if (region === null) {
                const regionData = await initRegion();
                sessionStorage.setItem('region', regionData.country);
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
                        <Route exact path="/" element={<Dashboard />} />
                        <Route exact path="/signup" element={<Sign signUp />} />
                        <Route exact path="/login" element={<Sign />} />
                        <Route exact path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </NavbarProvider>
        </AlertProvider>
    );
}

export default App;
