import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { History, ThumbsUp, ThumbsDown, Calendar, AlertCircle, Loader2, Sparkles, MessageSquare } from 'lucide-react';

export const ScanHistory = ({ onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [feedbackState, setFeedbackState] = useState({}); // { [recId]: { liked: boolean, comment: string, submitted: boolean } }

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getScanHistory();
      setHistory(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (recId, liked) => {
    const currentComment = feedbackState[recId]?.comment || '';
    try {
      await api.submitFeedback({
        recommendationId: recId,
        liked,
        comment: currentComment
      });

      setFeedbackState((prev) => ({
        ...prev,
        [recId]: { liked, comment: currentComment, submitted: true }
      }));
    } catch (err) {
      console.error('Feedback submission failed:', err);
    }
  };

  const handleCommentChange = (recId, text) => {
    setFeedbackState((prev) => ({
      ...prev,
      [recId]: { ...(prev[recId] || {}), comment: text }
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/30 text-primary">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Biometric Scan History</h2>
            <p className="text-xs text-gray-400">Review past facial analyses, recommended hairstyles, and submit feedback.</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium text-white rounded-xl border border-gray-700 transition-colors"
        >
          ← Back to Scanner
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading your scan records...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-6 flex items-center text-red-300 mb-6">
          <AlertCircle className="w-6 h-6 mr-3 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-12 text-center">
          <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Past Scans Found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            Upload your first portrait image to detect facial landmarks and save your personal hairstyle recommendations.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            Start New Scan
          </button>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="grid gap-8">
          {history.map(({ scan, recommendation }) => {
            const recId = recommendation?._id;
            const fb = feedbackState[recId] || {};
            const hairstylesList = recommendation?.hairstyles || [];

            return (
              <div
                key={scan._id}
                className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-6 relative overflow-hidden"
              >
                {/* Image */}
                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 shrink-0 relative">
                  <img
                    src={scan.uploadedImageUrl.startsWith('/') ? `http://localhost:5000${scan.uploadedImageUrl}` : scan.uploadedImageUrl}
                    alt="Scan"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Recommendations */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-500 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gray-500" />
                        {new Date(scan.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {scan.detectedFaceShape} Shape
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-3">Recommended Styles</h4>

                    {hairstylesList.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {hairstylesList.map((item, i) => (
                          <div
                            key={i}
                            className="bg-gray-800/40 border border-gray-700/60 rounded-xl p-2.5 flex items-center gap-3 text-xs"
                          >
                            {item.hairstyle?.imageUrl ? (
                              <img
                                src={item.hairstyle.imageUrl}
                                alt={item.hairstyle.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <Sparkles className="w-5 h-5 text-accent shrink-0 ml-2" />
                            )}
                            <div>
                              <div className="font-semibold text-white">{item.hairstyle?.name || 'Custom Style'}</div>
                              <div className="text-[11px] text-gray-400 line-clamp-1">{item.hairstyle?.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mb-4">Standard recommendations matching {scan.detectedFaceShape}.</p>
                    )}

                    {recommendation?.groomingTips && (
                      <p className="text-xs text-gray-400 bg-gray-950/60 p-3 rounded-xl border border-gray-800/80 mb-4">
                        <strong className="text-gray-300">Grooming Tip:</strong> {recommendation.groomingTips}
                      </p>
                    )}
                  </div>

                  {/* Feedback Section */}
                  {recId && (
                    <div className="border-t border-gray-800/80 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">Was this helpful?</span>
                        <button
                          onClick={() => handleFeedbackSubmit(recId, true)}
                          className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
                            fb.liked === true
                              ? 'bg-green-500/20 text-green-400 border-green-500/40'
                              : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Like</span>
                        </button>
                        <button
                          onClick={() => handleFeedbackSubmit(recId, false)}
                          className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
                            fb.liked === false
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>Dislike</span>
                        </button>
                      </div>

                      <div className="w-full sm:w-auto flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Optional feedback comment..."
                          value={fb.comment || ''}
                          onChange={(e) => handleCommentChange(recId, e.target.value)}
                          className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-primary flex-1 sm:w-64"
                        />
                        {fb.submitted && (
                          <span className="text-[11px] text-green-400 font-medium shrink-0">Saved!</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
