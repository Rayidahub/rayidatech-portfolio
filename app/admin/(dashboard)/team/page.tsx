import { createClient } from '@/lib/supabase/server';
import TeamManagementClient from '@/components/admin/team/TeamManagementClient';
import type { TeamMember } from '@/types/team-member';

export const revalidate = 0;

export default async function AdminTeam() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <TeamManagementClient initialMembers={(members || []) as TeamMember[]} />
    </div>
  );
}
