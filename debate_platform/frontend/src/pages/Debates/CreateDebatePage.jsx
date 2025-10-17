import React from 'react';
// FIX: The page is in 'pages/Debates/'. Assuming the root is one level up from 'pages', 
// the correct navigation to 'components/Debates/' is '../*one level up*/components/Debates/'.
// Correcting path to '../components/Debates/CreateDebateForm.jsx' based on typical React project structure 
// where the immediate parent directory (..) of 'Debates' is 'pages'.
import CreateDebateForm from '../components/Debates/CreateDebateForm.jsx';

/**
 * Wrapper page component for creating a debate. 
 * It primarily handles layout and passes state management props to the form.
 */
const CreateDebatePage = ({ onDebateCreate, user }) => (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="w-full">
            <CreateDebateForm 
                onDebateCreate={onDebateCreate} 
                user={user} 
            />
        </div>
    </div>
);

export default CreateDebatePage;
