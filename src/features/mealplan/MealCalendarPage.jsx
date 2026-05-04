import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, subWeeks, addWeeks } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { mealService } from '../../api/mealService';

const MealCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  useEffect(() => {
    const fetchMealPlans = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setMealPlans({});
        return;
      }
      setIsLoading(true);
      try {
        const data = await mealService.getMealPlans(userId);
        // Chuẩn hoá data thành map: { 'yyyy-MM-dd': planObject }
        const planMap = {};
        (Array.isArray(data) ? data : data?.content || []).forEach(plan => {
          planMap[plan.planDate] = plan;
        });
        setMealPlans(planMap);
      } catch (error) {
        console.error('Failed to fetch meal plans:', error);
        setMealPlans({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchMealPlans();
  }, [currentDate]);

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Lịch tuần của bạn</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>Hôm nay</Button>
          <div className="flex items-center bg-white border rounded-md">
            <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="rounded-none border-r">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 font-medium text-sm">
              Tháng {format(startDate, 'MM/yyyy', { locale: vi })}
            </span>
            <Button variant="ghost" size="icon" onClick={handleNextWeek} className="rounded-none border-l">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => navigate('/meal-plans/new')} className="ml-2">
            <Plus className="h-4 w-4 mr-2" /> Tạo kế hoạch
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
            const plan = mealPlans[dateStr];

            return (
              <Card
                key={dateStr}
                className={`min-h-[200px] flex flex-col transition-all hover:border-primary/50 cursor-pointer ${isToday ? 'border-primary shadow-md ring-1 ring-primary/20' : ''}`}
                onClick={() => plan ? navigate(`/meal-plans/${plan.id}`) : navigate(`/meal-plans/new?date=${dateStr}`)}
              >
                <CardHeader className={`p-4 border-b pb-3 ${isToday ? 'bg-primary/5' : 'bg-slate-50'}`}>
                  <CardTitle className="text-center flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground uppercase">
                      {format(day, 'EEEE', { locale: vi })}
                    </span>
                    <span className={`text-2xl font-bold ${isToday ? 'text-primary' : 'text-slate-700'}`}>
                      {format(day, 'dd')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col items-center justify-center">
                  {plan ? (
                    <div className="text-center w-full">
                      <div className="mb-2">
                        <span className={`text-xl font-bold ${plan.totalCaloriesKcal > plan.targetCaloriesKcal ? 'text-destructive' : 'text-primary'}`}>
                          {Math.round(plan.totalCaloriesKcal || 0)}
                        </span>
                        <span className="text-muted-foreground text-sm"> / {plan.targetCaloriesKcal || 2000} kcal</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${plan.totalCaloriesKcal > plan.targetCaloriesKcal ? 'bg-destructive' : 'bg-primary'}`}
                          style={{ width: `${Math.min(((plan.totalCaloriesKcal || 0) / (plan.targetCaloriesKcal || 2000)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">Đã lên thực đơn</span>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground opacity-50 flex flex-col items-center">
                      <Plus className="h-8 w-8 mb-2 stroke-1" />
                      <span className="text-sm">Trống</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MealCalendarPage;
