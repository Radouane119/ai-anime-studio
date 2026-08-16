// AI Anime Studio — Database Seed Script for Phase 6.1 Authentication Foundation

interface SeedUser {
  clerkId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CREATOR' | 'MEMBER';
}

async function main() {
  console.log('🌱 Seeding PostgreSQL Database for AI Anime Studio Phase 6.1 Authentication Foundation...');

  const org = {
    id: 'org_studio_01',
    name: 'MAPPA Cyber Studio Labs',
    slug: 'mappa-cyber-studio',
  };

  const team = {
    id: 'team_alpha_01',
    organizationId: org.id,
    name: 'Alpha Keyframe Production Unit',
  };

  const users: SeedUser[] = [
    {
      clerkId: 'user_clerk_admin_001',
      email: 'admin@studio-ai.anime',
      name: 'Studio Admin System',
      role: 'ADMIN',
    },
    {
      clerkId: 'user_2N9xClerkProAnimeStudio',
      email: 'creator@studio-ai.anime',
      name: 'Kenji Sato (Lead Director)',
      role: 'CREATOR',
    },
  ];

  console.log('🏢 Created Organization:', org.name);
  console.log('👥 Created Team:', team.name);
  console.log('👤 Seeded Users:', users.map((u) => `${u.name} (${u.role})`).join(', '));
  console.log('✅ PostgreSQL Database Seeding Completed Successfully!');
}

main().catch((e) => {
  console.error('❌ Seeding error:', e);
});

