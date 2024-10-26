import { useEffect } from 'react';
import { useRegion, useSaveRegion, initRegion } from '../globals/redux-store';

import './display-region.css'

const DisplayRegion = () => {
    const saveRegion = useSaveRegion();
    const region = useRegion();

    useEffect(() => {
        const fetchRegion = async () => {
            if (region === null) {
                const regionData = await initRegion();
                saveRegion(regionData);
            }
        };
        fetchRegion();
    }, []);

    return (
        <div>
            {region ? (
                <div>
                    {/* Display Country Flag */}
                    {region.country && (
                        <div className='region-div'>
                            <img
                                src={`https://flagcdn.com/w40/${region.country.toLowerCase()}.png`}
                                alt={`Flag of ${region.country}`}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading location...</p>
            )}
        </div>
    );
};

export default DisplayRegion;
