import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000/api/files/';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load files when component mounts
  useEffect(() => {
    loadFiles();
  }, []);

  // Fetch all files from API
  const loadFiles = async () => {
    try {
      const response = await axios.get(API_URL);
      setFiles(response.data);
    } catch (error) {
      console.error('Error loading files:', error);
      showMessage('Error loading files', 'error');
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      showMessage('Please select a file', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('comments', comments);

    try {
      await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      showMessage('File uploaded successfully!', 'success');
      setSelectedFile(null);
      setComments('');
      // Reset file input
      document.getElementById('fileInput').value = '';
      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      showMessage('Error uploading file', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}${id}/`);
      showMessage('File deleted successfully!', 'success');
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      showMessage('Error deleting file', 'error');
    }
  };

  // Show message to user
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 5000);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="App">
      <div className="container">
        <div className="card">
          <h1>☁️ Aaron Cloud</h1>
          <p className="subtitle">Upload and download your files</p>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label>Select File</label>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                required
              />
              {selectedFile && (
                <p className="file-info">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Comments (optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any notes about this file..."
                rows="3"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>📁 Uploaded Files</h2>
          {files.length === 0 ? (
            <p className="no-files">No files uploaded yet</p>
          ) : (
            <div className="files-list">
              {files.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-header">
                    <div>
                      <div className="file-name">
                        {file.file.split('/').pop()}
                      </div>
                      <div className="file-meta">
                        Uploaded: {formatDate(file.date_uploaded)}
                      </div>
                    </div>
                  </div>
                  
                  {file.comments && (
                    <div className="file-comments">"{file.comments}"</div>
                  )}
                  
                  <div className="file-actions">
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-small"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="btn-small btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
