import { useState } from 'react';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { useToast } from '../../hooks/use-toast';

const MOCK_PENDING = [
  { id: 10, name: 'Phở bò tái', submittedBy: 'chef_nguyen', calories_kcal: 450, status: 'PENDING', createdAt: '2026-05-04' },
  { id: 11, name: 'Bánh xèo miền Tây', submittedBy: 'cook_tran', calories_kcal: 380, status: 'PENDING', createdAt: '2026-05-04' },
  { id: 12, name: 'Canh chua cá lóc', submittedBy: 'foodie_le', calories_kcal: 210, status: 'PENDING', createdAt: '2026-05-03' },
];

const MOCK_ALL = [
  { id: 1, name: 'Cơm sườn bí đao', submittedBy: 'admin', calories_kcal: 520, status: 'APPROVED', createdAt: '2026-04-10' },
  { id: 2, name: 'Ức gà áp chảo rau xanh', submittedBy: 'healthyfood', calories_kcal: 310, status: 'APPROVED', createdAt: '2026-04-15' },
  { id: 3, name: 'Salad rau củ trứng', submittedBy: 'salad_lover', calories_kcal: 220, status: 'REJECTED', createdAt: '2026-04-18' },
  ...MOCK_PENDING,
];

const statusBadge = (status) => {
  if (status === 'APPROVED') return <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100">Đã duyệt</Badge>;
  if (status === 'REJECTED') return <Badge variant="destructive">Từ chối</Badge>;
  return <Badge className="bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100">Chờ duyệt</Badge>;
};

const AdminDishPage = () => {
  const [pendingDishes, setPendingDishes] = useState(MOCK_PENDING);
  const [allDishes, setAllDishes] = useState(MOCK_ALL);
  const { toast } = useToast();

  const handleApprove = (id) => {
    setPendingDishes(prev => prev.filter(d => d.id !== id));
    setAllDishes(prev => prev.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
    toast({ title: 'Đã phê duyệt món ăn!' });
  };

  const handleReject = (id) => {
    setPendingDishes(prev => prev.filter(d => d.id !== id));
    setAllDishes(prev => prev.map(d => d.id === id ? { ...d, status: 'REJECTED' } : d));
    toast({ variant: 'destructive', title: 'Đã từ chối món ăn.' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa vĩnh viễn món ăn này?')) {
      setAllDishes(prev => prev.filter(d => d.id !== id));
      setPendingDishes(prev => prev.filter(d => d.id !== id));
      toast({ title: 'Đã xóa món ăn' });
    }
  };

  const DishTable = ({ dishes, showActions = false }) => (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Tên món ăn</TableHead>
            <TableHead className="hidden sm:table-cell">Người đăng</TableHead>
            <TableHead className="text-right">Calo</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dishes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Không có món ăn nào.
              </TableCell>
            </TableRow>
          ) : dishes.map((dish) => (
            <TableRow key={dish.id}>
              <TableCell className="font-medium">{dish.name}</TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">@{dish.submittedBy}</TableCell>
              <TableCell className="text-right font-semibold text-primary">{dish.calories_kcal} kcal</TableCell>
              <TableCell>{statusBadge(dish.status)}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{dish.createdAt}</TableCell>
              <TableCell className="text-right">
                {showActions && dish.status === 'PENDING' && (
                  <>
                    <Button variant="ghost" size="icon" title="Phê duyệt" onClick={() => handleApprove(dish.id)}>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Từ chối" onClick={() => handleReject(dish.id)}>
                      <XCircle className="h-4 w-4 text-amber-500" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" title="Xóa" onClick={() => handleDelete(dish.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Món ăn</h1>
        <p className="text-muted-foreground text-sm">Duyệt và quản lý toàn bộ món ăn trong hệ thống.</p>
      </div>

      <div className="bg-white rounded-md border shadow-sm p-4">
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Chờ duyệt
              {pendingDishes.length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {pendingDishes.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">Tất cả ({allDishes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <DishTable dishes={pendingDishes} showActions={true} />
          </TabsContent>
          <TabsContent value="all">
            <DishTable dishes={allDishes} showActions={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDishPage;
