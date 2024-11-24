import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
    useEmail,
    useToken, useSaveToken,
    useLightMode,
} from '../globals/interface';
import { useAlert } from '../components/alerts';
import Header from '../components/header';
import { MyTextField, MyMultilineTextField } from '../components/my-controls';
import { UploadIcon } from '../components/svg-icons';
import useCryptionHelper from '../../helpers/cryption-helper';
import './preview-workflow.css';

const PreviewWorkflow = (props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const email = useEmail();
    const token = useToken();
    const lightMode = useLightMode();
    const saveToken = useSaveToken();

    const { encrypt, decrypt } = useCryptionHelper();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const [version, setVersion] = useState('');
    const [price, setPrice] = useState(0);
    const [gPUUsage, setGPUUsage] = useState(0);
    const [description, setDescription] = useState('');
    const [endpointName, setEndpointName] = useState('');
    const [image, setImage] = useState('');
    const [workflowData, setWorkflowData] = useState('');
    const [endpointImage, setEndpointImage] = useState('');
    const [inputValues, setInputValues] = useState([]);
    const [outputIndex, setOutputIndex] = useState(0);
    const [serverUrl, setServerUrl] = useState('localhost:8188');
    const [uuid, setUuid] = useState('');
    const [disabledButton, setDisabledButton] = useState(false);
    const [buttonText, setButtonText] = useState('');
    const [lastStatus, setLastStatus] = useState('');
    const [downloadedImages, setDownloadedImages] = useState([]);

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const initializeWebsocket = () => {
            const ws = new WebSocket('ws://localhost:5177/comfyui');

            ws.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.onmessage = (event) => {
                console.log(event);
                if (event.data === 'Uploading') {
                    setButtonText('Uploading data...');
                }
                if (event.data === 'Prompting') {
                    setButtonText('Uploading workflow...');
                }
                if (event.data === 'Working') {
                    setLastStatus('w');
                    setButtonText('Processing...');
                }
                if (event.data === 'Downloading') {
                    if (lastStatus !== 'd') {
                        downloadOutputs();
                    }
                    setLastStatus('d');
                    setButtonText('Downloading...');
                }
                if (event.data === 'Error') {
                    if (lastStatus !== 'e') {
                        showAlert({ severity: 'error', message: 'Error ocurred in server side.' });
                        setButtonText('');
                        setDisabledButton(false);
                    }
                    setLastStatus('e');
                }
                if (event.data !== 'Error' && event.data !== 'None') {
                    console.log("Sending message...");
                    setTimeout(() => {
                        console.log(uuid);
                        sendMessage(uuid);
                    }, 300);
                }
            }

            ws.onclose = () => {
                console.log('WebSocket disconnected');
            };

            ws.onerror = (error) => {
                console.error('WebSocket error', error);
            };

            setSocket(ws);

            return () => {
                ws.close();
            };
        }
        initializeWebsocket();
    }, []);

    const downloadOutputs = async () => {
        if (email && token) {
            const clientIdData = {
                email: await encrypt(email.toLowerCase()),
                token: await encrypt(token),
                clientId: await encrypt(uuid),
                serverAddress: await encrypt(serverUrl),
            };
            try {
                const response = await fetch(`workflow/downloadimages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clientIdData),
                });
                const data = await response.json();

                if (!response.ok) {
                    showAlert({ severity: 'error', message: data.message });
                    navigate('/');
                }
                else {
                    console.log(data);
                    setDisabledButton(false);
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                navigate('/');
            }
        }
        else {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            navigate('/login');
        }
    }

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log(message);
            socket.send(message);
        }
    };
            
    useEffect(() => {
        const getWorkflow = async () => {
            if (email && token) {
                const workflowIdData = {
                    email: await encrypt(email.toLowerCase()),
                    token: await encrypt(token),
                    id: await encrypt(`${id}`),
                };
                try {
                    const response = await fetch(`workflow/getworkflow`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(workflowIdData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                        navigate('/');
                    }
                    else {
                        const _version = await decrypt(data.version);
                        const _price = await decrypt(data.price);
                        const _gPUUsage = await decrypt(data.gpuUsage);
                        const _description = await decrypt(data.description);
                        const _endpointName = await decrypt(data.endpointName);
                        const _image = await decrypt(data.image);
                        const _workflowData = await decrypt(data.workflowData);
                        const _endpointImage = await decrypt(data.endpointImage);
                        const _inputValues = await data.inputValues;
                        const _outputIndex = await data.outputIndex;

                        setVersion(_version);
                        setPrice(parseFloat(_price));
                        setGPUUsage(parseFloat(_gPUUsage));
                        setDescription(_description);
                        setEndpointName(_endpointName);
                        setImage(_image);
                        setWorkflowData(_workflowData);
                        setEndpointImage(_endpointImage);
                        setInputValues(_inputValues);
                        setOutputIndex(_outputIndex);
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                    navigate('/');
                }
            }
            else {
                showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
                navigate('/login');
            }
        }
        getWorkflow();
    }, []);

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedInputValues = [...inputValues];
                updatedInputValues[index] = {
                    ...updatedInputValues[index],
                    image: reader.result,
                    value: file.name,
                };
                setInputValues(updatedInputValues);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRunWorkflow = async () => {
        if (email && token) {
            setDisabledButton(true);

            const uuid = uuidv4();
            setUuid(uuid);
            const promptData = {
                email: await encrypt(email.toLowerCase()),
                token: await encrypt(token),
                serverUrl: await encrypt(serverUrl),
                clientId: await encrypt(uuid),
                workflowData: await encrypt(workflowData),
                inputValues: inputValues,
            };
            try {
                const response = await fetch(`workflow/queueprompt`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(promptData),
                });
                const data = await response.json();

                if (!response.ok) {
                    showAlert({ severity: 'error', message: data.message });
                    navigate('/');
                }
                else {
                    const _token = await decrypt(data.token);
                    saveToken(_token);
                    sendMessage(uuid);
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                navigate('/');
            }
        }
        else {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            setDisabledButton(false);
            navigate('/login');
        }
    }

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                <div style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'center',
                    width: '1400px', marginTop: '120px', marginBottom: '100px'
                }}>
                    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{
                            width: '350px', height: '340px', backgroundColor: lightMode ? '#dfefef' : '#1f2f2f', alignItems: 'center',
                            border: '4px solid #7f8f8f', borderRadius: '10px', display: 'flex', flexDirection: 'column'
                        }}>
                            <img src={endpointImage} alt='EndpointImage' style={{ width: '350px', height: '287.5px', borderRadius: '6px 6px 0px 0px' }} />
                            <div style={{ fontSize: '30px', color: lightMode ? '#1f2f2f' : '#dfefef', marginTop: '10px' }}>
                                {endpointName}
                            </div>
                        </div>
                        <div style={{
                            width: '350px', height: '340px', backgroundColor: lightMode ? '#dfefef' : '#1f2f2f', alignItems: 'center',
                            border: '4px solid #7f8f8f', borderRadius: '10px', display: 'flex', flexDirection: 'column', marginTop: '15px'
                        }}>
                            <img src={image} alt='EndpointImage' style={{ width: '350px', height: '287.5px', borderRadius: '6px 6px 0px 0px' }} />
                            <div style={{ fontSize: '30px', color: lightMode ? '#1f2f2f' : '#dfefef', marginTop: '10px' }}>
                                {`${version} (${price === 0 ? 'Free' : `$${price}`})`}
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <MyTextField
                            required
                            name='Server URL'
                            value={serverUrl}
                            onChange={(e) => {
                                setServerUrl(e.target.value);
                            }}
                            id='serverUrl'
                            style={{ width: '1000px' }}
                        />
                        <div style={{ width: '1000px', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '25px', marginTop: '25px' }}>
                            Input Values
                        </div>
                        <div style={{ width: '1000px', height: '3px', backgroundColor: lightMode ? '#1f2f2f' : '#dfefef', marginTop: '5px' }} />
                        <div style={{
                            width: '1000px', marginTop: '20px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'
                        }}>
                            {inputValues.map((inputValue, index) => (
                                <div key={index}>
                                    {inputValue.type === 'INT' && <MyTextField
                                        required
                                        name={inputValue.name}
                                        type='number'
                                        onChange={(e) => {
                                            inputValues[index] = {
                                                ...inputValues[index],
                                                value: e.target.value,
                                            }
                                            setInputValues(inputValues);
                                        }}
                                        style={{ width: '320px', marginLeft: '15px', marginRight: '15px', marginBottom: '20px' }}
                                    />}
                                    {inputValue.type === 'FLOAT' && <MyTextField
                                        required
                                        name={inputValue.name}
                                        type='number'
                                        onChange={(e) => {
                                            inputValues[index] = {
                                                ...inputValues[index],
                                                value: e.target.value,
                                            }
                                            setInputValues(inputValues);
                                        }}
                                        style={{ width: '320px', marginLeft: '15px', marginRight: '15px', marginBottom: '20px' }}
                                    />}
                                    {inputValue.type === 'STRING' && <MyTextField
                                        required
                                        name={inputValue.name}
                                        onChange={(e) => {
                                            inputValues[index] = {
                                                ...inputValues[index],
                                                value: e.target.value,
                                            }
                                            setInputValues(inputValues);
                                        }}
                                        style={{ width: '320px', marginLeft: '15px', marginRight: '15px', marginBottom: '20px' }}
                                    />}
                                    {inputValue.type === 'MULTILINE_STRING' && <MyMultilineTextField
                                        required
                                        rows='3'
                                        name={inputValue.name}
                                        onChange={(e) => {
                                            inputValues[index] = {
                                                ...inputValues[index],
                                                value: e.target.value,
                                            }
                                            setInputValues(inputValues);
                                        }}
                                        style={{ width: '320px', marginLeft: '15px', marginRight: '15px', marginBottom: '20px' }}
                                    />}
                                    {inputValue.type === 'IMAGE' && (
                                        <div
                                            style={{
                                                marginBottom: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`file-input-${index}`}
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileChange(index, e)}
                                            />
                                            <div
                                                style={{
                                                    width: '320px',
                                                    height: '30px',
                                                    borderRadius: '15px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    fontSize: '20px',
                                                    color: lightMode ? '#1f2f2f' : '#dfefef',
                                                }}
                                            >
                                                {inputValue.name}
                                            </div>
                                            <label
                                                htmlFor={`file-input-${index}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    marginLeft: '15px',
                                                    marginRight: '15px',
                                                    marginBottom: '20px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '320px',
                                                    height: '240px',
                                                    borderRadius: '15px',
                                                    border: '3px solid #7f8f8f',
                                                }}
                                            >
                                                {inputValues[index].image ? (
                                                    <img
                                                        src={inputValues[index].image}
                                                        alt={`Image ${index}`}
                                                        style={{ width: '320px', height: '240px', borderRadius: '12px' }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            width: '100%',
                                                            height: '100%',
                                                        }}
                                                    >
                                                        <UploadIcon width="30px" height="30px" />
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div disabled={disabledButton} className={lightMode ? 'workflow-button-light' : 'workflow-button-dark'}
                            style={{
                                width: '300px', marginTop: '40px',
                                backgroundColor: disabledButton ? '#7f8f8f' : '',
                                pointerEvents: disabledButton ? 'none' : 'auto',
                            }}
                            onClick={handleRunWorkflow}>
                            {buttonText ? buttonText : 'Run Workflow'}
                        </div>
                    </div>
                </div>
            </div>
            <Header />
        </div>
    )
};

export default PreviewWorkflow;