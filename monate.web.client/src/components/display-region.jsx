import { useRegion } from '../globals/redux-store';

import './display-region.css'

const DisplayRegion = () => {
    const region = useRegion();

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
            ) : <div />}
        </div>
    );
};

export default DisplayRegion;
