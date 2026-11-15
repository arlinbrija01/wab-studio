import { notFound } from 'next/navigation';
import { adminBase } from '@/lib/admin/auth';
import { getSiteData } from '@/lib/data/content';
import type { Project } from '@/lib/data/types';
import ProjectEditor from './ProjectEditor';

function emptyProject(order: number): Project {
  return {
    id: `prj-${Date.now().toString(36)}`,
    slug: '',
    client: '',
    title: { it: '' },
    year: String(new Date().getFullYear()),
    sector: { it: '' },
    services: [{ it: '' }],
    excerpt: { it: '' },
    challenge: { it: '' },
    solution: { it: '' },
    results: [
      { value: '', label: { it: '' } },
      { value: '', label: { it: '' } },
      { value: '', label: { it: '' } },
    ],
    accent: '#2f6bff',
    gallery: [],
    featured: false,
    published: false,
    order,
    updatedAt: new Date().toISOString(),
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSiteData();

  const isNew = id === 'nuovo';
  const project = isNew
    ? emptyProject(data.projects.length)
    : data.projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <ProjectEditor
      base={adminBase()}
      project={project}
      media={data.media}
      isNew={isNew}
      siteUrl={data.settings.url}
    />
  );
}
