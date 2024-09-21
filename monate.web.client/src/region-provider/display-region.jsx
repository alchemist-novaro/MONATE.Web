import { useRegion } from './region-provider';

const DisplayRegion = () => {
    const region = useRegion();

    return (
        <div>
            {region ? (
                <div>
                    <p><strong>IP:</strong> {region.ip}</p>
                    <p><strong>City:</strong> {region.city}</p>
                    <p><strong>Region:</strong> {region.region}</p>
                    <p><strong>Country:</strong> {region.country}</p>

                    {/* Display Country Flag */}
                    {region.country && (
                        <div>
                            <p><strong>Country Flag:</strong></p>
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
