import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import './style.css';

import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found';
import SignUp from './pages/sign-up';

const App = (props) => {
    sessionStorage.setItem('password', '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF');

    console.log('started');

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
