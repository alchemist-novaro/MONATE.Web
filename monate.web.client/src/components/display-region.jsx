import { useRegion } from '../globals/redux-store';
import './display-region.css';

const DisplayRegion = () => {
    const region = useRegion();

    return (
        <div>
            {region ? (
                <div className='region-div'>
                    <img
                        src={`https://flagcdn.com/w40/${region.toLowerCase()}.png`}
                        alt={`Flag of ${region}`}
                    />
                </div>
            ) : <div />}
        </div>
    );
};

export default DisplayRegion;
