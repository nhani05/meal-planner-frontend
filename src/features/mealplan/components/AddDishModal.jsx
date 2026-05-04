import { Search, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { useState, useEffect } from 'react';
import { dishService } from '../../../api/dishService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

const AddDishModal = ({ isOpen, onClose, onAddDish, currentMealType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchDishes = async () => {
      setIsLoading(true);
      try {
        const data = await dishService.getDishes({ keyword: searchTerm });
        setDishes(Array.isArray(data) ? data : data?.content || []);
      } catch (error) {
        console.error('Failed to fetch dishes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchDishes, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  const handleAdd = () => {
    if (!selectedDish) return;

    // Tính toán dinh dưỡng dựa trên nutritionInfo
    const info = selectedDish.nutritionInfo || {};
    const ratio = quantity / 100;

    onAddDish({
      dishId: selectedDish.id,
      dishName: selectedDish.name,
      quantity_g: Number(quantity),
      calories_kcal: (info.caloriesPer100g || info.caloriesKcal || 0) * ratio,
      protein_g: (info.proteinPer100g || info.proteinG || 0) * ratio,
      carb_g: (info.carbPer100g || info.carbG || 0) * ratio,
      fat_g: (info.fatPer100g || info.fatG || 0) * ratio
    });

    // Reset và đóng modal
    setSelectedDish(null);
    setSearchTerm('');
    setQuantity(100);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
          <DialogDescription>
            Tìm kiếm và thêm món ăn vào {currentMealType === 'breakfast' ? 'Bữa sáng' : currentMealType === 'lunch' ? 'Bữa trưa' : currentMealType === 'dinner' ? 'Bữa tối' : 'Bữa phụ'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tên món ăn..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="h-48 overflow-y-auto border rounded-md p-2 space-y-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : dishes.length > 0 ? (
              dishes.map(dish => {
                const cal = dish.nutritionInfo?.caloriesPer100g || dish.nutritionInfo?.caloriesKcal || 0;
                return (
                  <div
                    key={dish.id}
                    className={`p-2 rounded cursor-pointer text-sm flex justify-between ${selectedDish?.id === dish.id ? 'bg-primary text-primary-foreground' : 'hover:bg-slate-100'
                      }`}
                    onClick={() => setSelectedDish(dish)}
                  >
                    <span>{dish.name}</span>
                    <span className={selectedDish?.id === dish.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                      {Math.round(cal)} kcal/100g
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-muted-foreground p-4">
                Không tìm thấy món ăn nào.
              </div>
            )}
          </div>

          {selectedDish && (
            <div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
              <Label htmlFor="quantity" className="text-right">
                Định lượng (g)
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  ≈ {Math.round(((selectedDish.nutritionInfo?.caloriesPer100g || selectedDish.nutritionInfo?.caloriesKcal || 0) * quantity) / 100)} kcal
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleAdd} disabled={!selectedDish || quantity <= 0}>Thêm vào thực đơn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDishModal;
