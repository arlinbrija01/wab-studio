import { adminBase } from '@/lib/admin/auth';
import { getSiteData } from '@/lib/data/content';
import ProjectsList from './ProjectsList';

export default async function ProjectsPage() {
  const data = await getSiteData();
  const projects = [...data.projects].sort((a, b) => a.order - b.order);

  return <ProjectsList base={adminBase()} projects={projects} />;
}
