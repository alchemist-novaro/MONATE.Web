import { useLight } from '../globals/redux-store';

const PortfolioElement = ({ id }) => {
    const lightMode = useLight();

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', borderRadius: '5%', width: '23%', marginLeft: '1%', marginRight: '1%',
            marginTop: '20px', height: '50vh', backgroundColor: lightMode ? '#1f2f2f22' : '#dfefef22', marginBottom: '20px',
        }}>
        </div>
    );
}

const PortfolioControl = (props) => {
    const lightMode = useLight();

    return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3vh', flexWrap: 'wrap' }}>
            <PortfolioElement id='0' />
            <PortfolioElement id='1' />
            <PortfolioElement id='2' />
            <PortfolioElement id='3' />
            <PortfolioElement id='4' />
            <PortfolioElement id='5' />
            <PortfolioElement id='6' />
        </div>
    );
}

export default PortfolioControl;