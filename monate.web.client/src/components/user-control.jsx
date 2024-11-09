import { useEffect, useState, useRef } from 'react';
import { useLight } from '../globals/redux-store';
import { useAlert } from './alerts';
import { LocationIcon, GithubIcon, PhoneIcon } from './svg-icons';
import CryptionHelper from '../../helpers/cryption-helper';

const UserElement = ({ id }) => {
    const lightMode = useLight();
    const { showAlert } = useAlert();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [state, setState] = useState('');
    const [region, setRegion] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [userType, setUserType] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const upperRef = useRef(null);
    const lowerRef = useRef(null);
    const [spaceBetween, setSpaceBetween] = useState(0);

    useEffect(() => {
        if (upperRef.current && lowerRef.current) {
            const upperRect = upperRef.current.getBoundingClientRect();
            const lowerRect = lowerRef.current.getBoundingClientRect();
            const heightBetween = lowerRect.top - upperRect.bottom;
            setSpaceBetween(heightBetween);
        }
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const email = sessionStorage.getItem('email').toLowerCase();
            const token = sessionStorage.getItem('token');
            if (email && token) {
                const cryptor = new CryptionHelper();
                await cryptor.initialize();
                const userData = {
                    email: await cryptor.encrypt(email),
                    token: await cryptor.encrypt(token),
                    id: await cryptor.encrypt(id),
                };
                try {
                    const response = await fetch(`user/getuser`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                    }
                    else {
                        const _firstName = await cryptor.decrypt(data.firstName);
                        const _lastName = await cryptor.decrypt(data.lastName);
                        const _state = await cryptor.decrypt(data.state);
                        const _region = await cryptor.decrypt(data.region);
                        const _title = await cryptor.decrypt(data.title);
                        const _description = await cryptor.decrypt(data.description);
                        const _avatar = await cryptor.decrypt(data.avatar);
                        const _githubUrl = await cryptor.decrypt(data.githubUrl);
                        const _userType = await cryptor.decrypt(data.userType);
                        const _phoneNumber = await cryptor.decrypt(data.phoneNumber);

                        setFirstName(_firstName);
                        setLastName(_lastName);
                        setState(_state);
                        setRegion(_region);
                        setTitle(_title);
                        setDescription(_description);
                        setAvatar(_avatar);
                        setGithubUrl(_githubUrl);
                        setPhoneNumber(_phoneNumber);
                        if (_userType === '0')
                            setUserType('Administrator');
                        if (_userType === '1')
                            setUserType('');
                        if (_userType === '2')
                            setUserType('MONATE');
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                }
            }
        };
        getUser();
    }, []);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', borderRadius: '5%', width: '23%', marginLeft: '1%', marginRight: '1%',
            marginTop: '20px', height: '50vh', backgroundColor: lightMode ? '#1f2f2f22' : '#dfefef22', marginBottom: '20px',
            alignItems: 'center', justifyContent: 'space-between',
        }}>
            <div ref={upperRef} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    {userType === "Administrator" &&
                        <div style={{ marginLeft: '15px', fontWeight: 'bold', color: 'blue', backgroundColor: 'orange', height: '1.5vh', marginTop: '2vh', fontSize: '1.3vh', padding: '3px', borderRadius: '3px' }}>
                            Administrator
                        </div>}
                    {!userType &&
                        <div style={{ marginLeft: '15px', fontWeight: 'bold', color: 'blue', backgroundColor: 'transparent', height: '1.5vh', marginTop: '2vh', fontSize: '1.3vh', padding: '3px', borderRadius: '3px' }}>
                        </div>}
                    {userType === "MONATE" &&
                        <div style={{ marginLeft: '15px', fontWeight: 'bold', color: 'blue', backgroundColor: 'greenyellow', height: '1.5vh', marginTop: '2vh', fontSize: '1.3vh', padding: '3px', borderRadius: '3px' }}>
                            MONATE
                        </div>}
                </div>
                {avatar ?
                    <img
                        src={avatar}
                        alt='Avatar'
                        style={{ width: '10vh', height: '10vh', borderRadius: '5vh', border: '1px solid #28c', marginTop: '3vh', }}
                    /> :
                    <div
                        style={{
                            backgroundColor: 'deeppink', width: '10vh', height: '10vh',
                            borderRadius: '5vh', border: '1px solid #28c', objectFit: 'cover',
                            textAlign: 'center', fontSize: '8.5vh', color: 'white', marginTop: '3vh',
                        }}
                    >
                        {firstName && firstName[0].toUpperCase()}
                    </div>
                }
                <div style={{ marginTop: '1.5vh', marginLeft: '1vh', marginRight: '1vh', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '4vh', textAlign: 'center' }}>
                    {firstName + ' ' + lastName}
                </div>
                <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '2vh', textAlign: 'center' }}>
                    {`(${title})`}
                </div>
            </div>
            <div style={{
                marginTop: '2vh', marginBottom: '2vh', height: `${spaceBetween}px`, width: '85%', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '1.5vh',
                overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
                {description}
            </div>
            <div ref={lowerRef} style={{ width: '85%', marginBottom: '2vh' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <LocationIcon width='2vh' height='2vh' />
                    <div style={{ marginLeft: '2%', color: lightMode ? '#1f2f2f' : '#dfefef' }}>
                        {`${state}, ${region}`}
                    </div>
                </div>
                {githubUrl &&
                    <div style={{ marginTop: '1vh', display: 'flex', flexDirection: 'row' }}>
                        <GithubIcon width='2vh' height='2vh' />
                        <div style={{ marginLeft: '2%', color: lightMode ? '#1f2f2f' : '#dfefef' }}>
                            {`${githubUrl}`}
                        </div>
                    </div>}
                {phoneNumber &&
                    <div style={{ marginTop: '1vh', display: 'flex', flexDirection: 'row' }}>
                        <PhoneIcon width='2vh' height='2vh' />
                        <div style={{ marginLeft: '2%', color: lightMode ? '#1f2f2f' : '#dfefef' }}>
                            {`${phoneNumber}`}
                        </div>
                    </div>}
            </div>
        </div>
    );
}

const UserControl = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [userIds, setUserIds] = useState([]);
    const { showAlert } = useAlert();

    useEffect(() => {
        const getUsers = async () => {
            const email = sessionStorage.getItem('email').toLowerCase();
            const token = sessionStorage.getItem('token');
            if (email && token) {
                const cryptor = new CryptionHelper();
                await cryptor.initialize();
                const pageData = {
                    email: await cryptor.encrypt(email),
                    token: await cryptor.encrypt(token),
                    page: await cryptor.encrypt(`${currentPage - 1}`),
                };
                try {
                    const response = await fetch(`user/getusers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(pageData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                    }
                    else {
                        const userIdsStr = await cryptor.decrypt(data.userIds);
                        setUserIds(userIdsStr.split(' '));
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                }
            }
        };
        getUsers();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3vh', flexWrap: 'wrap' }}>
            {userIds.map((str, index) => (
                <UserElement key={index} id={str} />
            ))}
        </div>
    );
}

export default UserControl;