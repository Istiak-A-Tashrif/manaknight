import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Mail, User } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';
import { ProgressBar } from '../components/ProgressBar';
import type { Recipient } from '../types';

export const RecipientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDocument, addRecipient, removeRecipient } = useDocumentStore();
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '' });

  const handleAddRecipient = () => {
    if (currentDocument && newRecipient.name && newRecipient.email) {
      const recipient: Recipient = {
        id: crypto.randomUUID(),
        ...newRecipient
      };
      addRecipient(currentDocument.id, recipient);
      setNewRecipient({ name: '', email: '' });
    }
  };

  const handleSubmit = () => {
    if (currentDocument?.recipients.length > 0) {
      navigate('/editor');
    }
  };

  if (!currentDocument) {
    navigate('/upload');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressBar />
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Add Recipients</h2>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={newRecipient.email}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleAddRecipient}
            disabled={!newRecipient.name || !newRecipient.email}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Recipient
          </button>
        </div>

        {currentDocument.recipients.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Recipients</h3>
            <div className="space-y-3">
              {currentDocument.recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-sm text-gray-500">{recipient.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeRecipient(currentDocument.id, recipient.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={currentDocument.recipients.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Editor
          </button>
        </div>
      </div>
    </div>
  );
};