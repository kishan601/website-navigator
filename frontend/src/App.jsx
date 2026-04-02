import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, ChevronLeft, ChevronRight, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [urls, setUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [isCheckingIframe, setIsCheckingIframe] = useState(false);

  useEffect(() => {
    const checkIframeStatus = async () => {
      if (urls.length === 0) return;
      
      setIsCheckingIframe(true);
      setIsBlocked(false);
      
      try {
        const currentUrl = urls[currentIndex];
        const response = await axios.post('http://localhost:5000/api/check-iframe', {
          url: currentUrl
        });
        
        if (!response.data.canEmbed) {
          setIsBlocked(true);
        }
      } catch (err) {
        console.error('Failed to check iframe status:', err);
        // Fallback to true to let the iframe try and fail gracefully if the check itself fails
        setIsBlocked(false); 
      } finally {
        setIsCheckingIframe(false);
      }
    };

    checkIframeStatus();
  }, [currentIndex, urls]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setIsBlocked(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setIsBlocked(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.urls && response.data.urls.length > 0) {
        setUrls(response.data.urls);
        setCurrentIndex(0);
      } else {
        setError('No valid URLs found in the file.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload and parse file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < urls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <FileSpreadsheet size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Website Navigator</h1>
        </div>
        
        {urls.length === 0 && (
          <div className="flex items-center gap-3">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {file ? file.name : 'Select Excel/CSV'}
            </label>
            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                !file || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload & Extract
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md flex items-start gap-3 w-full max-w-md">
            <AlertCircle className="text-red-500 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {urls.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
              <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <FileSpreadsheet size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Website Navigator</h2>
              <p className="text-gray-500 mb-8">
                Upload an Excel (.xlsx) or CSV file containing website URLs. We'll extract them and let you seamlessly navigate through the sites.
              </p>
              
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  id="main-file-upload"
                  className="hidden"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="main-file-upload"
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 hover:border-blue-400 transition-all flex flex-col items-center gap-3"
                >
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    {file ? file.name : 'Click to select Excel/CSV file'}
                  </span>
                </label>
                
                <button
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                  className={`w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all shadow-sm ${
                    !file || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : null}
                  {isLoading ? 'Processing...' : 'Start Navigating'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            {/* Navigation Bar */}
            <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-500">
                  {currentIndex + 1} of {urls.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === urls.length - 1}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentIndex === urls.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="flex-1 px-6">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-600 truncate max-w-2xl mx-auto border border-gray-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <a href={urls[currentIndex]} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    {urls[currentIndex]}
                  </a>
                </div>
              </div>

              <div>
                <button
                  onClick={() => { setUrls([]); setFile(null); }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Upload New File
                </button>
              </div>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 bg-gray-200 relative w-full h-full">
              {isCheckingIframe ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                  <p className="text-gray-600">Checking website compatibility...</p>
                </div>
              ) : isBlocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                  <AlertCircle className="text-red-500 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Cannot display this website</h3>
                  <p className="text-gray-600 mb-4">
                    This website has security policies that prevent it from being embedded here.
                  </p>
                  <a
                    href={urls[currentIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Open in new tab
                  </a>
                </div>
              ) : (
                <iframe
                  key={`iframe-${currentIndex}-${urls[currentIndex]}`}
                  src={urls[currentIndex]}
                  title={`Website ${currentIndex + 1}`}
                  className="absolute inset-0 w-full h-full border-0 bg-white"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;