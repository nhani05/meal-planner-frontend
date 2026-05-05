import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Loader2 } from 'lucide-react';
import { dishService } from '../../../api/dishService';

const EMPTY_DISH = {
  name: '',
  description: '',
  categoryId: '',
  difficulty: 'EASY',
  totalTimeMin: '',
  imageUrl: '',
  nutritionInfo: {
    caloriesPer100g: '',
    proteinPer100g: '',
    carbPer100g: '',
    fatPer100g: '',
  },
};

const DIFFICULTIES = [
  { value: 'EASY', label: 'Dễ' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HARD', label: 'Khó' },
];

export default function AdminDishModal({ isOpen, onClose, dish, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_DISH });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(dish ? { ...EMPTY_DISH, ...dish, nutritionInfo: { ...EMPTY_DISH.nutritionInfo, ...(dish?.nutritionInfo || {}) } } : { ...EMPTY_DISH });
      dishService.getCategories()
        .then((data) => setCategories(Array.isArray(data) ? data : []))
        .catch(() => setCategories([]));
    }
  }, [isOpen, dish]);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setNutrition = (field, value) => {
    setForm((prev) => ({
      ...prev,
      nutritionInfo: { ...prev.nutritionInfo, [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.categoryId) return;
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        totalTimeMin: Number(form.totalTimeMin) || 0,
        nutritionInfo: {
          caloriesPer100g: Number(form.nutritionInfo.caloriesPer100g) || 0,
          proteinPer100g: Number(form.nutritionInfo.proteinPer100g) || 0,
          carbPer100g: Number(form.nutritionInfo.carbPer100g) || 0,
          fatPer100g: Number(form.nutritionInfo.fatPer100g) || 0,
        },
      };
      await onSaved(payload, dish?.id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dish ? 'Sửa món ăn hệ thống' : 'Thêm món ăn hệ thống'}</DialogTitle>
          <DialogDescription>
            Nhập thông tin món ăn để thêm vào hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dishName">Tên món ăn *</Label>
            <Input
              id="dishName"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="VD: Phở bò"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dishDesc">Mô tả</Label>
            <Input
              id="dishDesc"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Mô tả ngắn..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Danh mục *</Label>
              <Select value={String(form.categoryId)} onValueChange={(v) => setField('categoryId', Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Độ khó</Label>
              <Select value={form.difficulty} onValueChange={(v) => setField('difficulty', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalTime">Thời gian (phút)</Label>
            <Input
              id="totalTime"
              type="number"
              value={form.totalTimeMin}
              onChange={(e) => setField('totalTimeMin', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL hình ảnh</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => setField('imageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="border rounded-lg p-3 space-y-3">
            <h4 className="text-sm font-semibold">Dinh dưỡng / 100g</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Calo (kcal)</Label>
                <Input
                  type="number"
                  value={form.nutritionInfo.caloriesPer100g}
                  onChange={(e) => setNutrition('caloriesPer100g', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Protein (g)</Label>
                <Input
                  type="number"
                  value={form.nutritionInfo.proteinPer100g}
                  onChange={(e) => setNutrition('proteinPer100g', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Carb (g)</Label>
                <Input
                  type="number"
                  value={form.nutritionInfo.carbPer100g}
                  onChange={(e) => setNutrition('carbPer100g', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Chất béo (g)</Label>
                <Input
                  type="number"
                  value={form.nutritionInfo.fatPer100g}
                  onChange={(e) => setNutrition('fatPer100g', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={!form.name.trim() || !form.categoryId || isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {dish ? 'Cập nhật' : 'Thêm món'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
