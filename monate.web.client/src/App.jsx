import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import './style.css';

import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App;
