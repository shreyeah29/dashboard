import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Upload, 
  FileText, 
  MessageSquare,
  Plus,
  Trash2,
  Save,
  Users,
  Calendar,
  Building2
} from 'lucide-react';
import { projectsApi, documentsApi, commentsApi } from '@/lib/api';
import { formatDate, getStatusColor, getDocumentIcon, formatFileSize } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Planned', 'In Progress', 'Completed']),
});

const commentSchema = z.object({
  text: z.string().min(1, 'Comment is required'),
});

type ProjectForm = z.infer<typeof projectSchema>;
type CommentForm = z.infer<typeof commentSchema>;

const AdminProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getBySlug(id!),
    enabled: !!id,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', project?._id],
    queryFn: () => commentsApi.getByProject(project!._id),
    enabled: !!project?._id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectForm> }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      setIsEditing(false);
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ projectId, text }: { projectId: string; text: string }) =>
      commentsApi.create(projectId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', project?._id] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: commentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', project?._id] });
    },
  });

  const {
    register: registerProject,
    handleSubmit: handleProjectSubmit,
    formState: { errors: projectErrors },
    reset: resetProject,
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      status: project?.status || 'Planned',
    },
  });

  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    formState: { errors: commentErrors },
    reset: resetComment,
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
  });

  const onDrop = async (acceptedFiles: File[]) => {
    if (!project) return;
    
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        await documentsApi.upload(project._id, file);
      }
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const onProjectSubmit = (data: ProjectForm) => {
    if (project) {
      updateMutation.mutate({ id: project._id, data });
    }
  };

  const onCommentSubmit = (data: CommentForm) => {
    if (project) {
      commentMutation.mutate({ projectId: project._id, text: data.text });
      resetComment();
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
        <Link to="/admin/projects">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const company = typeof project.companyId === 'object' ? project.companyId : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/admin/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-edicius-navy mb-2">
              {project.title}
            </h1>
            {company && (
              <div className="flex items-center text-gray-600 mb-4">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{company.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              <span className="text-sm text-gray-500">
                Created {formatDate(project.createdAt)}
              </span>
            </div>
          </div>
          <Button
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                resetProject({
                  title: project.title,
                  description: project.description,
                  status: project.status,
                });
              }
            }}
          >
            {isEditing ? 'Cancel' : 'Edit Project'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <Input
                        {...registerProject('title')}
                        placeholder="Project title"
                      />
                      {projectErrors.title && (
                        <p className="text-sm text-red-600 mt-1">
                          {projectErrors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        {...registerProject('description')}
                        placeholder="Project description"
                        rows={6}
                      />
                      {projectErrors.description && (
                        <p className="text-sm text-red-600 mt-1">
                          {projectErrors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        {...registerProject('status')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-edicius-gold"
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Members */}
          {project.team && project.team.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Team Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.team.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-edicius-gold rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Upload Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
                    isDragActive
                      ? 'border-edicius-gold bg-yellow-50'
                      : 'border-gray-300 hover:border-edicius-gold hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  {uploading ? (
                    <p className="text-gray-600">Uploading...</p>
                  ) : isDragActive ? (
                    <p className="text-edicius-gold">Drop files here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-1">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, Images, PowerPoint, Word documents
                      </p>
                    </div>
                  )}
                </div>

                {/* Documents List */}
                {project.documents && project.documents.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {project.documents.map((doc: any) => (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {doc.type.toUpperCase()} • {formatFileSize(doc.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteComment(doc._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Comments & Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="space-y-4">
                    <div>
                      <Textarea
                        {...registerComment('text')}
                        placeholder="Add a comment or note..."
                        rows={3}
                      />
                      {commentErrors.text && (
                        <p className="text-sm text-red-600 mt-1">
                          {commentErrors.text.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit" disabled={commentMutation.isPending}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </form>

                {/* Comments List */}
                {comments && comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id} className="border-l-4 border-edicius-gold pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author === 'admin' ? 'Admin' : 'System'}
                            {comment.author === 'admin' && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                (internal note)
                              </span>
                            )}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No comments yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">{formatDate(project.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">{formatDate(project.updatedAt)}</p>
                </div>

                {project.team && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Team Size</label>
                    <p className="text-sm text-gray-900">{project.team.length} members</p>
                  </div>
                )}

                {project.documents && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Documents</label>
                    <p className="text-sm text-gray-900">{project.documents.length} files</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectDetail;
