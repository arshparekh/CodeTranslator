import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { FiUpload, FiCopy, FiSave } from "react-icons/fi";
import { Wand2, Bug, Play } from "lucide-react";
import axios from "axios";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "./App.css";

function Home({ user }) {
  const [selectedLanguage1, setSelectedLanguage1] = useState("Python");
  const [selectedLanguage2, setSelectedLanguage2] = useState("JavaScript");
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const editorContainerRef = useRef(null);
  const inputEditorRef = useRef(null);
  const outputEditorRef = useRef(null);

  const languageOptions = [
    { value: "Python", label: "Python", icon: "httpsasc: https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg", editorLang: "python" },
    { value: "JavaScript", label: "JavaScript", icon: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png", editorLang: "javascript" },
    { value: "Java", label: "Java", icon: "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/121px-Java_programming_language_logo.svg.png", editorLang: "java" },
    { value: "C", label: "C", icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png", editorLang: "c" },
    { value: "CPP", label: "C++", icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg", editorLang: "cpp" },
    { value: "R", label: "R", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/R_logo.svg/724px-R_logo.svg.png", editorLang: "r" },
    { value: "Ruby", label: "Ruby", icon: "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg", editorLang: "ruby" },
  ];

  useEffect(() => {
    if (inputEditorRef.current) {
      const model = inputEditorRef.current.getModel();
      if (model) {
        const selectedLang = languageOptions.find((lang) => lang.value === selectedLanguage1);
        monaco.editor.setModelLanguage(model, selectedLang.editorLang);
      }
    }
  }, [selectedLanguage1]);

  useEffect(() => {
    if (outputEditorRef.current) {
      const model = outputEditorRef.current.getModel();
      if (model) {
        const selectedLang = languageOptions.find((lang) => lang.value === selectedLanguage2);
        monaco.editor.setModelLanguage(model, selectedLang.editorLang);
      }
    }
  }, [selectedLanguage2]);

  const handleEditorDidMount = (editor, monaco, isInput = true) => {
    if (isInput) {
      inputEditorRef.current = editor;
      const selectedLang = languageOptions.find((lang) => lang.value === selectedLanguage1);
      monaco.editor.setModelLanguage(editor.getModel(), selectedLang.editorLang);
    } else {
      outputEditorRef.current = editor;
      const selectedLang = languageOptions.find((lang) => lang.value === selectedLanguage2);
      monaco.editor.setModelLanguage(editor.getModel(), selectedLang.editorLang);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setInputCode(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleConvert = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        "http://localhost:5000/api/convert",
        { inputCode, fromLanguage: selectedLanguage1, toLanguage: selectedLanguage2 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutputCode(response.data.convertedCode);
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Conversion failed. Please log in or try again.");
    }
  };

  const handleDebug = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        "http://localhost:5000/api/debug",
        { inputCode, language: selectedLanguage1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutputCode(response.data.debugResult);
    } catch (error) {
      console.error("Debug error:", error);
      alert("Debugging failed. Please log in or try again.");
    }
  };

  const handleEvaluate = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        "http://localhost:5000/api/evaluate",
        { inputCode, language: selectedLanguage1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutputCode(response.data.evaluationResult);
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Evaluation failed. Please log in or try again.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputCode);
      alert("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSave = () => {
    const blob = new Blob([outputCode], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-code.${languageOptions.find((lang) => lang.value === selectedLanguage2)?.editorLang}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    automaticLayout: true,
    scrollbar: { vertical: "visible", horizontal: "visible" },
    overviewRulerLanes: 0,
    lineNumbers: "on",
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    fixedOverflowWidgets: true,
  };

  return (
    <div className="container">
      <div className="language-selectors">
        <div className="language-option">
          <img
            src={languageOptions.find((lang) => lang.value === selectedLanguage1)?.icon}
            alt={selectedLanguage1}
            className="language-logo"
          />
          <select
            value={selectedLanguage1}
            onChange={(e) => setSelectedLanguage1(e.target.value)}
            className="language-select"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="language-option">
          <img
            src={languageOptions.find((lang) => lang.value === selectedLanguage2)?.icon}
            alt={selectedLanguage2}
            className="language-logo"
          />
          <select
            value={selectedLanguage2}
            onChange={(e) => setSelectedLanguage2(e.target.value)}
            className="language-select"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="code-sections" ref={editorContainerRef}>
        <div className="code-section">
          <div className="editor-header">
            <button className="icon-button" onClick={() => document.getElementById("fileInput").click()} title="Upload File">
              <FiUpload />
            </button>
            <input type="file" id="fileInput" onChange={handleFileUpload} style={{ display: "none" }} />
          </div>
          <Editor
            height="400px"
            language={languageOptions.find((lang) => lang.value === selectedLanguage1)?.editorLang}
            value={inputCode}
            onChange={setInputCode}
            theme="vs-light"
            options={editorOptions}
            onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, true)}
            loading={<div className="editor-loading">Loading editor...</div>}
            className="monaco-editor-instance"
          />
        </div>
        <div className="code-section">
          <div className="editor-header">
            <button className="icon-button" onClick={handleCopy} title="Copy Code">
              <FiCopy />
            </button>
            <button className="icon-button" onClick={handleSave} title="Save Code">
              <FiSave />
            </button>
          </div>
          <Editor
            height="400px"
            language={languageOptions.find((lang) => lang.value === selectedLanguage2)?.editorLang}
            value={outputCode}
            theme="vs-light"
            options={{ ...editorOptions, readOnly: true }}
            onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, false)}
            loading={<div className="editor-loading">Loading editor...</div>}
            className="monaco-editor-instance"
          />
        </div>
      </div>
      <div className="button-container">
        <button className="action-button convert-button" onClick={handleConvert}>
          <Wand2 className="button-icon" /> Convert
        </button>
        <button className="action-button debug-button" onClick={handleDebug}>
          <Bug className="button-icon" /> Debug
        </button>
        <button className="action-button evaluate-button" onClick={handleEvaluate}>
          <Play className="button-icon" /> Evaluate
        </button>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await axios.post("http://localhost:5000/api/auth", { token });
      navigate("/"); // Redirect to Home after login
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await axios.post("http://localhost:5000/api/auth", { token });
      navigate("/"); // Redirect to Home after signup
    } catch (error) {
      console.error("Signup error:", error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already in use. Please log in instead.");
      } else {
        alert("Signup failed: " + error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Signup</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignup}>Signup</button>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Ensure redirect to Home if user is logged in
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state immediately
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">CodeTranslate</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          {user ? (
            <>
              <span className="navbar-link">Welcome, {user.email}</span>
              <button className="sign-in-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Signup</Link>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;