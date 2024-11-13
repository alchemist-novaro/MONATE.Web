import Header from '../components/header';
import { useLightMode } from '../globals/interface';
import './manager.css';

const Manager = (props) => {
    const lightMode = useLightMode();

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{
                display: 'flex', flexDirection: 'row', width: '100%', height: '100vh',
                backgroundColor: lightMode ? '#cfdfdf' : '#0f1f1f'
            }}>
            </div>
            <Header />
        </div>
    )
}

export default Manager;