
import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, X, Loader2, Video, Mic, Trash2, Sparkles } from 'lucide-react';
import { GeoLocation } from '../types';

interface IssueFormProps {
  onAnalyze: (image: string | null, video: string | null, audio: string | null, text: string, location?: GeoLocation) => void;
  isAnalyzing: boolean;
}

const IssueForm: React.FC<IssueFormProps> = ({ onAnalyze, isAnalyzing }) => {
  const [issue_text, setIssueText] = useState('');
  const [issue_image, setIssueImage] = useState<string | null>(null);
  const [issue_video, setIssueVideo] = useState<string | null>(null);
  const [issue_audio, setIssueAudio] = useState<string | null>(null);
  const [location, setLocation] = useState<GeoLocation | undefined>(undefined);
  const [locLoading, setLocLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIssueImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check for reasonable size limit for inline data (e.g., 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert("Video is too large. Please upload a smaller clip (under 20MB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIssueVideo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIssueAudio(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setIssueImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = () => {
    setIssueVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleRemoveAudio = () => {
    setIssueAudio(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const handleGetLocation = () => {
    setLocLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocLoading(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setLocLoading(false);
          alert("Could not fetch location. Please ensure permissions are granted.");
        }
      );
    } else {
      setLocLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleClear = () => {
    setIssueText('');
    setIssueImage(null);
    setIssueVideo(null);
    setIssueAudio(null);
    setLocation(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const handleTrySample = () => {
    setIssueText("Large pothole in the middle of the road near City Hospital. It's been here for 2 weeks and is getting worse. Several cars have been damaged.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue_text && !issue_image && !issue_video && !issue_audio) {
      alert("Please upload at least one image, video, audio, or provide text description");
      return;
    }
    onAnalyze(issue_image, issue_video, issue_audio, issue_text, location);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Report Issue
        </h2>
        <p className="text-sm text-slate-500 mt-1">Upload a photo, video, audio, or describe the problem.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        {/* Image Upload Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">📷 Upload Photo of Issue</label>
          {!issue_image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
            >
              <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-blue-50 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </div>
              <p className="text-sm text-slate-600 font-medium">Click to upload photo</p>
              <p className="text-xs text-slate-400 mt-1">Supported: JPG, PNG, WebP</p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <img src={issue_image} alt="Preview" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Video Upload Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">🎥 Upload Video Clip</label>
          {!issue_video ? (
            <div 
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
            >
              <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-blue-50 transition-colors">
                <Video className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </div>
              <p className="text-sm text-slate-600 font-medium">Click to upload video</p>
              <p className="text-xs text-slate-400 mt-1">Short clips work best (under 30 seconds)</p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <video src={issue_video} controls className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />
        </div>

        {/* Audio Upload Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">🎙️ Upload Voice Note</label>
          {!issue_audio ? (
            <div 
              onClick={() => audioInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
            >
              <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-blue-50 transition-colors">
                <Mic className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </div>
              <p className="text-sm text-slate-600 font-medium">Click to upload audio</p>
              <p className="text-xs text-slate-400 mt-1">Describe the issue in your own words</p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 p-4 flex items-center justify-center">
              <audio src={issue_audio} controls className="w-full" />
              <button
                type="button"
                onClick={handleRemoveAudio}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleAudioUpload}
          />
        </div>

        {/* Description Text Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="issue_text" className="block text-sm font-medium text-slate-700">
              ✏️ Describe the Issue
            </label>
            <button
                type="button"
                onClick={handleTrySample}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-md transition-colors"
                title="Fill with sample text"
            >
                <Sparkles className="w-3 h-3" />
                Try Sample
            </button>
          </div>
          <textarea
            id="issue_text"
            rows={4}
            className="w-full rounded-lg border-slate-300 border p-3 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 text-base sm:text-sm transition-shadow shadow-sm"
            placeholder="E.g., Large pothole near Main Street intersection causing traffic problems..."
            value={issue_text}
            onChange={(e) => setIssueText(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${location ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-700">Location Data</p>
              <p className="text-slate-500 text-xs">
                {location 
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` 
                  : "No location tagged"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={locLoading || !!location}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
              location 
                ? 'text-green-700 bg-green-50' 
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            }`}
          >
            {locLoading ? "Locating..." : location ? "Tagged" : "Add Location"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            disabled={isAnalyzing}
            className="w-full sm:flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:flex-[2] flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "🔍 Analyze Issue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueForm;
