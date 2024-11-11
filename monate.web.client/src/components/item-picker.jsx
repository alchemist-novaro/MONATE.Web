import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { useLight } from '../globals/redux-store';
import { CloseIcon } from './svg-icons';
import './item-picker.css';

const ItemPicker = ({ style, items, selectedItems, setSelectedItems, placeholder }) => {
    const lightMode = useLight();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedItems, setSearchedItems] = useState(items);
    const [textInputFocused, setTextInputFocused] = useState(false);

    useEffect(() => {
        const initializeSearchedItems = () => {
            if (!selectedItems)
                setSearchedItems([]);

            const initializedSerchedItems = items.filter(item =>
                !selectedItems.some(selected => selected[1] === item[1])
            );
            setSearchedItems(initializedSerchedItems);
        }
        initializeSearchedItems();
    }, []);

    const removeItem = (item) => {
        setSelectedItems(selectedItems.filter((_item) => _item[1] !== item[1]));
        updateSearchedItems(searchQuery, selectedItems.filter((_item) => _item[1] !== item[1]));
    };

    const onTextInputFocused = () => {
        setTextInputFocused(true);
    };

    const onTextInputBlurred = () => {
        setTimeout(() => setTextInputFocused(false), 150);
    };

    const selectItem = (item) => {
        if (!selectedItems.some(selected => selected[1] === item[1])) {
            setSelectedItems([...selectedItems, item]);
        }
        setSearchQuery('');
        updateSearchedItems('', [...selectedItems, item]);
        setTextInputFocused(false);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        updateSearchedItems(query, selectedItems);
    };

    const updateSearchedItems = (query, currentSelectedItems) => {
        const filteredItems = items.filter(item =>
            item[0].toLowerCase().includes(query.toLowerCase()) &&
            !currentSelectedItems.some(selected => selected[1] === item[1])
        );
        setSearchedItems(filteredItems);
    };

    return (
        <div style={{
            ...style,
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '5px',
            border: '1.5px solid #7f8f8f', borderRadius: '5px', position: 'relative'
        }}>
            {selectedItems.map((item, index) => (
                <div key={index} style={{
                    height: '20px', borderRadius: '10px', fontSize: '15px', margin: '3px',
                    color: lightMode ? '#1f2f2f' : '#dfefef', padding: '2px',
                    display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    border: `1px solid ${lightMode ? '#1f2f2f' : '#dfefef'}`
                }}>
                    &nbsp;&nbsp;{item[0]}&nbsp;
                    <div style={{ cursor: 'pointer', height: '18px' }} onClick={() => removeItem(item)}>
                        <CloseIcon width='18px' height='18px' />
                    </div>
                    &nbsp;
                </div>
            ))}
            <div style={{ flexGrow: 1, marginLeft: '5px' }}>
                <TextField
                    variant="standard"
                    placeholder={placeholder}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={onTextInputFocused}
                    onBlur={onTextInputBlurred}
                    sx={{
                        width: '100%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        '& .MuiInputBase-input': {
                            color: lightMode ? '#1f2f2f' : '#dfefef',
                        },
                    }}
                />
                {(textInputFocused && searchedItems.length !== 0) && (
                    <div style={{
                        backgroundColor: lightMode ? '#d3e3e3' : '#1f2f2f',
                        width: '300px',
                        border: '1px solid #7f8f8f', position: 'absolute',
                        display: 'flex', flexDirection: 'column',
                        maxHeight: '90px', overflowY: 'auto',
                    }}>
                        {searchedItems.map((item, index) => (
                            <div
                                key={index}
                                className={lightMode ? 'list-item-light' : 'list-item-dark'}
                                onMouseDown={() => selectItem(item)}
                                style={{ cursor: 'pointer', padding: '5px' }}
                            >
                                {item[0]}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemPicker;
