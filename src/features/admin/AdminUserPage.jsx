import { useState } from 'react';
import { Search, ShieldOff, Shield, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { useToast } from '../../hooks/use-toast';

const MOCK_USERS = [
  { id: 1, username: 'nguyen_van_a', email: 'nva@mail.com', role: 'USER', isActive: true, createdAt: '2026-01-15' },
  { id: 2, username: 'tran_thi_b',   email: 'ttb@mail.com', role: 'USER', isActive: true, createdAt: '2026-02-20' },
  { id: 3, username: 'le_van_c',     email: 'lvc@mail.com', role: 'USER', isActive: false, createdAt: '2026-03-10' },
  { id: 4, username: 'admin_main',   email: 'admin@nutriplan.vn', role: 'ADMIN', isActive: true, createdAt: '2025-12-01' },
];

const AdminUserPage = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: user.isActive ? 'Đã vô hiệu hóa tài khoản' : 'Đã kích hoạt tài khoản',
      description: `Tài khoản @${user.username} đã được cập nhật.`,
    });
  };

  const handleDelete = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user.role === 'ADMIN') {
      toast({ variant: 'destructive', title: 'Không thể xóa tài khoản Admin!' });
      return;
    }
    if (window.confirm(`Xóa tài khoản @${user.username}? Hành động này không thể hoàn tác.`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: 'Đã xóa tài khoản' });
    }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>
        <p className="text-muted-foreground text-sm">Quản lý toàn bộ tài khoản người dùng trong hệ thống.</p>
      </div>

      <div className="bg-white rounded-md border shadow-sm p-4">
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="hidden sm:table-cell">Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">@{user.username}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'outline' : 'destructive'} className={user.isActive ? 'border-green-500 text-green-600' : ''}>
                      {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {user.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.isActive
                        ? <ShieldOff className="h-4 w-4 text-amber-500" />
                        : <Shield className="h-4 w-4 text-green-500" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === 'ADMIN'}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;
