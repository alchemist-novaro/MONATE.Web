import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom'

import Dashboard from './pages/dashboard'
import NotFound from './pages/not-found'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App;
