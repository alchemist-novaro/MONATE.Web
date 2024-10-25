import * as React from 'react';
import TextField from '@mui/material/TextField';
import { IMaskInput } from 'react-imask';
import { useLight } from '../globals/redux-store';

export const MyTextField = ({ required, name, value, id, style, onChange, error, inputComponent, type, autoComplete }) => {
    const lightMode = useLight();

    return (
        <TextField
            required={required}
            id={id}
            label={name}
            defaultValue={value}
            type={type}
            style={style}
            onChange={onChange}
            error={Boolean(error)}
            helperText={error}
            autoComplete={autoComplete}
            InputProps={{
                inputComponent: inputComponent,
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#7f8f8f',
                    },
                    '&:hover fieldset': {
                        borderColor: lightMode ? '#1f1fcf' : '#1fcfcf',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: lightMode ? '#1f2f2f' : '#cfdfdf',
                    },
                },
                input: {
                    color: lightMode ? '#1f2f2f' : '#cfdfdf',
                },
                '& .MuiInputLabel-root': {
                    color: '#7f8f8f',
                    fontSize: '16px',
                    fontWeight: 'bold',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: lightMode ? '#1f2f2f' : '#cfdfdf',
                },
            }}
        />
    );
};

export const ZipCodeMask = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#0000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export const CreditCardNumberMask = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#000 0000 0000 0000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export const CreditCardCVVMask = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#00"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export const CreditCardDateMask = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#0/00"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});