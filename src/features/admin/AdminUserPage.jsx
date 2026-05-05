import { useEffect, useState, useCallback } from 'react';
import { Search, ShieldOff, Shield, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { useToast } from '../../hooks/use-toast';
import { adminService } from '../../api/adminService';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { SkeletonTable } from '../../components/SkeletonCard';

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 20 };
      if (searchTerm) params.keyword = searchTerm;
      const data = await adminService.getAllUsers(params);
      const content = data?.content || data || [];
      setUsers(Array.isArray(content) ? content : []);
      setTotalPages(data?.totalPages || 1);
    } catch {
      toast({ variant: 'destructive', title: 'Không thể tải danh sách người dùng' });
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    try {
      if (user.status === 'active') {
        await adminService.lockUser(user.id);
        toast({ title: `Đã khóa tài khoản @${user.username}` });
      } else {
        await adminService.unlockUser(user.id);
        toast({ title: `Đã mở khóa tài khoản @${user.username}` });
      }
      fetchUsers();
    } catch {
      toast({ variant: 'destructive', title: 'Thao tác thất bại' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteUser(deleteTarget.id);
      toast({ title: 'Đã xóa tài khoản' });
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      toast({ variant: 'destructive', title: 'Không thể xóa tài khoản' });
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>
        <p className="text-muted-foreground text-sm">Quản lý toàn bộ tài khoản người dùng trong hệ thống.</p>
      </div>

      <div className="bg-white rounded-md border shadow-sm p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); setPage(0); fetchUsers(); }}
          className="relative max-w-sm mb-4"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>ID</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24">
                    <SkeletonTable rows={5} cols={6} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Không có người dùng nào.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-muted-foreground text-sm">{user.id}</TableCell>
                    <TableCell className="font-medium">@{user.username}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === 'active' ? 'outline' : 'destructive'}
                        className={user.status === 'active' ? 'border-green-500 text-green-600' : ''}
                      >
                        {user.status === 'active' ? 'Hoạt động' : user.status === 'locked' ? 'Bị khóa' : 'Đã xóa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                        onClick={() => handleToggleStatus(user)}
                        disabled={user.role === 'admin'}
                      >
                        {user.status === 'active'
                          ? <ShieldOff className="h-4 w-4 text-amber-500" />
                          : <Shield className="h-4 w-4 text-green-500" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(user)}
                        disabled={user.role === 'admin'}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa tài khoản @${deleteTarget?.username}? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminUserPage;
