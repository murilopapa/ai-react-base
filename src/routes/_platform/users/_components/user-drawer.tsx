import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Building2, Globe, Mail, MapPin, Phone, X } from 'lucide-react';
import type { User } from '../-users.schema';
import { UserAlbumsTab } from './user-albums-tab';
import { UserPostsTab } from './user-posts-tab';

type UserDrawerProps = {
  user: User | null;
  open: boolean;
  onClose: () => void;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function UserDrawer({ user, open, onClose }: UserDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()} direction="right">
      <DrawerContent className="flex flex-col h-full overflow-hidden bg-card border-border w-full sm:max-w-md">
        <DrawerHeader className="border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DrawerTitle className="text-base font-semibold">{user.name}</DrawerTitle>
                  <p className="text-muted-foreground text-sm">@{user.username}</p>
                </div>
              </div>
            )}
            <DrawerClose className="rounded-md p-1 hover:bg-muted transition-colors shrink-0 mt-0.5">
              <X className="size-4 text-muted-foreground" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        {user && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Contact info */}
            <div className="flex flex-col gap-3 p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="size-4 shrink-0" />
                <span>{user.website}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="size-4 shrink-0" />
                <span>{user.company.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {user.address.city}, {user.address.zipcode}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs italic">
                "{user.company.catchPhrase}"
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="posts" className="flex flex-col flex-1 overflow-hidden">
              <TabsList className="w-full rounded-none border-b border-border shrink-0 bg-transparent h-10">
                <TabsTrigger value="posts" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
                  Posts
                </TabsTrigger>
                <TabsTrigger value="albums" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
                  Albums
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="flex-1 overflow-y-auto mt-0">
                <UserPostsTab userId={user.id} />
              </TabsContent>

              <TabsContent value="albums" className="flex-1 overflow-y-auto mt-0">
                <UserAlbumsTab userId={user.id} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
