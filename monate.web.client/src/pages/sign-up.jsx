import { useState } from 'react';
import MailCheckPage from '../components/mail-check-page';

const SignUp = (props) => {
    const [currentPage, setCurrentPage] = useState(0);

    if (currentPage === 0) {
        return (
            <MailCheckPage />
        );
    }
    else {
        return (
            <div>
            </div>
        );
    }
};

export default SignUp;