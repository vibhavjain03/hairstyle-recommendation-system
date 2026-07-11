import React, { useState, useEffect, useRef } from 'react';
import { loadModels, detectFaceAndLandmarks } from './utils/faceApi';
import { calculateBiometrics } from './utils/geometry';
import { Dropzone } from './components/Dropzone';
import { ResultsDash } from './components/ResultsDash';
import { Loader2, Fingerprint, AlertCircle } from 'lucide-react';
import './index.css';

function App() {
  const [status, setStatus] = useState('loading_models'); // loading_models | ready | scanning | complete | error
  const [imageUrl, setImageUrl] = useState(null);
  const [detection, setDetection] = useState(null);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Load models on mount
  useEffect(() => {
    const initModels = async () => {
      try {
        await loadModels();
        setStatus('ready');
      } catch (err) {
        console.error("Error loading models:", err);
        setStatus('error');
        setErrorMsg('Failed to load biometric models. Error: ' + (err.message || err.toString()));
      }
    };
    initModels();
  }, []);

  const handleImageUpload = (url) => {
    setImageUrl(url);
    setStatus('scanning');
    
    // Process image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = async () => {
      try {
        // Small delay to allow UI to render scanning state
        setTimeout(async () => {
          const det = await detectFaceAndLandmarks(img);
          
          if (!det) {
            setStatus('error');
            setErrorMsg('No face detected. Please ensure the face is clearly visible and well-lit.');
            return;
          }
          
          setDetection(det);
          
          // Calculate geometry
          const bio = calculateBiometrics(det.landmarks, det.alignedRect.box);
          setResults(bio);
          
          setStatus('complete');
        }, 800);
      } catch (err) {
        console.error("Analysis Error:", err);
        setStatus('error');
        setErrorMsg('An error occurred during biometric scanning.');
      }
    };
    img.onerror = () => {
      setStatus('error');
      setErrorMsg('Failed to load the image. Please try another file.');
    };
  };

  const handleReset = () => {
    setImageUrl(null);
    setDetection(null);
    setResults(null);
    setStatus('ready');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-full bg-[#0f1115] text-white selection:bg-primary/30 font-sans pb-16">
      
      {/* Header */}
      <header className="w-full p-6 border-b border-gray-800/50 backdrop-blur-sm bg-[#0f1115]/80 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg border border-primary/30 text-primary">
            <Fingerprint className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Aesthetic<span className="text-primary">AI</span></h1>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          SYS.VER // 1.0.4
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Error State */}
        {status === 'error' && (
          <div className="max-w-2xl mx-auto bg-red-950/40 border border-red-900/50 rounded-2xl p-6 flex flex-col items-center text-center animate-fade-in">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-200 mb-2">Analysis Failed</h2>
            <p className="text-red-400 mb-6">{errorMsg}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-red-900/50 hover:bg-red-800 text-white rounded-full transition-colors border border-red-700/50"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading Models State */}
        {status === 'loading_models' && (
          <div className="flex flex-col items-center justify-center mt-32 animate-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-medium text-gray-300">Initializing Biometric Engines...</h2>
            <p className="text-gray-500 mt-2">Loading deep learning models locally for your privacy.</p>
          </div>
        )}

        {/* Ready / Upload State */}
        {status === 'ready' && (
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mt-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Discover your optimal aesthetic using biometric data.
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl leading-relaxed">
              Upload a clear, front-facing portrait. Our in-browser neural networks will map 68 facial landmarks to analyze your geometry and recommend the perfect styling.
            </p>
            
            <Dropzone onImageUpload={handleImageUpload} />
          </div>
        )}

        {/* Scanning State */}
        {status === 'scanning' && imageUrl && (
          <div className="flex flex-col items-center justify-center mt-24 animate-fade-in">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-[0_0_100px_rgba(59,130,246,0.15)] p-2">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <img src={imageUrl} alt="Processing" className="w-full h-full object-cover grayscale opacity-50" />
                
                {/* Scanning Laser Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_#3b82f6] animate-scan"></div>
                
                {/* Overlay grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50"></div>
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-pulse">
              Extracting 68-Point Geometry...
            </h2>
            <p className="text-gray-500 mt-2 font-mono text-sm">Running TinyFaceDetector & Landmark68Net</p>
          </div>
        )}

        {/* Results Dashboard */}
        {status === 'complete' && results && detection && (
          <ResultsDash 
            imageUrl={imageUrl} 
            results={results} 
            detection={detection} 
            onReset={handleReset} 
          />
        )}

      </main>
    </div>
  );
}

export default App;
