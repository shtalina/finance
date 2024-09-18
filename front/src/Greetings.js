import React, { useState, useEffect } from 'react';


function GreetingsDisplay() {
    const [greetings, setGreetings] = useState(null);
  
    useEffect(() => {
      fetch('http://localhost:8000/api/greetings')
        .then((response) => response.json())
        .then((data) => setGreetings(data.greetings.value))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    return (
      <div>
        <h1>{greetings}</h1>
      </div>
    );
  }

  export default GreetingsDisplay;