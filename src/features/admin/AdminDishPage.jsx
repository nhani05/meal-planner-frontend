import { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, Loader2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { useToast } from '../../hooks/use-toast';
import { adminService } from '../../api/adminService';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const AdminDishPage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast } = useToast();

  const fetchDishes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 20 };
      if (searchTerm) params.keyword = searchTerm;
      const data = await adminService.getAllDishesAdmin(params);
      const content = data?.content || data || [];
      setDishes(Array.isArray(content) ? content : []);
      setTotalPages(data?.totalPages || 1);
    } catch {
      toast({ variant: 'destructive', title: 'Không thể tải danh sách món ăn' });
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, toast]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteDishAdmin(deleteTarget.id);
      toast({ title: 'Đã xóa món ăn' });
      setDeleteTarget(null);
      fetchDishes();
    } catch {
      toast({ variant: 'destructive', title: 'Không thể xóa món ăn' });
    }
  };

  const sourceBadge = (source) => {
    if (source === 'system') return <Badge variant="outline" className="border-blue-300 text-blue-600">Hệ thống</Badge>;
    return <Badge variant="secondary">Tùy chỉnh</Badge>;
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Món ăn</h1>
        <p className="text-muted-foreground text-sm">Duyệt và quản lý toàn bộ món ăn trong hệ thống.</p>
      </div>

      <div className="bg-white rounded-md border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <form
            onSubmit={(e) => { e.preventDefault(); setPage(0); fetchDishes(); }}
            className="relative flex-1 max-w-sm"
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm món ăn..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Tên món ăn</TableHead>
                <TableHead className="hidden sm:table-cell">Nguồn</TableHead>
                <TableHead className="text-right">Calo</TableHead>
                <TableHead className="hidden md:table-cell">Người tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : dishes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Không có món ăn nào.
                  </TableCell>
                </TableRow>
              ) : (
                dishes.map((dish) => (
                  <TableRow key={dish.id}>
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{sourceBadge(dish.source)}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {dish.nutritionInfo?.caloriesPer100g ?? dish.nutritionInfo?.caloriesKcal ?? 0} kcal/100g
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      @{dish.submittedBy || dish.accountId || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(dish)}>
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
            <Button variant="outline" size="sm" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>Trước</Button>
            <span className="text-sm text-muted-foreground">Trang {page + 1} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Sau</Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa món ăn "${deleteTarget?.name}"?`}
        confirmLabel="Xóa"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminDishPage;
