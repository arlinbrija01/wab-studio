import { redirect } from 'next/navigation';
import { adminBase, getSession } from '@/lib/admin/auth';
import { getSiteData } from '@/lib/data/content';
import AdminShell from './AdminShell';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const email = await getSession();
  if (!email) redirect(`${adminBase()}/accedi`);

  const data = await getSiteData();

  return (
    <AdminShell base={adminBase()} email={email} updatedAt={data.updatedAt}>
      {children}
    </AdminShell>
  );
}
