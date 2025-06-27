import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCopy } from 'react-icons/fa';

function PdfQnA() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setPdfFiles(event.target.files);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const uploadFiles = async () => {
    setLoading(true);
    const formData = new FormData();
    Array.from(pdfFiles).forEach(file => {
      formData.append('files', file);
    });

    try {
      await axios.post('http://127.0.0.1:8000/upload_pdf/', formData);
      toast.success("PDFs uploaded successfully. You can now ask questions.");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    setLoading(true);
    setResponse('');
    try {
      const res = await axios.post('http://127.0.0.1:8000/ask_question/', { question });
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error asking question:", error);
      alert("Error asking question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response).then(() => {
      toast.success("Copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-6 shadow-lg rounded-lg m-4 md:m-0 md:rounded-none md:rounded-l-lg">
        <h2 className="font-bold text-2xl text-indigo-600 mb-4">Menu</h2>
        <p className="text-gray-600 mb-4">Upload your PDF files and submit to start asking questions.</p>
        <div className="mb-4">
          <input 
            type="file" 
            accept="application/pdf" 
            multiple 
            onChange={handleFileChange} 
            className="p-2 border border-gray-300 rounded-lg w-full mb-3"
          />
          <button 
            onClick={uploadFiles} 
            disabled={loading}
            className={`w-full p-2 text-white rounded-lg transition-all duration-200 ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Uploading...' : 'Submit & Process'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Chat with PDF 💁</h1>
        <div className="mb-4">
          <input 
            type="text" 
            value={question} 
            onChange={handleQuestionChange} 
            placeholder="Ask a question about the PDF content" 
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
            disabled={loading}
          />
          <button 
            onClick={askQuestion} 
            disabled={loading}
            className={`mt-4 w-full p-2 rounded-lg text-white transition-all duration-200 ${
              loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Asking...' : 'Ask Question'}
          </button>
        </div>
        {response && (
          <div className="mt-6 p-5 border border-gray-200 rounded-lg bg-white shadow-md relative">
            <h2 className="font-bold text-lg text-indigo-600 mb-2">Response</h2>
            <p className="text-gray-700">{response}</p>
            {/* Copy icon button */}
            <button 
              onClick={copyToClipboard} 
              className="absolute top-4 right-4 bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 focus:outline-none"
              title="Copy to clipboard"
            >
              <FaCopy />
            </button>
          </div>
        )}
        {/* Toast container for notifications */}
        <ToastContainer />
      </div>
    </div>
  );
}

export default PdfQnA;
