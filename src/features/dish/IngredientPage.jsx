import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { useToast } from '../../hooks/use-toast';
import { ingredientService } from '../../api/ingredientService';
import IngredientModal from './components/IngredientModal';

const IngredientPage = () => {
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  const fetchIngredients = async () => {
    setIsLoading(true);
    try {
      const data = await ingredientService.getIngredients({ search: searchTerm });
      setIngredients(Array.isArray(data) ? data : data?.content || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Không thể tải danh sách nguyên liệu' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIngredients();
  };

  const handleOpenModal = (ingredient = null) => {
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleSaveIngredient = async (values, id) => {
    try {
      if (id) {
        await ingredientService.updateIngredient(id, values);
        toast({ title: 'Cập nhật thành công' });
      } else {
        await ingredientService.createIngredient(values);
        toast({ title: 'Thêm mới thành công' });
      }
      fetchIngredients();
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra';
      toast({ variant: 'destructive', title: 'Lỗi', description: msg });
      throw error; // Re-throw để modal biết mà không đóng
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa nguyên liệu "${name}"?`)) return;
    try {
      await ingredientService.deleteIngredient(id);
      toast({ title: 'Đã xóa nguyên liệu' });
      fetchIngredients();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Không thể xóa nguyên liệu này' });
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Nguyên liệu</h1>
          <p className="text-muted-foreground text-sm">Danh sách các nguyên liệu tính trên 100g.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" /> Thêm nguyên liệu
        </Button>
      </div>

      <div className="bg-white rounded-md border shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nguyên liệu..."
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
                <TableHead>Tên nguyên liệu</TableHead>
                <TableHead className="text-right">Calo (kcal)</TableHead>
                <TableHead className="text-right">Protein (g)</TableHead>
                <TableHead className="text-right">Carb (g)</TableHead>
                <TableHead className="text-right">Fat (g)</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : ingredients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Chưa có nguyên liệu nào. Hãy thêm mới!
                  </TableCell>
                </TableRow>
              ) : (
                ingredients.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.calories_kcal ?? item.caloriesKcal}</TableCell>
                    <TableCell className="text-right text-blue-600">{item.protein_g ?? item.proteinG}</TableCell>
                    <TableCell className="text-right text-amber-600">{item.carb_g ?? item.carbG}</TableCell>
                    <TableCell className="text-right text-rose-600">{item.fat_g ?? item.fatG}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}>
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.name)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {isModalOpen && (
        <IngredientModal
          isOpen={isModalOpen}
          onClose={() => { setEditingIngredient(null); setIsModalOpen(false); }}
          initialData={editingIngredient}
          onSave={handleSaveIngredient}
        />
      )}
    </div>
  );
};

export default IngredientPage;
