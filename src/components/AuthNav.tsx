import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, CalendarCheck, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AuthNavProps {
  variant?: 'desktop' | 'mobile';
  onItemClick?: () => void;
}

export function AuthNav({ variant = 'desktop', onItemClick }: AuthNavProps) {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    if (onItemClick) onItemClick();
  };

  if (loading) {
    return null;
  }

  if (variant === 'mobile') {
    if (user) {
      return (
        <div className="border-t pt-4 mt-4">
          <p className="text-sm font-semibold text-gray-600 mb-3 px-4">Account</p>
          <Link href="/my-bookings" onClick={onItemClick}>
            <Button variant="outline" className="w-full justify-start mb-2" size="lg">
              <CalendarCheck className="w-5 h-5 mr-3" />
              My Bookings
            </Button>
          </Link>
          <Link href="/profile" onClick={onItemClick}>
            <Button variant="outline" className="w-full justify-start mb-2" size="lg">
              <Settings className="w-5 h-5 mr-3" />
              Profile Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            size="lg"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      );
    }

    return (
      <div className="border-t pt-4 mt-4">
        <p className="text-sm font-semibold text-gray-600 mb-3 px-4">Account</p>
        <Link href="/login" onClick={onItemClick}>
          <Button variant="outline" className="w-full justify-start mb-2" size="lg">
            <User className="w-5 h-5 mr-3" />
            Sign In
          </Button>
        </Link>
        <Link href="/register" onClick={onItemClick}>
          <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700" size="lg">
            <User className="w-5 h-5 mr-3" />
            Create Account
          </Button>
        </Link>
      </div>
    );
  }

  // Desktop variant
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium text-white hover:bg-white/30 transition border border-white/30"
          >
            <User className="w-4 h-4" />
            {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/my-bookings" className="cursor-pointer">
              <CalendarCheck className="w-4 h-4 mr-2" />
              My Bookings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-red-600 focus:text-red-600 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/login">
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium text-white hover:bg-white/30 transition border border-white/30"
      >
        <User className="w-4 h-4" />
        Sign In
      </Button>
    </Link>
  );
}
