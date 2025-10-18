import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Image, Video, File, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { documentsApi } from '@/lib/api';

interface FileUploadModalProps {
  project: any;
  onClose: () => void;
  onUpload: (file: File, tags: string) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ project, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch existing documents when modal opens
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoadingDocuments(true);
        const documents = await documentsApi.getByProject(project._id);
        setExistingDocuments(documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Failed to load existing documents.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    if (project._id) {
      fetchDocuments();
    }
  }, [project._id, toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 50MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/quicktime',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PDF, PPT, PPTX, DOC, DOCX, images, and videos are allowed.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(selectedFile, tags);
      setSelectedFile(null);
      setTags('');
      
      // Refresh the documents list
      const documents = await documentsApi.getByProject(project._id);
      setExistingDocuments(documents);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('image')) return <Image className="w-8 h-8 text-blue-500" />;
    if (file.type.includes('video')) return <Video className="w-8 h-8 text-purple-500" />;
    if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
      return <FileText className="w-8 h-8 text-orange-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const getDocumentIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="w-6 h-6 text-blue-500" />;
      case 'video':
        return <Video className="w-6 h-6 text-purple-500" />;
      case 'presentation':
        return <FileText className="w-6 h-6 text-orange-500" />;
      case 'document':
        return <FileText className="w-6 h-6 text-green-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
            <p className="text-gray-600 mt-1">Upload a document for {project.name}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-edicius-gold transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.txt"
            />
            
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-4">
                {getFileIcon(selectedFile)}
                <div className="text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to select</p>
                <p className="text-sm text-gray-500">PDF, PPT, DOC, Images, Videos (max 50MB)</p>
              </div>
            )}
          </div>

          {/* Existing Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Existing Documents</h3>
            {isLoadingDocuments ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-edicius-gold/30 border-t-edicius-gold rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading documents...</p>
              </div>
            ) : existingDocuments.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {existingDocuments.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getDocumentIcon(doc.fileType)}
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.fileType} • {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.s3Url, '_blank')}
                        className="text-edicius-gold border-edicius-gold hover:bg-edicius-gold/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No documents uploaded yet</p>
              </div>
            )}
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., presentation, planning, technical"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-edicius-gold"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-edicius-gold text-edicius-navy hover:bg-edicius-gold/90 disabled:opacity-50"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-edicius-navy/30 border-t-edicius-navy rounded-full animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              'Upload File'
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FileUploadModal;
