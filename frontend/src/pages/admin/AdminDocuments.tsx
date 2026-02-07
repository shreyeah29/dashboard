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
  const [viewingCompanyId, setViewingCompanyId] = useState<string | null>(null);
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

  const documentTags = ['ROC', 'financial', 'tax', 'GST', 'banking', 'director', 'HR', 'audit'];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1F3A] to-[#1e3a5f] flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Company KYC</h1>
                  <p className="text-slate-500 text-sm mt-0.5">KYC documents organized by company and category</p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-[#0B1F3A] to-[#1e3a5f] text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/25 transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Upload KYC Document</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-8"
        >
          {/* Companies Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 pt-6 px-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[calc(100vh-280px)] overflow-y-auto">
                    {companies.map((company, i) => {
                      const companyDocCount = documents.filter(
                        (d) => d.companyId === company._id || d.company === company.name
                      ).length;
                      const isSelected = viewingCompanyId === company._id;
                      return (
                        <motion.button
                          key={company._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setViewingCompanyId(isSelected ? null : company._id)}
                          className={`w-full text-left px-5 py-4 transition-all duration-200 flex items-center justify-between gap-3 group ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#0B1F3A] to-[#1e3a5f] text-white'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <span className={`truncate font-medium ${isSelected ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                            {company.name}
                          </span>
                          <span className={`flex-shrink-0 min-w-[28px] h-7 px-2 rounded-lg flex items-center justify-center text-xs font-semibold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}>
                            {companyDocCount}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Documents Panel */}
          <div className="flex-1 min-w-0">
            {!viewingCompanyId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6 shadow-inner">
                  <Building2 className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Select a company</h3>
                <p className="text-slate-500 max-w-sm">Click a company from the list to view its KYC documents, organized by category for easy access.</p>
              </motion.div>
            ) : documentsLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin"></div>
                <span className="ml-4 text-slate-600 font-medium">Loading documents...</span>
              </div>
            ) : (() => {
              const viewingCompany = companies.find((c) => c._id === viewingCompanyId);
              const companyDocs = documents.filter(
                (d) => d.companyId === viewingCompanyId || d.company === viewingCompany?.name
              );
              if (companyDocs.length === 0) {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24"
                  >
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <FileText className="w-12 h-12 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No documents yet</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">Upload KYC documents for {viewingCompany?.name} to get started. Keep your compliance records organized and professional.</p>
                    <Button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="bg-gradient-to-r from-[#0B1F3A] to-[#1e3a5f] text-white hover:opacity-90 shadow-lg px-6 py-3 rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </motion.div>
                );
              }
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingCompanyId(null)}
                        className="text-slate-500 hover:text-slate-700 -ml-2 mb-2"
                      >
                        ← Back to companies
                      </Button>
                      <h2 className="text-2xl font-bold text-slate-900">{viewingCompany?.name}</h2>
                    </div>
                  </div>
                  {documentTags.map((tag) => {
                    const docsForTag = companyDocs.filter((d) =>
                      (d.tags || []).some((t: string) => t.toLowerCase() === tag.toLowerCase())
                    );
                    if (docsForTag.length === 0) return null;
                    return (
                      <div key={tag}>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#0B1F3A] to-amber-400"></span>
                          {tag}
                        </h4>
                        <div className="space-y-3">
                          {docsForTag.map((document) => (
                            <Card key={document._id} className="border border-slate-200/80 bg-white hover:shadow-lg hover:border-slate-200 transition-all duration-200 overflow-hidden group">
                              <CardContent className="p-0">
                                <div className="flex items-center justify-between p-5">
                                  <div className="flex items-center space-x-4 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200/80 transition-colors">
                                      {getFileIcon(document.type)}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-slate-900 truncate">{document.name}</h3>
                                        {documentAvailability[document._id] === false && (
                                          <Badge variant="outline" className="text-xs border-red-200 text-red-600 bg-red-50">
                                            File Missing
                                          </Badge>
                                        )}
                                        {documentAvailability[document._id] === true && (
                                          <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-600 bg-emerald-50">
                                            Available
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                        <span>{document.size}</span>
                                        <span>•</span>
                                        <span>{document.uploadedAt}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 flex-shrink-0">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handlePreview(document)}
                                      disabled={documentAvailability[document._id] === false}
                                      className="border-slate-200 hover:bg-slate-50"
                                      title="View"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDownload(document)}
                                      disabled={documentAvailability[document._id] === false}
                                      className="border-slate-200 hover:bg-slate-50"
                                      title="Download"
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete(document._id, document.name)}
                                      className="border-red-100 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {/* Documents with no matching tag */}
                  {(() => {
                    const untaggedDocs = companyDocs.filter(
                      (d) =>
                        !documentTags.some((tag) =>
                          (d.tags || []).some((t: string) => t.toLowerCase() === tag.toLowerCase())
                        )
                    );
                    if (untaggedDocs.length === 0) return null;
                    return (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-1 h-4 rounded-full bg-slate-300"></span>
                          Other
                        </h4>
                        <div className="space-y-3">
                          {untaggedDocs.map((document) => (
                            <Card key={document._id} className="border border-slate-200/80 bg-white hover:shadow-lg transition-all">
                              <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                      {getFileIcon(document.type)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900">{document.name}</h3>
                                        {documentAvailability[document._id] === false && (
                                          <Badge variant="outline" className="text-xs border-red-200 text-red-600 bg-red-50">File Missing</Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-slate-500 mt-1">{document.size} • {document.uploadedAt}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handlePreview(document)} disabled={documentAvailability[document._id] === false} className="border-slate-200">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDownload(document)} disabled={documentAvailability[document._id] === false} className="border-slate-200">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(document._id, document.name)} className="border-red-100 text-red-600">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              );
            })()}
          </div>
        </motion.div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsUploadModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/80 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1e3a5f] px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Upload KYC Document</h2>
                      <p className="text-slate-300 text-sm">Add documents to your company records</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] transition-all"
                  >
                    <option value="">Choose a company...</option>
                    {companies.map(company => (
                      <option key={company._id} value={company._id}>{company.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Document Category</label>
                  <div className="flex flex-wrap gap-2">
                    {documentTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedTags.includes(tag)
                            ? 'bg-[#0B1F3A] text-white shadow-lg shadow-slate-900/10'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Files</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#0B1F3A]/30 hover:bg-slate-50/50 transition-all duration-200 group">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center mx-auto mb-4 transition-colors">
                        <Upload className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-700 font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-slate-500 text-sm">PDF, DOC, PPT, XLS, Images (Max 10MB each)</p>
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.name.split('.').pop() || '')}
                            <span className="text-slate-800 font-medium">{file.name}</span>
                            <span className="text-slate-500 text-sm">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || !selectedCompany || uploadedFiles.length === 0}
                    className="bg-gradient-to-r from-[#0B1F3A] to-[#1e3a5f] text-white hover:opacity-90 shadow-lg disabled:opacity-50 rounded-xl px-6"
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
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDocuments;
