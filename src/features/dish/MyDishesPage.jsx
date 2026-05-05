import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dishService } from '@/api/dishService';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Plus, Pencil, Trash2, ChefHat } from 'lucide-react';

export default function MyDishesPage() {
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await dishService.getDishes();
      // Filter custom dishes for this user (FE-side filter since BE returns all)
      const mine = (data || []).filter((d) => d.source === 'custom');
      setDishes(mine);
    } catch {
      toast({ title: 'Lỗi', description: 'Không thể tải danh sách món ăn.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await dishService.deleteDish(deleteId);
      setDishes((prev) => prev.filter((d) => d.id !== deleteId));
      toast({ title: 'Thành công', description: 'Đã xóa món ăn.' });
    } catch {
      toast({ title: 'Lỗi', description: 'Không thể xóa món ăn.', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Đang tải...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Món ăn của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý các món ăn bạn đã tạo.
          </p>
        </div>
        <Button asChild>
          <Link to="/dishes/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm món ăn mới
          </Link>
        </Button>
      </div>

      {dishes.length === 0 ? (
        <EmptyState
          title="Chưa có món ăn nào"
          description="Bạn chưa tạo món ăn tùy chỉnh nào. Hãy thêm món mới!"
          actionLabel="Thêm món ăn"
          onAction={() => navigate('/dishes/new')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <Card key={dish.id}>
              <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                {dish.imageUrl ? (
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ChefHat className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{dish.name}</CardTitle>
                <Badge variant="secondary">Tùy chỉnh</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dishes/${dish.id}/edit`)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(dish.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xác nhận xóa"
        description="Bạn có chắc muốn xóa món ăn này? Thao tác không thể hoàn tác."
        confirmLabel="Xóa"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
