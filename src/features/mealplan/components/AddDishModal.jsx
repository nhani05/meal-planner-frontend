import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
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

  // MOCK DATA - Sau này sẽ thay bằng gọi API tìm kiếm
  const mockDishes = [
    { id: 1, name: 'Cơm trắng', caloriesPer100g: 130 },
    { id: 2, name: 'Thịt bò xào', caloriesPer100g: 250 },
    { id: 3, name: 'Canh rau ngót', caloriesPer100g: 30 },
    { id: 4, name: 'Ức gà luộc', caloriesPer100g: 165 },
  ];

  const searchResults = mockDishes.filter(dish => 
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!selectedDish) return;
    
    // Tính toán calo giả định
    const calculatedCalories = (selectedDish.caloriesPer100g * quantity) / 100;
    
    onAddDish({
      dishId: selectedDish.id,
      dishName: selectedDish.name,
      quantity_g: Number(quantity),
      calories_kcal: calculatedCalories
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
            {searchResults.length > 0 ? (
              searchResults.map(dish => (
                <div 
                  key={dish.id}
                  className={`p-2 rounded cursor-pointer text-sm flex justify-between ${
                    selectedDish?.id === dish.id ? 'bg-primary text-primary-foreground' : 'hover:bg-slate-100'
                  }`}
                  onClick={() => setSelectedDish(dish)}
                >
                  <span>{dish.name}</span>
                  <span className={selectedDish?.id === dish.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                    {dish.caloriesPer100g} kcal/100g
                  </span>
                </div>
              ))
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
                  ≈ {Math.round((selectedDish.caloriesPer100g * quantity) / 100)} kcal
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
