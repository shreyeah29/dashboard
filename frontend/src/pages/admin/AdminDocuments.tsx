import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  Tag, 
  Calendar,
  User,
  Building2,
  Plus,
  X,
  File,
  Image,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { companiesApi, documentsApi } from '@/lib/api';

const AdminDocuments = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentAvailability, setDocumentAvailability] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  // Load real data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setDocumentsLoading(true);
        const [companiesData, documentsData] = await Promise.all([
          companiesApi.getAll(),
          documentsApi.getAll()
        ]);
        setCompanies(companiesData);
        setDocuments(documentsData);
        
        // Check availability of each document
        const availability: {[key: string]: boolean} = {};
        for (const doc of documentsData) {
          try {
            const docData = await documentsApi.getById(doc._id);
            const docUrl = docData.presignedUrl || doc.s3Url;
            if (docUrl) {
              const response = await fetch(docUrl, { method: 'HEAD' });
              availability[doc._id] = response.ok;
            } else {
              availability[doc._id] = false;
            }
          } catch (error) {
            availability[doc._id] = false;
          }
        }
        setDocumentAvailability(availability);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setDocumentsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const documentTags = ['Legal', 'Financial', 'Planning', 'Technical', 'Marketing', 'HR'];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'pptx':
      case 'ppt':
        return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="w-5 h-5 text-purple-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleUpload = async () => {
    if (!selectedCompany || uploadedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a company and upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      for (const file of uploadedFiles) {
        await companiesApi.uploadDocument(selectedCompany, file, selectedTags.join(','));
      }
      
      toast({
        title: "Upload Successful",
        description: `${uploadedFiles.length} file(s) uploaded successfully.`,
      });
      
      // Refresh documents list
      const documentsData = await documentsApi.getAll();
      setDocuments(documentsData);
      
      // Reset form
      setSelectedCompany('');
      setSelectedTags([]);
      setUploadedFiles([]);
      setIsUploadModalOpen(false);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (document: any) => {
    try {
      // Get the document URL
      const documentData = await documentsApi.getById(document._id);
      const documentUrl = documentData.presignedUrl || document.s3Url;
      
      if (documentUrl) {
        // First, check if the file is accessible
        const fileExtension = document.name.split('.').pop()?.toLowerCase();
        
        // Try to verify the file exists by making a HEAD request
        try {
          const response = await fetch(documentUrl, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error('File not accessible');
          }
        } catch (fetchError) {
          // File doesn't exist or isn't accessible
          toast({
            title: "File Not Available",
            description: "This file is no longer available on the server. It may have been lost during a deployment. Please re-upload the file.",
            variant: "destructive",
          });
          return;
        }
        
        // File exists, proceed with viewing
        if (['pdf'].includes(fileExtension)) {
          // For PDFs, open directly
          window.open(documentUrl, '_blank', 'noopener,noreferrer');
          toast({
            title: "Document Opened",
            description: `Opening ${document.name} in new tab`,
          });
        } else if (['ppt', 'pptx', 'doc', 'docx'].includes(fileExtension)) {
          // For Office documents, try multiple viewers
          const viewers = [
            {
              name: "Google Docs Viewer",
              url: `https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`
            },
            {
              name: "Microsoft Office Online",
              url: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl)}`
            }
          ];
          
          // Try Google Docs Viewer first
          const googleViewerUrl = viewers[0].url;
          window.open(googleViewerUrl, '_blank', 'noopener,noreferrer');
          
          toast({
            title: "Document Opened",
            description: `Opening ${document.name} with Google Docs Viewer. If preview fails, try downloading the file.`,
          });
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
          // For images, open directly
          window.open(documentUrl, '_blank', 'noopener,noreferrer');
          toast({
            title: "Image Opened",
            description: `Opening ${document.name} in new tab`,
          });
        } else {
          // For other files, try to open directly
          window.open(documentUrl, '_blank', 'noopener,noreferrer');
          toast({
            title: "File Opened",
            description: `Opening ${document.name} in new tab`,
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Document URL not available",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error opening document:', error);
      toast({
        title: "Error",
        description: "Failed to open document. The file may not be available on the server. Please try downloading or re-uploading the file.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (document: any) => {
    try {
      // Get the document URL
      const documentData = await documentsApi.getById(document._id);
      const documentUrl = documentData.presignedUrl || document.s3Url;
      
      if (documentUrl) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = documentUrl;
        link.download = document.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started",
          description: `Downloading ${document.name}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Document URL not available",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (documentId: string, documentName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${documentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await documentsApi.delete(documentId);
      toast({
        title: "Document Deleted",
        description: `"${documentName}" has been deleted successfully.`,
      });
      
      // Refresh the documents list
      const documentsData = await documentsApi.getAll();
      setDocuments(documentsData);
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2 font-serif tracking-wide">Documents Management</h1>
              <p className="text-gray-600 text-lg font-medium">Company presentation documents only — projects and units manage their own docs separately</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Upload Document</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-6"
        >
          {documentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <span className="ml-3 text-gray-600">Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No documents found</h3>
              <p className="text-gray-500">Upload your first document to get started.</p>
            </div>
          ) : (
            documents.map((document, index) => (
            <motion.div
              key={document._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white border border-gray-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(document.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-black">{document.name}</h3>
                          {documentAvailability[document._id] === false && (
                            <Badge 
                              variant="outline" 
                              className="text-xs border-red-500/30 text-red-500 bg-red-50"
                            >
                              File Missing
                            </Badge>
                          )}
                          {documentAvailability[document._id] === true && (
                            <Badge 
                              variant="outline" 
                              className="text-xs border-green-500/30 text-green-500 bg-green-50"
                            >
                              Available
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{document.size}</span>
                          <span>•</span>
                          <span>{document.company}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          {(document.tags || []).map((tag, tagIndex) => (
                            <Badge 
                              key={tagIndex}
                              variant="outline" 
                              className="text-xs border-gray-300 text-gray-700"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(document)}
                        disabled={documentAvailability[document._id] === false}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={documentAvailability[document._id] === false ? "File not available" : "View document"}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(document)}
                        disabled={documentAvailability[document._id] === false}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={documentAvailability[document._id] === false ? "File not available" : "Download document"}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(document._id, document.name)}
                        className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>Uploaded by {document.uploadedBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{document.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))
          )}
        </motion.div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-black">Upload Documents</h2>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Company Selection */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Select Company</label>
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-black"
                    >
                      <option value="">Choose a company...</option>
                      {companies.map(company => (
                        <option key={company._id} value={company._id}>{company.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tags Selection */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Document Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {documentTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Upload Files</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-black mb-2">Click to upload or drag and drop</p>
                        <p className="text-gray-600 text-sm">PDF, DOC, PPT, XLS, Images (Max 10MB each)</p>
                      </label>
                    </div>
                    
                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file.name.split('.').pop() || '')}
                              <span className="text-black text-sm">{file.name}</span>
                              <span className="text-gray-600 text-xs">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || !selectedCompany || uploadedFiles.length === 0}
                      className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        `Upload ${uploadedFiles.length} File(s)`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDocuments;
