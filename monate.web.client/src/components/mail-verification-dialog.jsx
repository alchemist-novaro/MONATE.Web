import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MyTextField } from '../components/my-controls';
import { useEmail } from '../globals/redux_store';
import CryptionHelper from '../../helpers/cryption-helper';

const MailVerificationDialog = (props) => {
    const { onClose, onVerifySuccess, open } = props;

    const email = useEmail();
    const [verifyCode, setVerifyCode] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        setVerifyCode(value);
        if (value.length !== 6) {
            setError('Input must be 6 characters long.');
        } else {
            setError('');
        }
    };

    const handleSubmit = async() => {
        if (verifyCode.length !== 6)
            return;

        const cryptor = new CryptionHelper();
        await cryptor.initialize();
        const verifyData = {
            email: await cryptor.encrypt(emailAddr),
            code: await cryptor.encrypt(verifyCode),
        };

        try {
            const response = await fetch(`verifyemail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verifyData),
            }).then(response => {
                if (!response.ok) {
                    const data = response.json();
                    showAlert({ severity: 'error', message: data.message });
                    return;
                }
                else {
                    onVerifySuccess();
                    showAlert({ severity: 'success', message: 'Verified successfully.' });
                }
            });
        } catch (error) {
            showAlert({ severity: 'error', message: error.message });
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter your 6 numbers of verification code.
                </DialogContentText>
                <MyTextField
                    autoFocus
                    required
                    margin='dense'
                    name='verifyCode'
                    id='verifyCode'
                    variant='standard'
                    error={error}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
};

export default MailVerificationDialog;