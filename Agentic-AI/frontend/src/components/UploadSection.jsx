import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

const UploadSection = ({
  uploadRef,
  loading,
  error,
  result,
  previewUrl,
  handleUploadBoxClick,
  handleSubmit,
  handleFileChange,
  fileInputRef,
  selectedFile,
  resetState
}) => {

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.4, ease: "easeIn" } }
  };

  return (
    <section ref={uploadRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Diagnostic Center</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          Upload an image of a plant leaf. Our AI will analyze it for diseases and provide a diagnosis along with treatment recommendations.
        </p>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 transition-all duration-500">
          {!previewUrl && !loading && !result && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="upload-box border-4 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-green-500 hover:bg-gray-50 transition"
              onClick={handleUploadBoxClick}
            >
              <Upload className="mx-auto text-gray-400" size={60} />
              <p className="mt-4 text-xl font-semibold text-gray-700">Click to upload or drag & drop</p>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
              />
            </motion.div>
          )}

          {loading && (
            <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="text-center py-8">
              <Loader2 className="mx-auto animate-spin text-green-600" size={60} />
              <p className="mt-4 text-xl font-semibold text-gray-700">Analyzing Image...</p>
              <p className="text-gray-500">This may take a moment.</p>
            </motion.div>
          )}

          {error && (
             <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="text-center py-8 bg-red-50 rounded-lg">
              <AlertCircle className="mx-auto text-red-500" size={60} />
              <p className="mt-4 text-xl font-semibold text-red-700">Analysis Failed</p>
              <p className="text-red-600">{error}</p>
              <button onClick={resetState} className="mt-6 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Try Again</button>
            </motion.div>
          )}

          {(previewUrl && !loading) && (
            <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
              <img src={previewUrl} alt="Preview" className="mx-auto max-h-80 rounded-lg shadow-md mb-6" />
              
              {!result && (
                <form onSubmit={handleSubmit}>
                  <motion.button
                    type="submit"
                    disabled={!selectedFile}
                    className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-transform transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Diagnose Leaf
                  </motion.button>
                </form>
              )}
            </motion.div>
          )}

          {result && (
            <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="result-display text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckCircle2 className="text-green-500 mr-3" size={28} />
                Diagnosis Complete
              </h3>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Predicted Disease</p>
                  <p className="text-xl font-semibold text-gray-900">{result.prediction}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Confidence Score</p>
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <motion.div
                      className="bg-green-500 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-right text-sm font-bold text-green-600 mt-1">
                    {(result.confidence * 100).toFixed(2)}%
                  </p>
                </div>
                {result.treatment && (
                  <div>
                    <p className="text-sm text-gray-500 flex items-center mb-2"><ShieldCheck className="mr-2" size={16}/>Recommended Treatment</p>
                    <p className="text-gray-700">{result.treatment}</p>
                  </div>
                )}
              </div>
              <button onClick={resetState} className="mt-8 w-full px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition">Analyze Another Leaf</button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
