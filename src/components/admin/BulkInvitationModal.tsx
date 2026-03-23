'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { invitationService, CreateInvitationData } from '@/services/invitationService';

interface BulkInvitationModalProps {
  onClose: () => void;
  onSuccess: (results: BulkInvitationResults) => void;
}

interface BulkInvitationResults {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
}

interface ParsedInvitation {
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  cohort_id?: string;
  message?: string;
}

export default function BulkInvitationModal({ onClose, onSuccess }: BulkInvitationModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedInvitations, setParsedInvitations] = useState<ParsedInvitation[]>([]);
  const [processingResults, setProcessingResults] = useState<BulkInvitationResults | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setErrors([]);
        parseCSV(selectedFile);
      } else {
        setErrors(['Please select a valid CSV file']);
      }
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setErrors(['CSV file must contain at least a header row and one data row']);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const expectedHeaders = ['email', 'role'];
        const optionalHeaders = ['cohort_id', 'message'];

        // Validate headers
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setErrors([`Missing required headers: ${missingHeaders.join(', ')}`]);
          return;
        }

        const invitations: ParsedInvitation[] = [];
        const validationErrors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row: any = {};

          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          // Validate required fields
          if (!row.email) {
            validationErrors.push(`Row ${i + 1}: Email is required`);
            continue;
          }

          if (!row.role) {
            validationErrors.push(`Row ${i + 1}: Role is required`);
            continue;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(row.email)) {
            validationErrors.push(`Row ${i + 1}: Invalid email format`);
            continue;
          }

          // Validate role
          const validRoles = ['ADMIN', 'INSTRUCTOR', 'LEARNER'];
          if (!validRoles.includes(row.role.toUpperCase())) {
            validationErrors.push(`Row ${i + 1}: Role must be one of: ${validRoles.join(', ')}`);
            continue;
          }

          invitations.push({
            email: row.email,
            role: row.role.toUpperCase() as 'ADMIN' | 'INSTRUCTOR' | 'LEARNER',
            cohort_id: row.cohort_id || undefined,
            message: row.message || undefined,
          });
        }

        if (validationErrors.length > 0) {
          setErrors(validationErrors.slice(0, 10)); // Show first 10 errors
        } else if (invitations.length === 0) {
          setErrors(['No valid invitations found in CSV']);
        } else {
          setParsedInvitations(invitations);
          setStep('preview');
        }
      } catch (error) {
        setErrors(['Failed to parse CSV file']);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessInvitations = async () => {
    setIsProcessing(true);
    setStep('processing');

    const results: BulkInvitationResults = {
      total: parsedInvitations.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    try {
      // Process invitations in batches to avoid overwhelming the server
      const batchSize = 5;
      for (let i = 0; i < parsedInvitations.length; i += batchSize) {
        const batch = parsedInvitations.slice(i, i + batchSize);
        
        for (const invitation of batch) {
          try {
            await invitationService.createInvitation({
              ...invitation,
              expiresIn: 72, // Default 72 hours
            });
            results.successful++;
          } catch (error) {
            results.failed++;
            results.errors.push(`${invitation.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setProcessingResults(results);
      setStep('results');
      onSuccess(results);
    } catch (error) {
      setErrors(['Failed to process invitations']);
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'email,role,cohort_id,message\n' +
      'john.doe@example.com,LEARNER,cohort-123,Welcome to our cohort!\n' +
      'jane.smith@example.com,INSTRUCTOR,,We invite you to be an instructor\n' +
      'admin@example.com,ADMIN,,Join our admin team';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_invitation_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setFile(null);
    setParsedInvitations([]);
    setProcessingResults(null);
    setErrors([]);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {step === 'upload' && 'Bulk Invitation Upload'}
            {step === 'preview' && 'Review Invitations'}
            {step === 'processing' && 'Processing Invitations'}
            {step === 'results' && 'Processing Results'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              <p className="mb-4">Upload a CSV file with the following columns:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-xs mb-2">email,role,cohort_id,message</p>
                <ul className="text-xs space-y-1">
                  <li><strong>email</strong> (required): Valid email address</li>
                  <li><strong>role</strong> (required): ADMIN, INSTRUCTOR, or LEARNER</li>
                  <li><strong>cohort_id</strong> (optional): Cohort identifier</li>
                  <li><strong>message</strong> (optional): Custom message for the invitation</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={downloadTemplate}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Download CSV Template
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop your CSV file here or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Choose File
              </label>
              {file && (
                <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  {file.name}
                </div>
              )}
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-red-800 font-medium mb-2">Validation Errors:</p>
                    <ul className="text-red-700 text-sm space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 'preview' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-green-800">
                  Successfully parsed {parsedInvitations.length} invitations from CSV
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Review the invitations below before processing:
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cohort</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedInvitations.map((invitation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{invitation.email}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          invitation.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          invitation.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {invitation.role}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{invitation.cohort_id || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-xs">
                        {invitation.message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={resetModal}>
                Back
              </Button>
              <Button onClick={handleProcessInvitations} disabled={isProcessing}>
                Process {parsedInvitations.length} Invitations
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 mb-2">Processing invitations...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 'results' && processingResults && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{processingResults.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{processingResults.successful}</p>
                <p className="text-sm text-gray-600">Successful</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{processingResults.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </div>

            {processingResults.errors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Errors:</p>
                <div className="max-h-48 overflow-y-auto bg-red-50 border border-red-200 rounded-lg p-3">
                  <ul className="text-red-700 text-sm space-y-1">
                    {processingResults.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
