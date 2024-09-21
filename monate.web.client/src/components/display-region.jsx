import { getRegion } from '../globals/redux_store'

const DisplayRegion = () => {
    const region = getRegion();

    return (
        <div>
            {region ? (
                <div>
                    {/* Display Country Flag */}
                    {region.country && (
                        <div>
                            <img
                                src={`https://flagcdn.com/48x36/${region.country.toLowerCase()}.png`}
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
