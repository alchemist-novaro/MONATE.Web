import { Link } from 'react-router-dom';
import { useLight } from '../globals/redux_store';
import ModeSwitch from './mode-switch';
import { MonateIcon } from './svg-icons';
import './mail-check-page.css';

const MailCheckPage = (props) => {
    const lightMode = useLight();

    const mcImage = `/sign-up/mails/mail-${lightMode ? 'light' : 'dark'}.jpg`;

    return (
        <div>
            <div className={lightMode ? 'mc-light-header' : 'mc-dark-header'}>
                <Link to='/' className={(lightMode ? 'mc-light-link-title' : 'mc-dark-link-title') + ' Large mc-title-link'}>
                    <div className='mc-title'><MonateIcon />ONATE</div>
                </Link>
                <ModeSwitch />
            </div>
            <span className='mc-body'>
                <div className={lightMode ? 'mc-navbar-light' : 'mc-navbar-dark'} style={{ backgroundImage: `url("${mcImage}")` }}>
                </div>
                <div className={lightMode ? 'mc-main-light' : 'mc-main-dark'}>
                    
                </div>
            </span>
        </div>
    );
};

export default MailCheckPage;