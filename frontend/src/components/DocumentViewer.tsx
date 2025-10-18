import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Eye, FileText, Image, Presentation, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { documentsApi } from '@/lib/api';
import { formatFileSize, getDocumentIcon } from '@/lib/utils';

interface DocumentViewerProps {
  document: {
    _id: string;
    name: string;
    fileType: string;
    fileSize: number;
    s3Url: string;
    mimeType: string;
  };
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer = ({ document, projectName, isOpen, onClose }: DocumentViewerProps) => {
  const [viewUrl, setViewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && document._id) {
      console.log('DocumentViewer opened with document:', document);
      fetchViewUrl();
    }
  }, [isOpen, document._id]);

  const fetchViewUrl = async () => {
    setLoading(true);
    setError('');
    try {
      // Check if the document URL is accessible
      const testUrl = document.s3Url;
      console.log('Testing document URL:', testUrl);
      
      // Try to fetch the document to check if it's accessible
      const response = await fetch(testUrl, { method: 'HEAD' });
      
      if (response.ok) {
        setViewUrl(testUrl);
      } else {
        // If direct URL fails, try to get it through the API
        const apiResponse = await documentsApi.getById(document._id);
        if (apiResponse.presignedUrl) {
          setViewUrl(apiResponse.presignedUrl);
        } else {
          setError('Document not accessible. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Error fetching document view URL:', err);
      // Try alternative approach - use the API endpoint
      try {
        const apiResponse = await documentsApi.getById(document._id);
        if (apiResponse.presignedUrl) {
          setViewUrl(apiResponse.presignedUrl);
        } else {
          setError('Failed to load document preview. The file may not be accessible.');
        }
      } catch (apiErr) {
        console.error('API call failed:', apiErr);
        // Try direct backend URL as last resort
        const directUrl = `https://edicius-dashboard.onrender.com/uploads/project-documents/${document.s3Key || document.name}`;
        console.log('Trying direct URL:', directUrl);
        setViewUrl(directUrl);
        setError('Using direct file access. If this fails, the file may not be available.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const renderDocumentContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <FileText className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Preview Not Available</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      );
    }

    // Determine file type from mimeType
    const isPdf = document.mimeType === 'application/pdf';
    const isImage = document.mimeType.startsWith('image/');
    const isPresentation = document.mimeType.includes('presentation') || document.mimeType.includes('powerpoint');
    const isDocument = document.mimeType.includes('document') || document.mimeType.includes('word');

    if (isPdf) {
      return (
        <div className="w-full h-full">
          <iframe
            src={viewUrl}
            className="w-full h-full border-0"
            title={document.name}
            onContextMenu={handleContextMenu}
            style={{
              pointerEvents: 'auto',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              userSelect: 'none'
            }}
          />
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={viewUrl}
            alt={document.name}
            className="max-w-full max-h-full object-contain"
            onContextMenu={handleContextMenu}
            style={{
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              userSelect: 'none'
            }}
          />
          {/* Watermark overlay */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium">
            {projectName}
          </div>
        </div>
      );
    }

    if (isPresentation || isDocument) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <Presentation className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Preview Not Available</h3>
          <p className="text-gray-500 mb-4">
            This document type cannot be previewed inline.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              <strong>File:</strong> {document.name}<br />
              <strong>Type:</strong> {document.fileType.toUpperCase()}<br />
              <strong>Size:</strong> {formatFileSize(document.fileSize)}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={async () => {
                try {
                  if (viewUrl) {
                    const newWindow = window.open(viewUrl, '_blank');
                    if (!newWindow) {
                      setError('Please allow popups to view this document');
                    }
                  } else {
                    // Try to get the document URL again
                    const apiResponse = await documentsApi.getById(document._id);
                    if (apiResponse.presignedUrl) {
                      const newWindow = window.open(apiResponse.presignedUrl, '_blank');
                      if (!newWindow) {
                        setError('Please allow popups to view this document');
                      }
                    } else {
                      setError('Document URL not available');
                    }
                  }
                } catch (err) {
                  setError('Failed to open document. Please try again.');
                }
              }}
              className="bg-edicius-gold hover:bg-edicius-gold/90 text-white"
            >
              Open in New Tab
            </Button>
            <Button 
              onClick={async () => {
                try {
                  const docUrl = viewUrl || (await documentsApi.getById(document._id)).presignedUrl;
                  if (docUrl) {
                    // Try Google Docs Viewer as fallback
                    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(docUrl)}&embedded=true`;
                    const newWindow = window.open(googleViewerUrl, '_blank');
                    if (!newWindow) {
                      setError('Please allow popups to view this document');
                    }
                  } else {
                    setError('Document URL not available');
                  }
                } catch (err) {
                  setError('Failed to open document viewer. Please try again.');
                }
              }}
              variant="outline"
              className="border-edicius-gold text-edicius-gold hover:bg-edicius-gold hover:text-white"
            >
              View with Google Docs
            </Button>
          </div>
        </div>
      );
    }

    // Default case for other file types
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <File className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">File Preview</h3>
        <p className="text-gray-500 mb-4">
          This file type cannot be previewed inline.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            <strong>File:</strong> {document.name}<br />
            <strong>Type:</strong> {document.fileType.toUpperCase()}<br />
            <strong>Size:</strong> {formatFileSize(document.fileSize)}
          </p>
        </div>
        <Button 
          onClick={async () => {
            try {
              if (viewUrl) {
                const newWindow = window.open(viewUrl, '_blank');
                if (!newWindow) {
                  setError('Please allow popups to view this document');
                }
              } else {
                // Try to get the document URL again
                const apiResponse = await documentsApi.getById(document._id);
                if (apiResponse.presignedUrl) {
                  const newWindow = window.open(apiResponse.presignedUrl, '_blank');
                  if (!newWindow) {
                    setError('Please allow popups to view this document');
                  }
                } else {
                  setError('Document URL not available');
                }
              }
            } catch (err) {
              setError('Failed to open document. Please try again.');
            }
          }}
          className="bg-edicius-gold hover:bg-edicius-gold/90 text-white"
        >
          Open in New Tab
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getDocumentIcon(document.fileType)}</span>
              <div>
                <DialogTitle className="text-left">{document.name}</DialogTitle>
                <p className="text-sm text-gray-500">
                  {document.fileType.toUpperCase()} • {formatFileSize(document.fileSize)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-6 pt-0">
          <div className="w-full h-full border rounded-lg overflow-hidden bg-gray-50">
            {renderDocumentContent()}
          </div>
        </div>

        {/* Footer with view-only notice */}
        <div className="p-6 pt-0">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">View Only</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              This document is displayed in view-only mode. Download and print functions are disabled.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
