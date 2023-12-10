import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import UserInput from './UserInput';
import  CustomNavbar  from "./CustomNavbar"
import Game from './Game';

const App = () => {

  const [sourceAddress, setSourceAddress] = useState('');

  const handleFormSubmit = (enteredSourceAddress, destinationAddress, event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Handle form submission logic here
    console.log('Source Address:', enteredSourceAddress);
    console.log('Destination Address:', destinationAddress);
  
    // Set the source address in the component state
    setSourceAddress(enteredSourceAddress);
  };
  
  return (
    <>
    <CustomNavbar />
    <UserInput onSubmit={handleFormSubmit} />
      
    </>
  );
};

export default App;
