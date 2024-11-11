import { useRegion } from '../globals/redux-store';
import './display-region.css';

const DisplayRegion = () => {
    const region = useRegion();
    const regionStorage = sessionStorage.getItem('region');

    return (
        <div>
            {region ? (
                <div className='region-div'>
                    <img
                        src={`https://flagcdn.com/w40/${region.toLowerCase()}.png`}
                        alt={`Flag of ${region}`}
                    />
                </div>
            ) : <div>
                {regionStorage ? (
                    <div className='region-div'>
                        <img
                            src={`https://flagcdn.com/w40/${regionStorage.toLowerCase()}.png`}
                            alt={`Flag of ${regionStorage}`}
                        />
                    </div>
                ) : <div />}
            </div>}
        </div>
    );
};

export default DisplayRegion;
