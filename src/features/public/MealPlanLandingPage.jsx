import { Link } from 'react-router-dom';
import { Calendar, ChefHat, LineChart, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

const MealPlanLandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl mb-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Lập kế hoạch bữa ăn <br />
            <span className="text-primary underline decoration-primary/30">Khoa học & Cá nhân hóa</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Đạt được mục tiêu sức khỏe của bạn dễ dàng hơn bao giờ hết với công cụ lên thực đơn thông minh.
            Tự động tính toán calo và dinh dưỡng cho từng ngày.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/meal-plans/manage">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                Bắt đầu lập kế hoạch ngay <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lịch tuần trực quan</h3>
            <p className="text-slate-600 text-sm">
              Sắp xếp bữa sáng, trưa, tối và bữa phụ chỉ trong vài giây. Xem toàn bộ dinh dưỡng của cả tuần.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Thư viện món ăn</h3>
            <p className="text-slate-600 text-sm">
              Hàng ngàn món ăn đã được tính sẵn dinh dưỡng. Bạn cũng có thể tự tạo món ăn của riêng mình.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Theo dõi Calo tự động</h3>
            <p className="text-slate-600 text-sm">
              Cảnh báo khi bạn vượt ngưỡng Calo mục tiêu hoặc thiếu hụt dinh dưỡng thiết yếu (Protein, Carb, Fat).
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-slate-50 rounded-3xl px-8 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Tại sao nên lên kế hoạch bữa ăn?</h2>
            <ul className="space-y-4">
              {[
                'Tiết kiệm thời gian mỗi ngày cho câu hỏi "Hôm nay ăn gì?"',
                'Kiểm soát cân nặng hiệu quả và khoa học.',
                'Giảm thiểu lãng phí thực phẩm và tiết kiệm chi phí.',
                'Cải thiện thói quen ăn uống lành mạnh cho cả gia đình.',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 transform rotate-2">
              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-20 bg-primary/10 rounded-lg flex-1"></div>
                  <div className="h-20 bg-primary/10 rounded-lg flex-1"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-4 bg-primary/20 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Bạn đã sẵn sàng để thay đổi vóc dáng?</h2>
        <p className="text-slate-600 mb-8">Hãy để NutriPlan đồng hành cùng bạn trên con đường chăm sóc sức khỏe.</p>
        <Link to="/register">
          <Button size="lg" variant="default" className="rounded-full px-10">
            Đăng ký tài khoản miễn phí
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default MealPlanLandingPage;
