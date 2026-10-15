import { getVisitorLogs, getVisitorStats } from '@/lib/data/visitor-logs';
import UserLogsViewer from './UserLogsViewer';

export const metadata = {
  title: 'User Activity Logs | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminLogsPage() {
  const [logs, stats] = await Promise.all([
    getVisitorLogs({ limit: 200 }),
    getVisitorStats(),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <UserLogsViewer initialLogs={logs} initialStats={stats} />
    </div>
  );
}

