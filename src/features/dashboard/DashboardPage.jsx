import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/api/userService';
import { mealService } from '@/api/mealService';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { SkeletonGrid, SkeletonCard } from '@/components/SkeletonCard';

export default function DashboardPage() {
  const { userId } = useAuthStore();
  const [healthGoal, setHealthGoal] = useState(null);
  const [todayPlan, setTodayPlan] = useState(null);
  const [weekPlans, setWeekPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [goal, plans] = await Promise.all([
          userService.getHealthGoal(userId).catch(() => null),
          mealService.getMealPlans(userId),
        ]);
        setHealthGoal(goal);
        setWeekPlans(plans || []);

        const today = (plans || []).find((p) => p.planDate === todayStr);
        setTodayPlan(today || null);
      } catch (err) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu dashboard.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId, todayStr]);

  const targetCalories = healthGoal?.dailyCaloriesKcal || 2000;
  const currentCalories = todayPlan ? 0 : 0; // Sẽ cập nhật sau khi có portions
  const calPercent = Math.min((currentCalories / targetCalories) * 100, 100);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-72 rounded bg-slate-200 animate-pulse mt-2" />
        </div>
        <SkeletonGrid count={4} cols="md:grid-cols-2 lg:grid-cols-4" />
        <SkeletonCard count={1} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Xin chào!</h1>
        <p className="text-muted-foreground">
          Đây là tổng quan kế hoạch dinh dưỡng của bạn hôm nay.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calo hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentCalories} / {targetCalories} kcal
            </div>
            <Progress value={calPercent} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mục tiêu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthGoal
                ? healthGoal.goalType === 'weight_loss'
                  ? 'Giảm cân'
                  : healthGoal.goalType === 'muscle_gain'
                  ? 'Tăng cơ'
                  : 'Duy trì'
                : 'Chưa thiết lập'}
            </div>
            <p className="text-xs text-muted-foreground">
              {healthGoal?.activityLevel === 'low'
                ? 'Vận động thấp'
                : healthGoal?.activityLevel === 'medium'
                ? 'Vận động trung bình'
                : healthGoal?.activityLevel === 'high'
                ? 'Vận động cao'
                : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kế hoạch tuần này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekPlans.length} ngày</div>
            <p className="text-xs text-muted-foreground">
              Đã lên kế hoạch
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hành động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild size="sm" className="w-full">
              <Link to="/meal-plans/manage">Xem lịch tuần</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/dishes">Tìm món ăn</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {todayPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>Kế hoạch hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Đã có kế hoạch cho ngày {todayStr}.{' '}
              <Link
                to={`/meal-plans/${todayPlan.id}`}
                className="font-medium text-primary underline underline-offset-4"
              >
                Xem chi tiết
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Kế hoạch hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chưa có kế hoạch cho hôm nay.{' '}
              <Link
                to="/meal-plans/new"
                className="font-medium text-primary underline underline-offset-4"
              >
                Tạo kế hoạch ngay
              </Link>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
