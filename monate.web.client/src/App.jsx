import { useEffect, useState } from 'react';
import './App.css';
import { RegionProvider } from './region-provider/region-provider';
import DisplayRegion from './region-provider/display-region';

function App() {
    const [forecasts, setForecasts] = useState();

    useEffect(() => {
       populateWeatherData();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <div>
            <RegionProvider>
               <DisplayRegion />
            </RegionProvider>
        </div>;

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
    
    async function populateWeatherData() {
       const response = await fetch('weatherforecast');
       const data = await response.json();
       setForecasts(data);

       console.log('success');
    }
}

export default App;