import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';
import { ProgressBar } from '../components/ProgressBar';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDocument, addDocument, setCurrentDocument } = useDocumentStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const newDocument = {
        id: crypto.randomUUID(),
        name: file.name,
        uploadDate: new Date(),
        status: 'draft' as const,
        recipients: [],
        fields: [],
        file,
      };
      addDocument(newDocument);
      setCurrentDocument(newDocument);
    }
  }, [addDocument, setCurrentDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const removeFile = () => {
    setCurrentDocument(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressBar />
      <div className="max-w-2xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${currentDocument ? 'border-green-300 bg-green-50' : ''}`}
        >
          <input {...getInputProps()} />
          {currentDocument ? (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-xl mb-2 text-green-700">File uploaded successfully!</p>
              <p className="text-sm text-gray-600">Click to upload a different file</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-xl mb-2">
                {isDragActive
                  ? 'Drop your PDF here'
                  : 'Drag and drop your PDF here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">Supported format: PDF</p>
            </>
          )}
        </div>

        {/* Display uploaded file */}
        {currentDocument && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">{currentDocument.name}</p>
                  <p className="text-sm text-gray-500">
                    {currentDocument.file ? formatFileSize(currentDocument.file.size) : ''}
                    {' • '}
                    Uploaded {currentDocument.uploadDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/recipients')}
          disabled={!currentDocument}
          className={`mt-6 w-full py-2 px-4 rounded-lg transition-colors ${
            currentDocument
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};