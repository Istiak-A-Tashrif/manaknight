import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, GripHorizontal, X } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';
import { ProgressBar } from '../components/ProgressBar';
import { PDFViewer } from '../components/PDFViewer';
import { EditorSidebar } from '../components/EditorSidebar';
import type { DocumentField } from '../types';

const FIELD_DEFAULT_SIZES = {
  signature: { width: 200, height: 50 },
  text: { width: 200, height: 40 },
  date: { width: 150, height: 40 },
  checkbox: { width: 30, height: 30 },
  initial: { width: 100, height: 50 },
};

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDocument, addField, updateField, removeField } = useDocumentStore();
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFieldUpdate = (fieldId: string, updates: Partial<DocumentField>) => {
    if (!currentDocument) return;
    
    const field = currentDocument.fields.find(f => f.id === fieldId);
    if (field) {
      updateField(currentDocument.id, { ...field, ...updates });
    }
  };

  const handleFieldDelete = (fieldId: string) => {
    if (!currentDocument) return;
    removeField(currentDocument.id, fieldId);
    setSelectedField(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!currentDocument || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Calculate position relative to the PDF document container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to percentage for responsive positioning
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Check if we're moving an existing field
    const fieldId = e.dataTransfer.getData('fieldId');
    if (fieldId) {
      // Update existing field position
      const field = currentDocument.fields.find(f => f.id === fieldId);
      if (field) {
        handleFieldUpdate(fieldId, {
          position: {
            x: Math.max(0, Math.min(percentX, 95)),
            y: Math.max(0, Math.min(percentY, 95))
          }
        });
      }
      return;
    }

    // Creating new field
    const type = e.dataTransfer.getData('fieldType') as DocumentField['type'];
    if (!type) return;

    // Use first recipient if available, otherwise create a default one
    const recipientId = currentDocument.recipients.length > 0 
      ? currentDocument.recipients[0].id 
      : 'default-recipient';

    const newField: DocumentField = {
      id: crypto.randomUUID(),
      type,
      recipientId,
      position: { 
        x: Math.max(0, Math.min(percentX, 95)), // Keep within bounds
        y: Math.max(0, Math.min(percentY, 95)) 
      },
      size: FIELD_DEFAULT_SIZES[type],
      required: true,
      page: currentPage,
      value: type === 'text' ? 'Click to edit' : undefined,
    };

    addField(currentDocument.id, newField);
    setSelectedField(newField);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSave = () => {
    navigate('/summary');
  };

  if (!currentDocument) {
    navigate('/upload');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <ProgressBar />
      </div>

      <div className="flex flex-1">
        <EditorSidebar />
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Document Editor</h2>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>

          <div 
            ref={containerRef}
            className={`bg-gray-100 rounded-lg p-4 flex justify-center relative overflow-auto min-h-[600px] transition-colors ${
              isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="relative">
              {currentDocument.file && (
                <PDFViewer
                  file={currentDocument.file}
                  pageNumber={currentPage}
                  onPageChange={setCurrentPage}
                  onLoadSuccess={setTotalPages}
                />
              )}
              {currentDocument.fields
                .filter(field => field.page === currentPage)
                .map(field => (
                  <div
                    key={field.id}
                    style={{
                      position: 'absolute',
                      left: `${field.position.x}%`,
                      top: `${field.position.y}%`,
                      width: field.size.width,
                      height: field.size.height,
                    }}
                    className={`bg-white shadow-sm rounded cursor-pointer transition-opacity relative ${
                      selectedField?.id === field.id ? 'ring-2 ring-blue-500' : ''
                    } ${draggingFieldId === field.id ? 'opacity-50' : ''}`}
                    onClick={() => setSelectedField(field)}
                    draggable
                    onDragStart={(e) => {
                      setDraggingFieldId(field.id);
                      e.dataTransfer.setData('fieldId', field.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnd={() => setDraggingFieldId(null)}
                  >
                    {/* Control buttons - only show when selected */}
                    {selectedField?.id === field.id && (
                      <div className="absolute -top-2 -right-2 flex space-x-1 z-10">
                        <button className="w-5 h-5 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600">
                          <GripHorizontal className="w-2 h-2" />
                        </button>
                        <button 
                          className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFieldDelete(field.id);
                          }}
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    )}

                    {/* Field content */}
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={field.value || ''}
                        onChange={(e) => handleFieldUpdate(field.id, { value: e.target.value })}
                        placeholder="Enter text..."
                        className="w-full h-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {field.type === 'signature' && (
                      <button
                        className={`w-full h-full min-h-[40px] border-2 rounded flex items-center justify-center transition-colors ${
                          field.value === 'Signed'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-dashed border-blue-500 text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldUpdate(field.id, { 
                            value: field.value === 'Signed' ? '' : 'Signed' 
                          });
                        }}
                      >
                        {field.value === 'Signed' ? 'Signed' : 'Click to sign'}
                      </button>
                    )}
                    {field.type === 'date' && (
                      <input
                        type="date"
                        value={field.value || ''}
                        onChange={(e) => handleFieldUpdate(field.id, { value: e.target.value })}
                        className="w-full h-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {field.type === 'checkbox' && (
                      <div className="w-full h-full flex items-center justify-center p-2">
                        <input
                          type="checkbox"
                          checked={field.value === 'true'}
                          onChange={(e) => handleFieldUpdate(field.id, { value: e.target.checked.toString() })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                    {field.type === 'initial' && (
                      <button
                        className={`w-full h-full min-h-[40px] border-2 rounded flex items-center justify-center transition-colors ${
                          field.value === 'Initialed'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-dashed border-blue-500 text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldUpdate(field.id, { 
                            value: field.value === 'Initialed' ? '' : 'Initialed' 
                          });
                        }}
                      >
                        {field.value === 'Initialed' ? 'Initialed' : 'Click to initial'}
                      </button>
                    )}
                    
                    {/* Required indicator */}
                    {field.required && (
                      <span className="absolute -top-2 -left-2 text-red-500 text-sm">*</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};