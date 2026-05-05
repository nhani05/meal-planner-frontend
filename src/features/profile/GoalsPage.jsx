import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { userService } from '@/api/userService';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';

const GOAL_OPTIONS = [
  { value: 'weight_loss', label: 'Giảm cân' },
  { value: 'muscle_gain', label: 'Tăng cơ' },
  { value: 'maintain', label: 'Duy trì' },
];

const ACTIVITY_OPTIONS = [
  { value: 'low', label: 'Thấp' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'high', label: 'Cao' },
];

export default function GoalsPage() {
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [goal, setGoal] = useState({
    goalType: 'maintain',
    activityLevel: 'medium',
    targetWeightKg: '',
    dailyCaloriesKcal: '',
    proteinGDay: '',
    carbGDay: '',
    fatGDay: '',
  });

  useEffect(() => {
    const loadGoal = async () => {
      try {
        const data = await userService.getHealthGoal(userId);
        if (data) {
          setGoal({
            goalType: data.goalType || 'maintain',
            activityLevel: data.activityLevel || 'medium',
            targetWeightKg: data.targetWeightKg || '',
            dailyCaloriesKcal: data.dailyCaloriesKcal || '',
            proteinGDay: data.proteinGDay || '',
            carbGDay: data.carbGDay || '',
            fatGDay: data.fatGDay || '',
          });
        }
      } catch {
        // Silently ignore if no goal exists yet
      }
    };
    loadGoal();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await userService.updateHealthGoal(goal, userId);
      toast({ title: 'Thành công', description: 'Lưu mục tiêu sức khỏe thành công!' });
      navigate('/profile');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err.response?.data?.message || 'Không thể lưu mục tiêu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Thiết lập mục tiêu sức khỏe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Mục tiêu</Label>
              <RadioGroup
                value={goal.goalType}
                onValueChange={(v) => setGoal({ ...goal, goalType: v })}
                className="flex flex-col space-y-2"
              >
                {GOAL_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <Label htmlFor={opt.value} className="font-normal">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityLevel">Mức độ vận động</Label>
              <Select
                value={goal.activityLevel}
                onValueChange={(v) => setGoal({ ...goal, activityLevel: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight">Cân nặng mục tiêu (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                value={goal.targetWeightKg}
                onChange={(e) =>
                  setGoal({ ...goal, targetWeightKg: e.target.value })
                }
                placeholder="65"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyCalories">
                Calo mục tiêu mỗi ngày (kcal)
              </Label>
              <Input
                id="dailyCalories"
                type="number"
                value={goal.dailyCaloriesKcal}
                onChange={(e) =>
                  setGoal({ ...goal, dailyCaloriesKcal: e.target.value })
                }
                placeholder="1800"
              />
              <p className="text-xs text-muted-foreground">
                Bạn có thể để trống để hệ thống tự tính từ TDEE sau này.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g/ngày)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={goal.proteinGDay}
                  onChange={(e) =>
                    setGoal({ ...goal, proteinGDay: e.target.value })
                  }
                  placeholder="120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carb">Carb (g/ngày)</Label>
                <Input
                  id="carb"
                  type="number"
                  value={goal.carbGDay}
                  onChange={(e) =>
                    setGoal({ ...goal, carbGDay: e.target.value })
                  }
                  placeholder="200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Chất béo (g/ngày)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={goal.fatGDay}
                  onChange={(e) =>
                    setGoal({ ...goal, fatGDay: e.target.value })
                  }
                  placeholder="60"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang lưu...' : 'Lưu mục tiêu'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
