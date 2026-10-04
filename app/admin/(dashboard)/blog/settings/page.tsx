import { getBlogSettings } from '@/lib/data/blog-settings';
import BlogSettingsForm from './BlogSettingsForm';

export const revalidate = 0;

export default async function AdminBlogSettingsPage() {
  const settings = await getBlogSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <BlogSettingsForm initialSettings={settings} />
    </div>
  );
}

