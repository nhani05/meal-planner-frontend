import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { useUserStore } from '../../store/userStore';
import { mealService } from '../../api/mealService';

import NutritionSummaryBar from './components/NutritionSummaryBar';
import MealSlotFrame from './components/MealSlotFrame';
import AddDishModal from './components/AddDishModal';

const EMPTY_MEALS = { breakfast: [], lunch: [], dinner: [], snack: [] };

const CreateMealPlanPage = () => {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const [planDate, setPlanDate] = useState(dateParam || format(new Date(), 'yyyy-MM-dd'));
  const [planName, setPlanName] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState(null);
  const [meals, setMeals] = useState({ ...EMPTY_MEALS });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { healthGoal } = useUserStore();

  useEffect(() => {
    mealService.getTemplates()
      .then(data => setTemplates(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setTemplates([]));
  }, []);

  const handleOpenModal = (mealType) => {
    setActiveMealType(mealType);
    setIsModalOpen(true);
  };

  const handleAddDish = (dishData) => {
    const tempPortion = { 
      ...dishData, 
      id: Date.now(),
      dishName: dishData.name || dishData.dishName,
      calories_kcal: dishData.calories_kcal || dishData.caloriesKcal || 0,
      protein_g: dishData.protein_g || dishData.proteinG || 0,
      carb_g: dishData.carb_g || dishData.carbG || 0,
      fat_g: dishData.fat_g || dishData.fatG || 0
    };
    setMeals(prev => ({
      ...prev,
      [activeMealType]: [...prev[activeMealType], tempPortion]
    }));
    toast({ title: 'Đã thêm món ăn tạm thời' });
  };

  const handleDeletePortion = (mealType, portionId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(p => p.id !== portionId)
    }));
  };

  const handleUpdatePortion = (mealType, portionId, newQty) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].map(p => {
        if (p.id !== portionId) return p;
        const oldQty = p.quantity_g || p.quantityG || 100;
        const ratio = newQty / oldQty;
        return {
          ...p,
          quantity_g: newQty,
          quantityG: newQty,
          calories_kcal: Math.round((p.calories_kcal || 0) * ratio),
          protein_g: Math.round((p.protein_g || 0) * ratio * 10) / 10,
          carb_g: Math.round((p.carb_g || 0) * ratio * 10) / 10,
          fat_g: Math.round((p.fat_g || 0) * ratio * 10) / 10,
        };
      })
    }));
  };

  const calculateDailyTotals = () => {
    return Object.values(meals).reduce((totals, portions) => {
      portions.forEach(p => {
        totals.calories += p.calories_kcal || 0;
        totals.protein  += p.protein_g  || 0;
        totals.carb     += p.carb_g     || 0;
        totals.fat      += p.fat_g      || 0;
      });
      return totals;
    }, { calories: 0, protein: 0, carb: 0, fat: 0 });
  };

  const handleCreate = async () => {
    if (!planDate) {
      toast({ variant: 'destructive', title: 'Vui lòng chọn ngày áp dụng' });
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        planDate,
        planName: planName || `Thực đơn ngày ${planDate}`,
        meals: Object.entries(meals).map(([type, portions]) => ({
          mealType: type,
          portions: portions.map(p => ({
            dishId: p.dishId || p.id,
            quantityG: p.quantity_g || p.quantityG
          }))
        }))
      };
      // accountId sẽ tự lấy từ localStorage bên trong mealService
      const created = await mealService.createMealPlan(payload);
      toast({ title: 'Tạo kế hoạch thành công!', description: 'Bạn có thể bắt đầu thêm món ăn.' });
      navigate(`/meal-plans/${created.id}`);
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra. Có thể ngày này đã có kế hoạch rồi!';
      toast({ variant: 'destructive', title: 'Tạo thất bại', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/meal-plans/manage')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Tạo kế hoạch bữa ăn mới</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Thông tin kế hoạch</CardTitle>
          <CardDescription>Thiết lập ngày và tên cho thực đơn của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="planDate">Ngày áp dụng <span className="text-destructive">*</span></Label>
              <Input
                id="planDate"
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planName">Tên kế hoạch (Tuỳ chọn)</Label>
              <Input
                id="planName"
                placeholder="VD: Thực đơn siết cơ tuần 1"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <NutritionSummaryBar dailyTotals={calculateDailyTotals()} healthGoal={healthGoal} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
          <MealSlotFrame
            key={mealType}
            mealType={mealType}
            portions={meals[mealType]}
            onAddClick={handleOpenModal}
            onDeletePortion={(portionId) => handleDeletePortion(mealType, portionId)}
            onUpdatePortion={(portionId, qty) => handleUpdatePortion(mealType, portionId, qty)}
          />
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={() => navigate('/meal-plans/manage')}>Hủy</Button>
        <Button onClick={handleCreate} disabled={isLoading}>
          {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang tạo...</> : 'Lưu kế hoạch bữa ăn'}
        </Button>
      </div>

      <AddDishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentMealType={activeMealType}
        onAddDish={handleAddDish}
      />
    </div>
  );
};

export default CreateMealPlanPage;
