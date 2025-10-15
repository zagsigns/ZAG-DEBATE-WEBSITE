// frontend/src/pages/Debates/CreateDebatePage.jsx

import React from 'react';
import CreateDebateForm from '../../components/Debates/CreateDebateForm';

const CreateDebatePage = () => {
    return (
        <div className="py-10">
            {/* The max-w-3xl centers the form and makes it look clean and focused */}
            <div className="max-w-3xl mx-auto">
                <CreateDebateForm />
            </div>
        </div>
    );
};

export default CreateDebatePage;