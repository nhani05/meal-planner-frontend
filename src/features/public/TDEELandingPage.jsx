import { Link } from 'react-router-dom';
import { Calculator, Zap, Target, Activity, ArrowRight, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';

const TDEELandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl mb-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Calculator className="w-4 h-4" /> Công cụ phân tích chỉ số cơ thể
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Hiểu rõ cơ thể bạn với <br />
            <span className="text-blue-600">Chỉ số TDEE & BMR</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Bạn cần bao nhiêu Calo mỗi ngày? Hãy để công cụ của chúng tôi tính toán chính xác nhu cầu năng lượng dựa trên cân nặng, chiều cao và mức độ vận động của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-blue-200 transition-all">
                Tính toán chỉ số của tôi <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Concept Explanation */}
      <section className="py-12 mb-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">TDEE là gì?</h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>TDEE (Total Daily Energy Expenditure)</strong> là tổng lượng calo mà cơ thể bạn đốt cháy trong 24 giờ thông qua các hoạt động: tiêu hóa, tập luyện và cả những hoạt động cơ bản nhất như hít thở.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800 italic">
                "Biết được TDEE là chìa khóa vàng để bạn giảm cân, tăng cơ hoặc duy trì vóc dáng một cách bền vững."
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">BMR</h4>
                <p className="text-xs text-slate-500">Năng lượng tiêu thụ ở trạng thái nghỉ ngơi hoàn toàn.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm translate-x-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Mức độ vận động</h4>
                <p className="text-xs text-slate-500">Nhân hệ số theo tần suất tập luyện của bạn.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Mục tiêu sức khỏe</h4>
                <p className="text-xs text-slate-500">Bù trừ Calo để đạt được cân nặng mong muốn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-900 text-white rounded-3xl px-8 mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-12">Quy trình 3 bước đơn giản</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-white/20">1</div>
              <h3 className="font-bold">Nhập chỉ số</h3>
              <p className="text-slate-400 text-sm">Cung cấp chiều cao, cân nặng, tuổi và giới tính của bạn.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-white/20">2</div>
              <h3 className="font-bold">Chọn mục tiêu</h3>
              <p className="text-slate-400 text-sm">Bạn muốn giảm mỡ, tăng cơ hay sống khỏe mỗi ngày?</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-white/20">3</div>
              <h3 className="font-bold">Nhận kết quả</h3>
              <p className="text-slate-400 text-sm">Hệ thống tính toán TDEE và đề xuất lượng Macros (Đạm, Đường, Béo).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Alert */}
      <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4 items-start mb-20">
        <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Lưu ý về quyền riêng tư</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            Để lưu lại lịch sử thay đổi cân nặng và đồng bộ chỉ số TDEE với kế hoạch bữa ăn, bạn cần đăng nhập tài khoản. Mọi thông tin sức khỏe của bạn đều được mã hóa và bảo mật tuyệt đối.
          </p>
        </div>
      </div>

      {/* CTA */}
      <section className="text-center py-12">
        <Link to="/register">
          <Button size="lg" className="rounded-full px-10 bg-slate-900 hover:bg-slate-800">
            Đăng ký và tính toán ngay
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default TDEELandingPage;
