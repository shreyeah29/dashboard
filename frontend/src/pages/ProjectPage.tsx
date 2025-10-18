import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi, commentsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import EnhancedProjectPage from '@/components/EnhancedProjectPage';

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', project?._id],
    queryFn: () => commentsApi.getByProject(project!._id),
    enabled: !!project?._id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const company = typeof project.companyId === 'object' ? project.companyId : null;

  return (
    <EnhancedProjectPage 
      project={project} 
      company={company} 
      comments={comments} 
    />
  );
};

export default ProjectPage;
