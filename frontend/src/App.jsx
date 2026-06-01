import { useState, useRef } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import UploadSection from './components/UploadSection';
import Footer from './components/Footer';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleUploadBoxClick = () => {
    fileInputRef.current?.click();
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setLoading(false);
    setError(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(errorData.error || 'Failed to fetch prediction. Ensure backend is running.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900">
      <Hero scrollToUpload={scrollToUpload} />
      <Features />
      <UploadSection
        uploadRef={uploadRef}
        loading={loading}
        error={error}
        result={result}
        previewUrl={previewUrl}
        handleUploadBoxClick={handleUploadBoxClick}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        selectedFile={selectedFile}
        resetState={resetState}
      />
      <Footer />
    </div>
  );
}

export default App;