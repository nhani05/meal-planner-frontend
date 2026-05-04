import { Users, ChefHat, CalendarDays, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const MOCK_STATS = {
  totalUsers: 1248,
  totalDishes: 356,
  totalMealPlans: 4523,
  pendingDishes: 7,
};

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
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground text-sm mt-1">Chào mừng bạn trở lại, Admin!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng người dùng"
          value={MOCK_STATS.totalUsers.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          description="+12 người mới trong tuần này"
        />
        <StatCard
          title="Tổng món ăn"
          value={MOCK_STATS.totalDishes.toLocaleString()}
          icon={<ChefHat className="w-5 h-5" />}
          description="Đã được phê duyệt"
        />
        <StatCard
          title="Kế hoạch bữa ăn"
          value={MOCK_STATS.totalMealPlans.toLocaleString()}
          icon={<CalendarDays className="w-5 h-5" />}
          description="Tổng kế hoạch đã tạo"
        />
        <StatCard
          title="Chờ duyệt món ăn"
          value={MOCK_STATS.pendingDishes}
          icon={<AlertCircle className="w-5 h-5" />}
          description="Cần xem xét và phê duyệt"
          highlight={MOCK_STATS.pendingDishes > 0}
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
            <ul className="space-y-3 text-sm">
              {[
                { action: 'Người dùng mới đăng ký', who: 'user@mail.com', time: '5 phút trước' },
                { action: 'Món ăn mới chờ duyệt', who: '"Phở bò tái"', time: '20 phút trước' },
                { action: 'Người dùng tạo kế hoạch', who: 'user2@mail.com', time: '1 giờ trước' },
                { action: 'Món ăn được phê duyệt', who: '"Cơm sườn bí đao"', time: '2 giờ trước' },
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-start border-b last:border-0 pb-2 last:pb-0">
                  <div>
                    <span className="font-medium">{item.action}:</span>{' '}
                    <span className="text-muted-foreground">{item.who}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                </li>
              ))}
            </ul>
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
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Phở bò tái', submittedBy: 'chef_nguyen', time: '20 phút trước' },
                { name: 'Bánh xèo miền Tây', submittedBy: 'cook_tran', time: '1 giờ trước' },
                { name: 'Canh chua cá lóc', submittedBy: 'foodie_le', time: '3 giờ trước' },
              ].map((dish, i) => (
                <li key={i} className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0">
                  <div>
                    <p className="font-medium">{dish.name}</p>
                    <p className="text-xs text-muted-foreground">bởi @{dish.submittedBy} · {dish.time}</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                    Chờ duyệt
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
