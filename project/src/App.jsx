// import { useState } from 'react'
// import './App.css'

// function App() {
//   const [selectedLanguage1, setSelectedLanguage1] = useState('Python')
//   const [selectedLanguage2, setSelectedLanguage2] = useState('JavaScript')
//   const [inputCode, setInputCode] = useState('')
//   const [outputCode, setOutputCode] = useState('')

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setInputCode(e.target.result)
//       }
//       reader.readAsText(file)
//     }
//   }

//   const handleDebug = () => {
//     console.log('Debug clicked')
//     // Add debug functionality here
//   }

//   const handleEvaluate = () => {
//     console.log('Evaluate clicked')
//     // Add evaluate functionality here
//   }

//   return (
//     <div className="container">
//       <div className="language-selectors">
//         <div className="language-option">
//           <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" 
//                alt="Python" 
//                className="language-logo" />
//           <select 
//             value={selectedLanguage1}
//             onChange={(e) => setSelectedLanguage1(e.target.value)}
//             className="language-select"
//           >
//             <option value="Python">Python</option>
//           </select>
//         </div>

//         <div className="language-option">
//           <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
//                alt="JavaScript"
//                className="language-logo" />
//           <select
//             value={selectedLanguage2}
//             onChange={(e) => setSelectedLanguage2(e.target.value)}
//             className="language-select"
//           >
//             <option value="JavaScript">JavaScript</option>
//           </select>
//         </div>
//       </div>

//       <div className="code-sections">
//         <div className="code-section">
//           <div className="upload-button-container">
//             <button 
//               className="upload-button"
//               onClick={() => document.getElementById('fileInput').click()}
//             >
//               Upload File
//             </button>
//             <input
//               type="file"
//               id="fileInput"
//               onChange={handleFileUpload}
//               style={{ display: 'none' }}
//             />
//           </div>
//           <textarea
//             className="code-editor"
//             value={inputCode}
//             onChange={(e) => setInputCode(e.target.value)}
//             placeholder="Your input code here"
//           />
//         </div>

//         <div className="code-section">
//           <textarea
//             className="code-editor"
//             value={outputCode}
//             readOnly
//             placeholder="Converted code will appear here"
//           />
//         </div>
//       </div>

//       <div className="button-container">
//         <button className="action-button debug-button" onClick={handleDebug}>
//           Debug
//         </button>
//         <button className="action-button evaluate-button" onClick={handleEvaluate}>
//           Evaluate
//         </button>
//       </div>
//     </div>
//   )
// }

// export default App



import { useState } from 'react';
import './App.css';

function App() {
  const [selectedLanguage1, setSelectedLanguage1] = useState('Python');
  const [selectedLanguage2, setSelectedLanguage2] = useState('JavaScript');
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleConvert = () => {
    // Implement your conversion logic here.
    // Use inputCode, selectedLanguage1, and selectedLanguage2.
    console.log('Converting...', inputCode);
    // Example: Replace with your actual conversion
    setOutputCode(`// Converted code from ${selectedLanguage1} to ${selectedLanguage2}\n${inputCode}`);
  };

  const handleDebug = () => {
    console.log('Debug clicked', inputCode);
    // Add debug functionality here
  };

  const handleEvaluate = () => {
    console.log('Evaluate clicked', inputCode);
    // Add evaluate functionality here
  };


  return (
    <div className="container">
      <div className="language-selectors">
        <div className="language-option">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
            alt="Python"
            className="language-logo"
          />
          <select
            value={selectedLanguage1}
            onChange={(e) => setSelectedLanguage1(e.target.value)}
            className="language-select"
          >
            <option value="Python">Python</option>
          </select>
        </div>

        <div className="language-option">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
            alt="JavaScript"
            className="language-logo"
          />
          <select
            value={selectedLanguage2}
            onChange={(e) => setSelectedLanguage2(e.target.value)}
            className="language-select"
          >
            <option value="JavaScript">JavaScript</option>
          </select>
        </div>
      </div>

      <div className="code-sections">
        <div className="code-section">
          <div className="input-area-header">
            <div className="upload-button-container">
              <button
                className="upload-button"
                onClick={() => document.getElementById('fileInput').click()}
              >
                Upload File
              </button>
              <input
                type="file"
                id="fileInput"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          
          </div>
          <textarea
            className="code-editor"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Your input code here"
          />
        </div>

        <div className="code-section">
          <textarea
            className="code-editor"
            value={outputCode}
            readOnly
            placeholder="Converted code will appear here"
          />
        </div>
      </div>

      <div className="button-container">
        <button className="action-button convert-button" onClick={handleConvert}>
          Convert
        </button>
        <button className="action-button debug-button" onClick={handleDebug}>
          Debug
        </button>
        <button className="action-button evaluate-button" onClick={handleEvaluate}>
          Evaluate
        </button>
      </div>
    </div>
  );
}

export default App;