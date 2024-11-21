import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/header';
import { useAlert } from '../components/alerts';
import { AddIcon } from '../components/svg-icons';
import {
    useLightMode,
    useEmail,
    useToken
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';
import './get-endpoint.css';

const GetEndpoint = (props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const { encrypt, decrypt } = useCryptionHelper();
    const { showAlert } = useAlert();

    const email = useEmail();
    const token = useToken();

    const [title, setTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [endpointImage, setEndpointImage] = useState('');
    const [description, setDescription] = useState('');
    const [userType, setUserType] = useState('');
    const [categories, setCategories] = useState([]);
    const [workflows, setWorkflows] = useState([]);
    const [isPreview, setIsPreview] = useState(true);

    useEffect(() => {
        const getEndpoint = async () => {
            if (email && token && id) {
                const endpointData = {
                    email: await encrypt(email.toLowerCase()),
                    token: await encrypt(token),
                    id: await encrypt(id),
                };
                try {
                    const response = await fetch(`endpoint/getendpoint`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(endpointData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                        window.location.href = '/';
                    }
                    else {
                        const _title = await decrypt(data.title);
                        const _userName = await decrypt(data.userName);
                        const _userEmail = await decrypt(data.userEmail);
                        const _userAvatar = await decrypt(data.userAvatar);
                        const _endpointImage = await decrypt(data.imageData);
                        const _description = await decrypt(data.description);
                        const _userType = await decrypt(data.userType);

                        setTitle(_title);
                        setUserName(_userName);
                        setUserEmail(_userEmail);
                        setUserAvatar(_userAvatar);
                        if (_userType === 'administrator') {
                            setUserType("Administrator")
                        }
                        else if (_userType === "team") {
                            setUserType("MONATE");
                        }
                        setEndpointImage(_endpointImage);
                        setDescription(_description);
                        setCategories(data.categories);
                        setWorkflows(data.workflows);

                        if (email === _userEmail)
                            setIsPreview(false);
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                    window.location.href = '/';
                }
            }
        }
        getEndpoint();
    }, []);

    const lightMode = useLightMode();
    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '70px', alignItems: 'center' }}>
                <div style={{ width: '1400px', display: 'flex', flexDirection: 'column', marginTop: '30px', alignItems: 'center' }}>
                    <div style={{ fontSize: '50px', color: lightMode ? '#1f2f2f' : '#dfefef' }}>{title}</div>
                    <div style={{ width: '1400px', marginTop: '30px', display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '1000px', display: 'flex', flexDirection: 'column' }}>
                            <div disabled={isPreview} style={{ marginLeft: '50px', cursor: 'pointer', width: '900px' }}>
                                {endpointImage ?
                                    <img src={endpointImage} alt="EndpointImage" style={{ width: '900px', height: '675px', borderRadius: '30px' }} />
                                    : <div style={{ width: '1000px', height: '750ox', borderRadius: '30px' }} />}
                            </div>
                        </div>
                        <div style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '25px', marginBottom: '20px' }}>Workflows</div>
                            {workflows && workflows.map((workflow, index) => (
                                <div key={index} style={{ marginBottom: '10px', width: '400px', height: '300px', borderRadius: '10px' }}>
                                    {workflow.image && <img src={workflow.image} style={{ width: '400px', height: '300px' }} />}
                                    {workflow.permition === 0 && <div style={{
                                        width: '400px', height: '300px', color: 'blue',
                                        backgroundColor: '#ffff0077', fontSize: '20px',
                                    }}>Pending now</div>}
                                    {workflow.permition === 2 && <div style={{
                                        width: '400px', height: '300px', color: 'green',
                                        backgroundColor: '#ff000077', fontSize: '20px',
                                    }}>Suspended</div>}
                                </div>
                            ))}
                            {!isPreview &&
                                <div style={{
                                    width: '400px', height: '300px', borderRadius: '10px', border: `4px solid #7f8f8f`,
                                    display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
                                }}>
                                    <AddIcon width='100px' height='100px' disabled /> 
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
            <Header />
        </div>
    );
}

export default GetEndpoint;