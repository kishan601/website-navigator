import { useEffect, useState } from 'react';
import axios from 'axios';
import AppHeader from './components/AppHeader';
import ErrorAlert from './components/ErrorAlert';
import UploadSection from './components/UploadSection';
import WebsiteViewer from './components/WebsiteViewer';
import { API_BASE_URL } from './config/api';

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
        const response = await axios.post(`${API_BASE_URL}/api/check-iframe`, {
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
      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
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
      <AppHeader />
      <main className="flex-1 flex flex-col relative overflow-hidden min-h-0">
        <ErrorAlert error={error} />
        {urls.length === 0 ? (
          <UploadSection
            file={file}
            isLoading={isLoading}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
          />
        ) : (
          <WebsiteViewer
            urls={urls}
            currentIndex={currentIndex}
            isCheckingIframe={isCheckingIframe}
            isBlocked={isBlocked}
            onPrev={handlePrev}
            onNext={handleNext}
            onReset={() => {
              setUrls([]);
              setFile(null);
              setCurrentIndex(0);
              setError('');
              setIsBlocked(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
