import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
        Ăn uống thông minh, <br/>
        <span className="text-primary">Sống khỏe mỗi ngày</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        NutriPlan giúp bạn dễ dàng lập kế hoạch bữa ăn, theo dõi lượng calo và đạt được mục tiêu sức khỏe của mình một cách khoa học nhất.
      </p>
      <div className="flex gap-4 pt-4">
        <Button size="lg" onClick={() => navigate('/register')} className="rounded-full px-8 text-md shadow-lg shadow-primary/20">
          Bắt đầu miễn phí
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate('/meal-plans')} className="rounded-full px-8 text-md">
          Xem thực đơn mẫu
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
