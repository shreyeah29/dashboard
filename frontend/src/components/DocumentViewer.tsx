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
      // First, try to get the document URL through the API
      console.log('Fetching document URL for:', document._id);
      const apiResponse = await documentsApi.getById(document._id);
      
      if (apiResponse.presignedUrl) {
        console.log('Got presigned URL from API:', apiResponse.presignedUrl);
        setViewUrl(apiResponse.presignedUrl);
        return;
      }
      
      // If API doesn't provide URL, construct it manually
      const backendUrl = 'https://edicius-dashboard.onrender.com';
      const fileName = document.s3Key || document.name;
      const constructedUrl = `${backendUrl}/uploads/project-documents/${fileName}`;
      
      console.log('Constructed URL:', constructedUrl);
      
      // Test if the constructed URL is accessible
      try {
        const response = await fetch(constructedUrl, { method: 'HEAD' });
        if (response.ok) {
          setViewUrl(constructedUrl);
          console.log('Constructed URL is accessible');
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (fetchErr) {
        console.error('Constructed URL not accessible:', fetchErr);
        // Try the original s3Url as fallback
        if (document.s3Url) {
          console.log('Trying original s3Url:', document.s3Url);
          setViewUrl(document.s3Url);
        } else {
          setError('Document file not found. Please contact support.');
        }
      }
    } catch (err) {
      console.error('Error fetching document view URL:', err);
      setError('Failed to load document. Please try again later.');
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
                  let docUrl = viewUrl;
                  
                  // If we don't have a viewUrl, try to get it
                  if (!docUrl) {
                    try {
                      const apiResponse = await documentsApi.getById(document._id);
                      docUrl = apiResponse.presignedUrl;
                    } catch (apiErr) {
                      // Construct URL manually
                      const backendUrl = 'https://edicius-dashboard.onrender.com';
                      const fileName = document.s3Key || document.name;
                      docUrl = `${backendUrl}/uploads/project-documents/${fileName}`;
                    }
                  }
                  
                  if (docUrl) {
                    console.log('Opening document in new tab:', docUrl);
                    const newWindow = window.open(docUrl, '_blank');
                    if (!newWindow) {
                      setError('Please allow popups to view this document');
                    }
                  } else {
                    setError('Document URL not available');
                  }
                } catch (err) {
                  console.error('Error opening document:', err);
                  setError('Failed to open document. Please try again.');
                }
              }}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Open in New Tab
            </Button>
            <Button 
              onClick={async () => {
                try {
                  let docUrl = viewUrl;
                  
                  // If we don't have a viewUrl, try to get it
                  if (!docUrl) {
                    try {
                      const apiResponse = await documentsApi.getById(document._id);
                      docUrl = apiResponse.presignedUrl;
                    } catch (apiErr) {
                      // Construct URL manually
                      const backendUrl = 'https://edicius-dashboard.onrender.com';
                      const fileName = document.s3Key || document.name;
                      docUrl = `${backendUrl}/uploads/project-documents/${fileName}`;
                    }
                  }
                  
                  if (docUrl) {
                    // Use Google Docs Viewer for presentations and documents
                    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(docUrl)}&embedded=true`;
                    console.log('Opening Google Docs Viewer with URL:', googleViewerUrl);
                    const newWindow = window.open(googleViewerUrl, '_blank');
                    if (!newWindow) {
                      setError('Please allow popups to view this document');
                    }
                  } else {
                    setError('Document URL not available');
                  }
                } catch (err) {
                  console.error('Error opening Google Docs Viewer:', err);
                  setError('Failed to open document viewer. Please try again.');
                }
              }}
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white"
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
              let docUrl = viewUrl;
              
              // If we don't have a viewUrl, try to get it
              if (!docUrl) {
                try {
                  const apiResponse = await documentsApi.getById(document._id);
                  docUrl = apiResponse.presignedUrl;
                } catch (apiErr) {
                  // Construct URL manually
                  const backendUrl = 'https://edicius-dashboard.onrender.com';
                  const fileName = document.s3Key || document.name;
                  docUrl = `${backendUrl}/uploads/project-documents/${fileName}`;
                }
              }
              
              if (docUrl) {
                console.log('Opening document in new tab:', docUrl);
                const newWindow = window.open(docUrl, '_blank');
                if (!newWindow) {
                  setError('Please allow popups to view this document');
                }
              } else {
                setError('Document URL not available');
              }
            } catch (err) {
              console.error('Error opening document:', err);
              setError('Failed to open document. Please try again.');
            }
          }}
          className="bg-black hover:bg-gray-800 text-white"
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
