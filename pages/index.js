import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  const [input, setInput] = useState('');
   // Create new state property
   const [img, setImg] = useState(''); 

  const inputHandler = (event) =>{
    setInput(event.target.value);
  };

  const generateAction = async () => {
    console.log('Generating...');	
    console.log(input)

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });

    // If model still loading, drop that retry time
    if (response.status === 503) {
      console.log('Model is loading still :(.')
      return;
    }
    console.log(data)
    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      return;
    }

    // Set image data into state property
    setImg(data.image);
    const data = await response.json();
  }

  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | apcodes</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Turn apcodes into anyone you want! 😄</h1>
          </div>
          <div className="header-subtitle">
            <h2>Make sure you refer to me as "pelayoaz" in the prompt"</h2>
          </div>
          <div className="prompt-container">
            <input className="prompt-box" value={input} onChange={inputHandler}/>
            <div className="prompt-buttons">
              <a className="generate-button" onClick={generateAction}>
                <div className="generate">
                  <p>Generate</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
              <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
