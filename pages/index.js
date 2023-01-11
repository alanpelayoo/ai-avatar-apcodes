import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import example1 from '../assets/superman.jpeg';
import example2 from '../assets/apcodes.png';
import example3 from '../assets/astroapcodes.png';
import logo from "../assets/logo-white.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  // Don't retry more than 20 times
  const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  // Numbers of retries 
  const [retry, setRetry] = useState(0);
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  // rest of code 

  // Add isGenerating state
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [message, setMessage] = useState('');

  const inputHandler = (event) =>{
    setInput(event.target.value);
  };

  const generateAction = async () => {
    // Add this check to make sure there is no double click
    if (isGenerating && retry === 0) return;

    // Set loading has started
    setIsGenerating(true);
    setMessage('Model can take a few minutes to load, specially the first time, be patient.')

    // If this is a retry request, take away retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }
    
    console.log('Generating...');	
    const finalInput = input.replace(/alan/gi, 'pelayoaz');
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input: finalInput }),
    });
    const data = await response.json();
    
    // If model still loading, drop that retry time
    if (response.status === 503) {
      setRetry(data.estimated_time);
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }
    // Set final prompt here
    setFinalPrompt(input);
    // Remove content from input box
    setInput('');
    // Set image data into state property
    setImg(data.image);
    setIsGenerating(false);
    setMessage('')
  }

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const scrolltoId = ()=>{
    let access = document.getElementById("examples");
    access.scrollIntoView({behavior: 'smooth'}, true);
  }

  const scrollToTop = () => {
    let access = document.getElementById("main");
    access.scrollIntoView({behavior: 'smooth'}, true);
  };

  // Add useEffect here
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setMessage(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`)
        setRetryCount(maxRetries);
        return;
        }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  return (

    <div className="root" >
      <Head>
        <title>AI Avatar Generator | apcodes</title>
      </Head>

      <div className="main" id='main'>
        <div className='container'>
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
                {message ? (
                  <div className='message'>
                    <p>{message}</p>
                  </div> 
                ):null
                } 
                <a className="generate-button" onClick={generateAction}>
                  <div className="generate">
                    {isGenerating ? (
                        <span className="loader"></span>
                      ) : (
                        <p>Generate</p>
                      )}
                  </div>
                </a>
              </div>
            </div>
          </div>
          {img && (
              <div className="output-content">
                <Image src={img} width={350} height={350} alt={input} />
                <p>{finalPrompt}</p>
              </div>
            )}
        </div>
        
        
        <a className='bot' onClick={scrolltoId}>
          <p>Take a look at the examples..</p>
          <FontAwesomeIcon
              icon={faArrowDown}
              style={{ fontSize: 20, color: "white" }}
          />
        </a>
      </div>


      <div className='examples' id='examples'>
        <h2 className='newh2'>Examples..</h2>
        <div className='example'>
          <p>Portrait of pelayoaz as Superman, muscular, fantasy, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgem and gem</p>
          <Image src={example1} width={450} height={450} alt="Example 1" />  
        </div>

        <div className='example'>
          <Image src={example2} width={450} height={450} alt="Example 3" />
          <p>Portrait of pelayoaz as a Peaky Blinder, muscular, fantasy, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by Vincent Van Gogh and Edvard Munch and Pablo Picasso</p> 
        </div>

        <div className='example'>
          <p>Portrait of pelayoaz as an astronout</p>
          <Image src={example3} width={450} height={450} alt="Example 3" />  
        </div>
        
        <a className='return' onClick={scrollToTop}>
          <p>Return..</p>
          <FontAwesomeIcon
              icon={faArrowUp}
              style={{ fontSize: 20, color: "white" }}
              className='iconf'
          />
        </a>
      </div>
      
      <div className="badge-container grow">
        <a
          href="https://twitter.com/realapcodes"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={logo} alt="buildspace logo" />
              <p>build by apcodes</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
