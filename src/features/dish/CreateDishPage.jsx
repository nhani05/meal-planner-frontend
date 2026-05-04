import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '../../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { dishService } from '../../api/dishService';
import { ingredientService } from '../../api/ingredientService';

const dishSchema = z.object({
  name: z.string().min(2, { message: 'Tên món ăn phải có ít nhất 2 ký tự' }),
  categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục' }),
  description: z.string().optional(),
  instructions: z.string().optional(),
});

const CreateDishPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [quantityG, setQuantityG] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(dishSchema),
    defaultValues: { name: '', categoryId: '', description: '', instructions: '' },
  });

  // Tải danh sách nguyên liệu và danh mục từ API
  useEffect(() => {
    ingredientService.getIngredients({ size: 200 })
      .then(data => setAvailableIngredients(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setAvailableIngredients([]));

    dishService.getCategories()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  // Tự động tính tổng dinh dưỡng
  const totals = recipe.reduce(
    (acc, item) => {
      const ratio = item.quantityG / 100;
      const cal  = item.ingredient.calories_kcal ?? item.ingredient.caloriesKcal ?? 0;
      const prot = item.ingredient.protein_g     ?? item.ingredient.proteinG     ?? 0;
      const carb = item.ingredient.carb_g        ?? item.ingredient.carbG        ?? 0;
      const fat  = item.ingredient.fat_g         ?? item.ingredient.fatG         ?? 0;
      return {
        calories: acc.calories + cal  * ratio,
        protein:  acc.protein  + prot * ratio,
        carb:     acc.carb     + carb * ratio,
        fat:      acc.fat      + fat  * ratio,
      };
    },
    { calories: 0, protein: 0, carb: 0, fat: 0 }
  );

  const handleAddIngredient = () => {
    const ingredient = availableIngredients.find(i => i.id === Number(selectedIngredientId));
    if (!ingredient) return;
    if (recipe.some(r => r.ingredient.id === ingredient.id)) {
      toast({ variant: 'destructive', title: 'Nguyên liệu này đã được thêm rồi!' });
      return;
    }
    setRecipe(prev => [...prev, { ingredient, quantityG: Number(quantityG) }]);
    setSelectedIngredientId('');
    setQuantityG(100);
  };

  const handleUpdateQuantity = (ingredientId, newQty) => {
    setRecipe(prev => prev.map(r =>
      r.ingredient.id === ingredientId ? { ...r, quantityG: Number(newQty) || 0 } : r
    ));
  };

  const handleRemoveIngredient = (ingredientId) => {
    setRecipe(prev => prev.filter(r => r.ingredient.id !== ingredientId));
  };

  const onSubmit = async (values) => {
    if (recipe.length === 0) {
      toast({ variant: 'destructive', title: 'Vui lòng thêm ít nhất 1 nguyên liệu!' });
      return;
    }
    setIsSaving(true);
    const totalWeight = recipe.reduce((acc, r) => acc + r.quantityG, 0);

    try {
      const payload = {
        name: values.name,
        categoryId: Number(values.categoryId),
        imageUrl: '',
        source: 'custom',
        difficulty: 'medium',
        totalTimeMin: 30,
        nutritionInfo: {
          caloriesPer100g: Math.round((totals.calories / totalWeight) * 100),
          proteinPer100g:  Math.round(((totals.protein / totalWeight) * 100) * 10) / 10,
          carbPer100g:     Math.round(((totals.carb / totalWeight) * 100) * 10) / 10,
          fatPer100g:      Math.round(((totals.fat / totalWeight) * 100) * 10) / 10,
        },
        ingredients: recipe.map(r => ({
          name: r.ingredient.name,
          quantityG: r.quantityG
        })),
      };
      await dishService.createDish(payload);
      toast({ title: 'Tạo món ăn thành công!' });
      navigate('/dishes');
    } catch (error) {
      const msg = error.response?.data?.message || 'Không thể tạo món ăn';
      toast({ variant: 'destructive', title: 'Lỗi', description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const availableToAdd = availableIngredients.filter(
    i => !recipe.some(r => r.ingredient.id === i.id)
  );

  return (
    <div className="py-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dishes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tạo Món ăn mới</h1>
          <p className="text-sm text-muted-foreground">Calo được tính tự động dựa trên nguyên liệu bạn chọn.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái: Thông tin */}
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Thông tin món ăn</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên món ăn <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="VD: Cơm sườn bí đao" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                          {/* Fallback nếu BE chưa trả về categories */}
                          {categories.length === 0 && (
                            <>
                              <option value="1">Món chính</option>
                              <option value="2">Món canh</option>
                              <option value="3">Món tráng miệng</option>
                            </>
                          )}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả ngắn</FormLabel>
                      <FormControl><Input placeholder="VD: Món cơm truyền thống thanh đạm" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="instructions" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cách chế biến</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                          placeholder="Hướng dẫn nấu món ăn..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* Tổng dinh dưỡng */}
              <Card className={`border-2 ${recipe.length > 0 ? 'border-primary/30 bg-primary/5' : 'border-dashed'}`}>
                <CardHeader><CardTitle className="text-base">Tổng dinh dưỡng (tự động tính)</CardTitle></CardHeader>
                <CardContent>
                  {recipe.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Thêm nguyên liệu để xem tổng dinh dưỡng</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'kcal', value: Math.round(totals.calories), color: 'text-primary' },
                        { label: 'g Protein', value: totals.protein.toFixed(1), color: 'text-blue-500' },
                        { label: 'g Carb', value: totals.carb.toFixed(1), color: 'text-amber-500' },
                        { label: 'g Fat', value: totals.fat.toFixed(1), color: 'text-rose-500' },
                      ].map(item => (
                        <div key={item.label} className="text-center p-3 bg-white rounded-lg shadow-sm border">
                          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Cột phải: Nguyên liệu */}
            <Card>
              <CardHeader><CardTitle className="text-base">Thành phần nguyên liệu</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <select
                    className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={selectedIngredientId}
                    onChange={(e) => setSelectedIngredientId(e.target.value)}
                  >
                    <option value="">-- Chọn nguyên liệu --</option>
                    {availableToAdd.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                  <Input
                    type="number" min="1" placeholder="Gram"
                    className="w-24 shrink-0" value={quantityG}
                    onChange={(e) => setQuantityG(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleAddIngredient} disabled={!selectedIngredientId} className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {recipe.length === 0 ? (
                  <div className="border-2 border-dashed rounded-md py-10 text-center text-muted-foreground text-sm">
                    Chưa có nguyên liệu nào. Hãy chọn và thêm ở trên!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {recipe.map(({ ingredient, quantityG: qty }) => {
                      const cal = ingredient.calories_kcal ?? ingredient.caloriesKcal ?? 0;
                      return (
                        <div key={ingredient.id} className="flex items-center gap-2 p-2 border rounded-md bg-slate-50">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{ingredient.name}</p>
                            <p className="text-xs text-muted-foreground">≈ {Math.round(cal * qty / 100)} kcal</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Input type="number" min="1" className="w-20 h-8 text-sm" value={qty}
                              onChange={(e) => handleUpdateQuantity(ingredient.id, e.target.value)} />
                            <span className="text-xs text-muted-foreground">g</span>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveIngredient(ingredient.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/dishes')}>Hủy</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Đang lưu...</> : <><Save className="h-4 w-4 mr-2" />Lưu món ăn</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateDishPage;
