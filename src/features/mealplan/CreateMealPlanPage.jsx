import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { mealService } from '../../api/mealService';

const CreateMealPlanPage = () => {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const [planDate, setPlanDate] = useState(dateParam || format(new Date(), 'yyyy-MM-dd'));
  const [planName, setPlanName] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    mealService.getTemplates()
      .then(data => setTemplates(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setTemplates([]));
  }, []);

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
        // Tạo 4 bữa rỗng theo đúng cấu trúc API
        meals: [
          { mealType: 'breakfast', portions: [] },
          { mealType: 'lunch', portions: [] },
          { mealType: 'dinner', portions: [] },
          { mealType: 'snack', portions: [] },
        ]
      };
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/meal-plans')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Tạo kế hoạch bữa ăn mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin kế hoạch</CardTitle>
          <CardDescription>Thiết lập ngày và tên cho thực đơn của bạn.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {templates.length > 0 && (
            <div className="border p-4 rounded-md bg-slate-50">
              <h3 className="font-medium mb-2 text-sm">Hoặc áp dụng từ Mẫu có sẵn</h3>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">-- Không sử dụng mẫu --</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.templateName || t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang tạo...</> : 'Tiếp tục thêm món ăn'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMealPlanPage;
