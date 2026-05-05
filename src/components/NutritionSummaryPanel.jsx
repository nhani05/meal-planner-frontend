import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

function MacroBar({ label, current, target, unit, colorClass }) {
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {current.toFixed(1)} / {target.toFixed(1)} {unit}
        </span>
      </div>
      <Progress
        value={percent}
        className={cn('h-2', colorClass)}
      />
    </div>
  );
}

export function NutritionSummaryPanel({
  calories,
  protein,
  carb,
  fat,
  targetCalories = 2000,
  targetProtein = 120,
  targetCarb = 250,
  targetFat = 60,
  className,
}) {
  const calPercent = targetCalories > 0
    ? Math.min((calories / targetCalories) * 100, 100)
    : 0;

  const calColor =
    calories < targetCalories * 0.5 || calories > targetCalories * 1.3
      ? 'bg-red-500'
      : calories < targetCalories * 0.8 || calories > targetCalories * 1.1
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <Card className={cn('sticky top-6', className)}>
      <CardHeader>
        <CardTitle className="text-base">Tóm tắt dinh dưỡng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Tổng calo
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(calories)} / {Math.round(targetCalories)} kcal
            </span>
          </div>
          <Progress value={calPercent} className={cn('h-3', calColor)} />
        </div>

        <MacroBar
          label="Protein"
          current={protein}
          target={targetProtein}
          unit="g"
          colorClass="bg-blue-500"
        />
        <MacroBar
          label="Carb"
          current={carb}
          target={targetCarb}
          unit="g"
          colorClass="bg-orange-500"
        />
        <MacroBar
          label="Chất béo"
          current={fat}
          target={targetFat}
          unit="g"
          colorClass="bg-yellow-500"
        />
      </CardContent>
    </Card>
  );
}
