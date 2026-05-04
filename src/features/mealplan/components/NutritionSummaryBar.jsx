import { Progress } from '../../../components/ui/progress';

const NutritionSummaryBar = ({ dailyTotals = {}, healthGoal }) => {
  const {
    calories = 0,
    protein = 0,
    carb = 0,
    fat = 0
  } = dailyTotals;

  // Nếu chưa có healthGoal, ta dùng giá trị mặc định làm mẫu (2000 kcal)
  const targetCalories = healthGoal?.daily_calories_kcal || 2000;
  
  // Ước tính Macro target cơ bản nếu không có (ví dụ 30% Protein, 40% Carb, 30% Fat)
  const targetProtein = healthGoal?.protein_g_day || (targetCalories * 0.3) / 4;
  const targetCarb = healthGoal?.carb_g_day || (targetCalories * 0.4) / 4;
  const targetFat = healthGoal?.fat_g_day || (targetCalories * 0.3) / 9;

  const getProgress = (current, target) => {
    const percent = (current / target) * 100;
    return percent > 100 ? 100 : percent;
  };

  const isOver = (current, target) => current > target;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <h3 className="font-semibold text-lg mb-4">Tổng quan dinh dưỡng trong ngày</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Calories */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Calo (kcal)</span>
            <span className={isOver(calories, targetCalories) ? "text-destructive font-bold" : "text-muted-foreground"}>
              {Math.round(calories)} / {targetCalories}
            </span>
          </div>
          <Progress 
            value={getProgress(calories, targetCalories)} 
            className={`h-2 ${isOver(calories, targetCalories) ? "bg-destructive/20" : ""}`}
            // Shadcn progress không hỗ trợ đổi màu fill trực tiếp dễ dàng qua class, 
            // Ta có thể tuỳ chỉnh CSS của .bg-primary bên trong Progress component nếu cần
          />
        </div>

        {/* Protein */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Protein (g)</span>
            <span className="text-muted-foreground">{Math.round(protein)} / {Math.round(targetProtein)}</span>
          </div>
          <Progress value={getProgress(protein, targetProtein)} className="h-2 [&>div]:bg-blue-500" />
        </div>

        {/* Carb */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Carb (g)</span>
            <span className="text-muted-foreground">{Math.round(carb)} / {Math.round(targetCarb)}</span>
          </div>
          <Progress value={getProgress(carb, targetCarb)} className="h-2 [&>div]:bg-amber-500" />
        </div>

        {/* Fat */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Fat (g)</span>
            <span className="text-muted-foreground">{Math.round(fat)} / {Math.round(targetFat)}</span>
          </div>
          <Progress value={getProgress(fat, targetFat)} className="h-2 [&>div]:bg-rose-500" />
        </div>
      </div>
    </div>
  );
};

export default NutritionSummaryBar;
