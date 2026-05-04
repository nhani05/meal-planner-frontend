import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const mealTypeLabels = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa',
  dinner: 'Bữa tối',
  snack: 'Bữa phụ'
};

const MealSlotFrame = ({ mealType, portions = [], onAddClick, onDeletePortion }) => {
  // Tính tổng calo của bữa này
  const totalCalories = portions.reduce((sum, portion) => sum + (portion.calories_kcal || 0), 0);

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 border-b p-3 flex justify-between items-center">
        <h4 className="font-semibold flex items-center gap-2">
          {mealTypeLabels[mealType] || mealType}
          <span className="text-xs font-normal text-muted-foreground bg-slate-200 px-2 py-0.5 rounded-full">
            {Math.round(totalCalories)} kcal
          </span>
        </h4>
        <Button size="sm" variant="outline" onClick={() => onAddClick(mealType)}>
          <Plus className="w-4 h-4 mr-1" /> Thêm món
        </Button>
      </div>
      
      <div className="p-3">
        {portions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-md">
            Chưa có món ăn nào. Hãy thêm món để tính calo!
          </div>
        ) : (
          <ul className="space-y-2">
            {portions.map((portion) => (
              <li key={portion.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md group">
                <div className="flex-1">
                  <p className="font-medium text-sm">{portion.dishName || 'Món ăn'}</p>
                  <p className="text-xs text-muted-foreground">
                    {portion.quantity_g}g • {Math.round(portion.calories_kcal)} kcal
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDeletePortion(portion.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MealSlotFrame;
