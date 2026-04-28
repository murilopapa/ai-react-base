import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Building2, Mail, MapPin } from 'lucide-react';
import type { User } from '../-users.schema';

type UserCardProps = {
  user: User;
  onClick: (user: User) => void;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-150',
        'hover:ring-primary/50 hover:ring-2',
      )}
      onClick={() => onClick(user)}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{user.name}</CardTitle>
            <p className="text-muted-foreground text-xs truncate">@{user.username}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Mail className="size-3.5 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Building2 className="size-3.5 shrink-0" />
          <span className="truncate">{user.company.name}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <MapPin className="size-3" />
            {user.address.city}
          </Badge>
          <span className="text-muted-foreground text-xs">{user.website}</span>
        </div>
      </CardContent>
    </Card>
  );
}
