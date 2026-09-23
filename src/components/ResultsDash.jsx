import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { getRecommendations } from '../utils/geometry';
import { Activity, Scissors, UserCheck, Droplet, RefreshCw, Sparkles, Copy, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../services/api';

export const ResultsDash = ({ imageUrl, results, detection, backendData, onReset }) => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [previewStyle, setPreviewStyle] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [liked, setLiked] = useState(null);

  useEffect(() => {
    if (imageRef.current && canvasRef.current && detection) {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      
      const displaySize = { width: img.width, height: img.height };
      faceapi.matchDimensions(canvas, displaySize);
      
      const resizedDetections = faceapi.resizeResults(detection, displaySize);
      
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }
  }, [detection, imageUrl]);

  // Use database recommendations from backend if available, fallback to static geometry calculation
  const staticRecs = getRecommendations(results.shape);
  const stylesList = backendData?.styles || staticRecs.styles;
  const groomingTip = backendData?.groomingTips || staticRecs.grooming;
  const hairstylesFull = backendData?.hairstylesFull || [];

  const handleFeedback = async (isLiked) => {
    if (!backendData?.recommendation?._id) return;
    try {
      setLiked(isLiked);
      await api.submitFeedback({
        recommendationId: backendData.recommendation._id,
        liked: isLiked
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const generatePrompt = (styleName) => {
    return `Create a photorealistic hairstyle transformation of the uploaded person.

Keep the exact same identity, facial features, skin tone, eye color, face proportions, age, expression, and facial structure.

Apply: ${styleName}

Detected face shape: ${results.shape}

Requirements:
- Realistic barber-quality haircut
- Natural hairline
- Professional studio lighting
- Fashion editorial photography
- Ultra detailed hair texture
- Same person before and after
- Neutral background
- High realism
- 4K quality
- No facial distortion
- No identity changes
- No extra accessories
- No cartoon or CGI appearance

Result should look like an authentic photograph of the same person after receiving the recommended hairstyle.`;
  };

  const handleCopy = () => {
    if (previewStyle) {
      navigator.clipboard.writeText(generatePrompt(previewStyle));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Image Overlay */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 shadow-2xl w-full">
            <img 
              ref={imageRef} 
              src={imageUrl} 
              alt="Scanned Face" 
              className="w-full h-auto object-contain max-h-[600px] block"
              crossOrigin="anonymous"
            />
            <canvas 
              ref={canvasRef} 
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
            
            <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-2xl shadow-[inset_0_0_50px_rgba(59,130,246,0.2)]"></div>
          </div>
          
          <button 
            onClick={onReset}
            className="mt-6 flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-colors border border-gray-600 shadow-lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Analyze Another Photo
          </button>
        </div>

        {/* Right Column: Dashboard Data */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <UserCheck className="w-32 h-32 text-primary" />
            </div>
            <h2 className="text-gray-400 font-medium tracking-widest text-sm uppercase mb-2">Detected Face Shape</h2>
            <div className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {results.shape}
            </div>
            <div className="flex items-center text-sm text-gray-300 bg-gray-800/50 inline-flex px-4 py-2 rounded-full border border-gray-700">
              <Activity className="w-4 h-4 mr-2 text-primary" />
              Database Matched Engine
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Jaw Width" value={`${results.jawWidth} px`} />
            <MetricCard label="Cheekbone Width" value={`${results.cheekboneWidth} px`} />
            <MetricCard label="Face Height" value={`${results.faceHeight} px`} />
            <MetricCard label="W/H Ratio" value={results.widthToHeightRatio} />
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 shadow-xl mt-2">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Scissors className="w-5 h-5 mr-3 text-accent" />
              Optimal Hairstyles (MongoDB Catalog)
            </h3>
            
            <div className="flex flex-col gap-3 mb-8">
              {stylesList.map((styleName, idx) => {
                const fullItem = hairstylesFull.find((h) => h.hairstyle?.name === styleName)?.hairstyle;

                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/80 hover:border-accent/50 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {fullItem?.imageUrl ? (
                        <img src={fullItem.imageUrl} alt={styleName} className="w-12 h-12 rounded-xl object-cover border border-gray-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold">
                          {idx + 1}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white text-sm">{styleName}</div>
                        {fullItem?.description && (
                          <div className="text-xs text-gray-400 line-clamp-1">{fullItem.description}</div>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setPreviewStyle(styleName)}
                      className="flex items-center text-xs font-medium px-3 py-1.5 bg-accent/20 text-accent hover:bg-accent/30 rounded-xl transition-colors shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      AI Preview
                    </button>
                  </div>
                );
              })}
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <Droplet className="w-5 h-5 mr-3 text-primary" />
              Grooming Advice
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm bg-gray-950/40 p-4 rounded-2xl border border-gray-800 mb-6">
              {groomingTip}
            </p>

            {/* Quick Feedback Bar */}
            {backendData?.recommendation?._id && (
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Rate these recommendations:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback(true)}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      liked === true
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-gray-800 text-gray-400 hover:text-white border-gray-700'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Like</span>
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      liked === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-gray-800 text-gray-400 hover:text-white border-gray-700'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Dislike</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* AI Preview Modal */}
      {previewStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setPreviewStyle(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8 border-b border-gray-800">
              <h3 className="text-2xl font-bold flex items-center text-white">
                <Sparkles className="w-6 h-6 mr-3 text-accent" />
                AI Generation Prompt
              </h3>
              <p className="text-gray-400 mt-2 text-sm">
                Copy this prompt and use it in your favorite AI image generator (like Midjourney, Stable Diffusion, or DALL-E) along with your uploaded photo.
              </p>
            </div>
            
            <div className="p-8 bg-black/50">
              <div className="relative group">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-gray-950 p-6 rounded-xl border border-gray-800">
                  {generatePrompt(previewStyle)}
                </pre>
                <button
                  onClick={handleCopy}
                  className={clsx(
                    "absolute top-4 right-4 flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    copied 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  )}
                >
                  {copied ? 'Copied!' : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const MetricCard = ({ label, value }) => (
  <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-5 flex flex-col justify-center">
    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</span>
    <span className="text-xl font-semibold text-white">{value}</span>
  </div>
);
