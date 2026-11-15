import { getSiteData } from '@/lib/data/content';
import SettingsEditor from './SettingsEditor';

export default async function SettingsPage() {
  const data = await getSiteData();
  return <SettingsEditor settings={data.settings} />;
}
