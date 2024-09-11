import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

const MyButton = ({ onClick, buttonText }) => {
  return (
    <button onClick={onClick}>{buttonText}</button>
  );
}

function App() {
  const [currentImage, setCurrentImage] = useState('cat_unbread.jpg');
  const images = ['cat_unbread.jpg', 'cat_bread.jpg'];

  const [buttonText, setButtonText] = useState('Забатониться');
  const buttonLabels = ['Забатониться', 'Разбатониться'];

  const switchImageAndButton = () => {
    const currentIndex = images.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentImage(images[nextIndex]);
    setButtonText(buttonLabels[nextIndex]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hello World</h1>
        <p>⸜(⸝⸝⸝´꒳`⸝⸝⸝)⸝</p>
      </header>
      <div>
      <br />
        <img src={currentImage} alt="Current" style={{ width: '300px', height: 'auto' }} />
        <br />
        <MyButton onClick={switchImageAndButton} buttonText={buttonText} />
        <br />
      </div>
    </div>
  );
}

export default App;
