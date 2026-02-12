import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import SuccessMessage from './components/SuccessMessage';
 
function App() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <>
      {isSuccess ? (
        <SuccessMessage />
      ) : (
        <RegistrationForm onSuccess={() => setIsSuccess(true)} />
      )}
    </>
  );
}

export default App;
