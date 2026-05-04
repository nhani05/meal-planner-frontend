import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ChefHat, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { useToast } from '../../hooks/use-toast';
import { dishService } from '../../api/dishService';

const DishPage = () => {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchDishes = async (keyword = '') => {
    setIsLoading(true);
    try {
      const data = await dishService.getDishes({ keyword, size: 50 });
      setDishes(Array.isArray(data) ? data : data?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Không thể tải danh sách món ăn' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDishes(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDishes(searchTerm);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa món "${name}"?`)) return;
    try {
      await dishService.deleteDish(id);
      toast({ title: 'Đã xóa món ăn' });
      fetchDishes(searchTerm);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Không thể xóa món ăn này' });
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Món ăn</h1>
          <p className="text-muted-foreground text-sm">Danh sách món ăn kèm thông tin dinh dưỡng.</p>
        </div>
        <Button onClick={() => navigate('/dishes/new')}>
          <Plus className="w-4 h-4 mr-2" /> Thêm món ăn
        </Button>
      </div>

      <div className="bg-white rounded-md border shadow-sm p-4">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm món ăn..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">Tìm</Button>
        </form>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Tên món ăn</TableHead>
                <TableHead className="hidden md:table-cell">Mô tả</TableHead>
                <TableHead className="text-right">Calo (kcal)</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Protein (g)</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Carb (g)</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Fat (g)</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : dishes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Chưa có món ăn nào. Hãy thêm mới!
                  </TableCell>
                </TableRow>
              ) : (
                dishes.map((dish) => {
                  const cal  = dish.nutritionInfo?.caloriesKcal  ?? dish.calories_kcal  ?? 0;
                  const prot = dish.nutritionInfo?.proteinG       ?? dish.protein_g       ?? 0;
                  const carb = dish.nutritionInfo?.carbG          ?? dish.carb_g          ?? 0;
                  const fat  = dish.nutritionInfo?.fatG           ?? dish.fat_g           ?? 0;
                  return (
                    <TableRow key={dish.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ChefHat className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium">{dish.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-xs truncate">
                        {dish.description}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">{cal}</TableCell>
                      <TableCell className="text-right text-blue-600 hidden sm:table-cell">{prot}</TableCell>
                      <TableCell className="text-right text-amber-600 hidden sm:table-cell">{carb}</TableCell>
                      <TableCell className="text-right text-rose-600 hidden sm:table-cell">{fat}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/dishes/${dish.id}/edit`)}>
                          <Edit className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(dish.id, dish.name)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DishPage;
