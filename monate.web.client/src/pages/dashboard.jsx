import Header from '../components/header.jsx';
import { useLight } from '../globals/redux_store.jsx';

import './dashboard.css';

const Dashboard = (props) => {
    const lightMode = useLight();

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div>
                <Header />
            </div>
        </div>
    );
}

export default Dashboard;