import { useEffect, useState } from 'react';
import { Users, ChefHat, CalendarDays, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { adminService } from '../../api/adminService';
import { useToast } from '../../hooks/use-toast';

const StatCard = ({ title, value, icon, description, highlight }) => (
  <Card className={highlight ? 'border-amber-300 bg-amber-50' : ''}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-md ${highlight ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${highlight ? 'text-amber-700' : 'text-slate-800'}`}>{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStats();
        setStats(data);
      } catch {
        toast({ title: 'Lỗi', description: 'Không thể tải thống kê.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground text-sm mt-1">Chào mừng bạn trở lại, Admin!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng người dùng"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="w-5 h-5" />}
          description="Người dùng trong hệ thống"
        />
        <StatCard
          title="Tổng món ăn"
          value={stats?.totalDishes ?? 0}
          icon={<ChefHat className="w-5 h-5" />}
          description="Món ăn đã có"
        />
        <StatCard
          title="Kế hoạch hôm nay"
          value={stats?.activePlansToday ?? 0}
          icon={<CalendarDays className="w-5 h-5" />}
          description="Kế hoạch đang hoạt động"
        />
        <StatCard
          title="Phản hồi mới"
          value={stats?.newFeedbacks ?? 0}
          icon={<AlertCircle className="w-5 h-5" />}
          description="Cần xử lý"
          highlight={(stats?.newFeedbacks ?? 0) > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Dữ liệu hoạt động sẽ được cập nhật trong phiên bản tới.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Món ăn chờ phê duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Danh sách chờ duyệt sẽ được cập nhật trong phiên bản tới.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
