import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import Button from '../ui/Button';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
      <button onClick={onMenuToggle} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
        <Menu size={20} />
      </button>
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
}
