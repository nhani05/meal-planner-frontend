import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Loader2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';
import { useUserStore } from '../../store/userStore';
import { mealService } from '../../api/mealService';
import { ConfirmDialog } from '../../components/ConfirmDialog';

import NutritionSummaryBar from './components/NutritionSummaryBar';
import MealSlotFrame from './components/MealSlotFrame';
import AddDishModal from './components/AddDishModal';

const EMPTY_MEALS = { breakfast: [], lunch: [], dinner: [], snack: [] };

const MealDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { healthGoal } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const data = await mealService.getMealPlanById(id);
        // Chuẩn hoá meals từ array → map { breakfast: [], lunch: [], ... }
        const meals = { ...EMPTY_MEALS };
        if (data.meals && Array.isArray(data.meals)) {
          data.meals.forEach(meal => {
            meals[meal.mealType] = meal.portions || [];
          });
        }
        setMealPlan({ ...data, meals });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Không thể tải kế hoạch bữa ăn' });
        navigate('/meal-plans/manage');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const handleOpenModal = (mealType) => {
    setActiveMealType(mealType);
    setIsModalOpen(true);
  };

  const handleAddDish = async (dishData) => {
    try {
      const portionPayload = { dishId: dishData.dishId, quantityG: dishData.quantity_g };
      const newPortion = await mealService.addPortion(id, activeMealType, portionPayload);
      setMealPlan(prev => ({
        ...prev,
        meals: {
          ...prev.meals,
          [activeMealType]: [...prev.meals[activeMealType], newPortion]
        }
      }));
      toast({ title: 'Đã thêm món ăn' });
    } catch (error) {
      // Fallback: nếu API chưa có, thêm vào local state tạm thời
      const tempPortion = { ...dishData, id: Date.now() };
      setMealPlan(prev => ({
        ...prev,
        meals: {
          ...prev.meals,
          [activeMealType]: [...prev.meals[activeMealType], tempPortion]
        }
      }));
      toast({ title: 'Đã thêm món ăn (chưa đồng bộ server)' });
    }
  };

  const handleDeletePortion = async (mealType, portionId) => {
    try {
      await mealService.deletePortion(id, mealType, portionId);
    } catch (error) {
      console.warn('Delete portion API error, removing locally');
    }
    setMealPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: prev.meals[mealType].filter(p => p.id !== portionId)
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await mealService.updateMealPlan(id, {
        planDate: mealPlan.planDate,
        planName: mealPlan.planName,
      });
      toast({ title: 'Lưu thành công!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Không thể lưu kế hoạch' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    try {
      await mealService.deleteMealPlan(id);
      toast({ title: 'Đã xóa kế hoạch' });
      navigate('/meal-plans/manage');
    } catch {
      toast({ variant: 'destructive', title: 'Không thể xóa kế hoạch' });
    }
  };

  const handleSaveTemplate = () => {
    toast({ title: 'Thông báo', description: 'Tính năng lưu mẫu sẽ được cập nhật sau.' });
  };

  const calculateDailyTotals = () => {
    if (!mealPlan) return { calories: 0, protein: 0, carb: 0, fat: 0 };
    return Object.values(mealPlan.meals).reduce((totals, portions) => {
      portions.forEach(p => {
        totals.calories += p.calories_kcal || p.caloriesKcal || 0;
        totals.protein  += p.protein_g   || p.proteinG   || 0;
        totals.carb     += p.carb_g      || p.carbG      || 0;
        totals.fat      += p.fat_g       || p.fatG       || 0;
      });
      return totals;
    }, { calories: 0, protein: 0, carb: 0, fat: 0 });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/meal-plans/manage')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{mealPlan?.planName || 'Kế hoạch bữa ăn'}</h1>
            <p className="text-muted-foreground">{mealPlan?.planDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveTemplate}>
            <FileText className="h-4 w-4 mr-2" /> Lưu thành Mẫu
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Xóa kế hoạch
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      <NutritionSummaryBar dailyTotals={calculateDailyTotals()} healthGoal={healthGoal} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
          <MealSlotFrame
            key={mealType}
            mealType={mealType}
            portions={mealPlan?.meals[mealType] || []}
            onAddClick={handleOpenModal}
            onDeletePortion={(portionId) => handleDeletePortion(mealType, portionId)}
          />
        ))}
      </div>

      <AddDishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentMealType={activeMealType}
        onAddDish={handleAddDish}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Xác nhận xóa"
        description="Bạn có chắc muốn xóa kế hoạch này? Thao tác này không thể hoàn tác."
        confirmLabel="Xóa"
        variant="danger"
        onConfirm={handleDeletePlan}
      />
    </div>
  );
};

export default MealDetailPage;
