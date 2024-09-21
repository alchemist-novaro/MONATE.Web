import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const RegionContext = createContext();

// Custom hook to use the RegionContext
export const useRegion = () => useContext(RegionContext);

// Create the provider component
export const RegionProvider = ({ children }) => {
    const [region, setRegion] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get('https://ipinfo.io/json?token=c5118d2d404912');
                setRegion(response.data);
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };

        fetchLocation();
    }, []);

    return (
        <RegionContext.Provider value={region}>
            {children}
        </RegionContext.Provider>
    );
};
