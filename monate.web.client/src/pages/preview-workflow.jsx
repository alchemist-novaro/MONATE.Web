import { useState, useEffect, useRef } from 'react';
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
import { setToken } from '../globals/reducers';

const PreviewWorkflow = (props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const email = useEmail();
    const token = useToken();
    const lightMode = useLightMode();
    const saveToken = useSaveToken();

    const [uuid, setUUID] = useState(''); 

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
    const [serverUrl, setServerUrl] = useState('localhost:8188');
    const [disabledButton, setDisabledButton] = useState(false);
    const [buttonText, setButtonText] = useState('');
    const [lastStatus, setLastStatus] = useState('');
    const [downloadedImages, setDownloadedImages] = useState([]);
    const [hookToken, setHookToken] = useState('');
    const [mainOutputImage, setMainOutputImage] = useState('');

    const [socket, setSocket] = useState(null);
    const [websocket, setWebsocket] = useState(null);

    const hookRef = useRef({
        uuid: uuid, socket: socket, hookToken: token, serverUrl: serverUrl, lastStatus: lastStatus
    });
    useEffect(() => {
        hookRef.current = {
            uuid: uuid, socket: socket, hookToken: hookToken, serverUrl: serverUrl, lastStatus: lastStatus
        }
    }, [uuid, socket, hookToken, serverUrl, lastStatus]);

    useEffect(() => {
        const initializeWebsocket = () => {
            const ws = new WebSocket(`ws://${import.meta.env.VITE_WEBSOCKET_SERVER}/comfyui`);
            setWebsocket(ws);

            ws.onopen = () => {
                ;
            };

            ws.onmessage = (event) => {
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
                    setLastStatus('d');
                    if (hookRef.current.lastStatus !== 'd') {
                        downloadOutputs();
                        setButtonText('Downloading...');
                    }
                }
                if (event.data === 'Error') {
                    setLastStatus('e');
                    if (hookRef.current.lastStatus !== 'e') {
                        showAlert({ severity: 'error', message: 'Error ocurred in server side.' });
                        setButtonText('');
                        setDisabledButton(false);
                    }
                }
                if (event.data !== 'Error' && event.data !== 'None') {
                    setTimeout(() => {
                        const currentUuid = hookRef.current.uuid;
                        sendMessage(currentUuid);
                    }, 300);
                }
            }

            ws.onclose = () => {
                ;
            };

            ws.onerror = (error) => {
                ;
            };

            setSocket(ws);

            return () => {
                ws.close();
                setSocket(null);
            };
        }
        initializeWebsocket();
    }, []);

    const redirect = (url) => {
        navigate(url);
        setSocket(null);
        if (websocket !== null)
            websocket.close();
        setWebsocket(null);
    }

    const downloadOutputs = async () => {
        if (email && token) {
            const clientIdData = {
                email: await encrypt(email.toLowerCase()),
                token: await encrypt(hookRef.current.hookToken),
                clientId: await encrypt(hookRef.current.uuid),
                serverAddress: await encrypt(hookRef.current.serverUrl),
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
                    showAlert({ severity: 'error', message: "Internal server error ocurred." });
                }
                else {
                    setDisabledButton(false);
                    setButtonText('');
                    setDownloadedImages(data.images);
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                redirect('/');
            }
        }
        else {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            redirect('/login');
        }
    }

    const sendMessage = (message) => {
        if (hookRef.current.socket && hookRef.current.socket.readyState === WebSocket.OPEN) {
            hookRef.current.socket.send(message);
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
                        redirect('/');
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

                        setVersion(_version);
                        setPrice(parseFloat(_price));
                        setGPUUsage(parseFloat(_gPUUsage));
                        setDescription(_description);
                        setEndpointName(_endpointName);
                        setImage(_image);
                        setWorkflowData(_workflowData);
                        setEndpointImage(_endpointImage);
                        setInputValues(_inputValues);
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                    redirect('/');
                }
            }
            else {
                showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
                redirect('/login');
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
            setMainOutputImage('');

            const uuid = uuidv4();
            setUUID(uuid);
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
                    showAlert({ severity: 'error', message: 'Internal server error ocurred.' });
                }
                else {
                    const _token = await decrypt(data.token);
                    saveToken(_token);
                    setHookToken(_token);
                    sendMessage(uuid);
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                redirect('/');
            }
        }
        else {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            setDisabledButton(false);
            redirect('/login');
        }
    }

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                <div style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'center',
                    width: '1400px', marginTop: '120px', marginBottom: '100px'
                }}>
                    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                    {inputValue.type === 'INT' && 
                                        <div
                                            style={{
                                                marginBottom: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '303px',
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
                                            <MyTextField
                                                required
                                                type='number'
                                                onChange={(e) => {
                                                    const tmp = [...inputValues];
                                                    tmp[index] = {
                                                        ...tmp[index],
                                                        value: parseInt(e.target.value),
                                                    }
                                                    setInputValues(tmp);
                                                }}
                                                style={{ width: '303px', marginLeft: '15px', marginRight: '15px', marginBottom: '20px' }}
                                            />
                                        </div>}
                                    {inputValue.type === 'FLOAT' &&
                                        <div
                                            style={{
                                                marginBottom: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '303px',
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
                                            <MyTextField
                                                required
                                                type='number'
                                                onChange={(e) => {
                                                    const tmp = [...inputValues];
                                                    tmp[index] = {
                                                        ...tmp[index],
                                                        value: parseFloat(e.target.value),
                                                    }
                                                    setInputValues(tmp);
                                                }}
                                                style={{ width: '303px', marginLeft: '15px', marginRight: '15px', marginBottom: '20px' }}
                                            />
                                        </div>}
                                    {inputValue.type === 'STRING' && 
                                        <div
                                            style={{
                                                marginBottom: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '303px',
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
                                            <MyTextField
                                                required
                                                onChange={(e) => {
                                                    const tmp = [...inputValues];
                                                    tmp[index] = {
                                                        ...tmp[index],
                                                        value: e.target.value,
                                                    }
                                                    setInputValues(tmp);
                                                }}
                                                style={{ width: '303px', marginLeft: '15px', marginRight: '15px', marginBottom: '20px' }}
                                            />
                                        </div>}
                                    {inputValue.type === 'MULTILINE_STRING' && 
                                        <div
                                            style={{
                                                marginBottom: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '303px',
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
                                            <MyMultilineTextField
                                                required
                                                rows='3'
                                                onChange={(e) => {
                                                    const tmp = [...inputValues];
                                                    tmp[index] = {
                                                        ...tmp[index],
                                                        value: e.target.value,
                                                    }
                                                    setInputValues(tmp);
                                                }}
                                                style={{ width: '303px', marginLeft: '15px', marginRight: '15px', marginBottom: '20px' }}
                                            />
                                        </div>}
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
                                                    width: '303px',
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
                                                    marginLeft: '12px',
                                                    marginRight: '12px',
                                                    marginBottom: '20px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '303px',
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
                        <div style={{ width: '1000px', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '25px', marginTop: '25px' }}>
                            Output Images
                        </div>
                        <div style={{ width: '1000px', height: '3px', backgroundColor: lightMode ? '#1f2f2f' : '#dfefef', marginTop: '5px' }} />
                        {mainOutputImage && <img style={{ width: '1000px' }} src={mainOutputImage} />}
                        <div style={{
                            width: '1000px', marginTop: '20px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'
                        }}>
                            {downloadedImages.map((downloadedImage, index) => (
                                <div key={index}>
                                    <div
                                        style={{
                                            marginBottom: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
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
                                            {downloadedImage.fileName}
                                        </div>
                                        <div
                                            htmlFor={`file-input-${index}`}
                                            style={{
                                                cursor: 'pointer',
                                                marginLeft: '12px',
                                                marginRight: '12px',
                                                marginBottom: '20px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '303px',
                                                height: '240px',
                                                borderRadius: '15px',
                                                border: '3px solid #7f8f8f',
                                            }}
                                            onClick={() => {
                                                setMainOutputImage(`data:image/png;base64,${downloadedImage.imageData}`);
                                            }}
                                        >
                                            {downloadedImage.imageData ? (
                                                <img
                                                    src={`data:image/png;base64,${downloadedImage.imageData}`}
                                                    alt={`Image ${index}`}
                                                    style={{ width: '303px', height: '240px', borderRadius: '12px' }}
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Header />
        </div>
    )
};

export default PreviewWorkflow;