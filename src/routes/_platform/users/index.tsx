import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';
import { createFileRoute } from '@tanstack/react-router';
import { Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from './-users.controller';
import type { User } from './-users.schema';
import { UserCard } from './_components/user-card';
import { UserDrawer } from './_components/user-drawer';

export const Route = createFileRoute('/_platform/users/')({
  component: UsersPage,
});

function UsersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useSetPlatformHeader({ title: t('screens.users.title') });

  const { data: users, isLoading, isError } = useUsers();

  const filtered = users?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  ) ?? [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {!isLoading && users && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0">
            <Users className="size-4" />
            <span>{filtered.length} {t('screens.users.count')}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {isError && (
        <p className="text-destructive text-sm">{t('common.error')}</p>
      )}

      {/* Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))
          : filtered.map((user) => (
              <UserCard key={user.id} user={user} onClick={setSelectedUser} />
            ))}
      </div>

      {!isLoading && filtered.length === 0 && !isError && (
        <p className="text-muted-foreground text-sm text-center py-12">
          {t('common.no_results')}
        </p>
      )}

      <UserDrawer
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
