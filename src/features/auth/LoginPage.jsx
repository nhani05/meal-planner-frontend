import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../api/authService';

import { Button } from '../../components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

const loginSchema = z.object({
  username: z.string().min(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

const REASON_MESSAGES = {
  locked: { title: 'Tài khoản bị khóa', description: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' },
  deleted: { title: 'Tài khoản không tồn tại', description: 'Tài khoản của bạn đã bị xóa.' },
};

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const { toast } = useToast();

  // Hiển thị thông báo nếu được redirect từ interceptor (bị khóa/bị xóa)
  const reason = searchParams.get('reason');
  if (reason && REASON_MESSAGES[reason]) {
    const msg = REASON_MESSAGES[reason];
    setTimeout(() => toast({ variant: 'destructive', title: msg.title, description: msg.description }), 100);
  }

  // Trang muốn truy cập trước khi bị redirect về login (do ProtectedRoute lưu lại)
  const from = location.state?.from?.pathname || '/meal-plans/manage';

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const data = await authService.login(values);
      // data: { token, user: { id, role, ... } }
      login(data.token, data.user.role, data.user.id);
      toast({ title: 'Đăng nhập thành công', description: 'Chào mừng bạn trở lại!' });

      // Redirect về trang đã cố truy cập trước đó (hoặc /meal-plans nếu admin thì /admin)
      if (String(data.role).toLowerCase() === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message;
      if (status === 423) {
        toast({ variant: 'destructive', title: 'Tài khoản bị khóa', description: 'Vui lòng liên hệ quản trị viên.' });
      } else if (status === 401) {
        toast({ variant: 'destructive', title: 'Sai tài khoản hoặc mật khẩu', description: 'Vui lòng kiểm tra lại.' });
      } else {
        toast({ variant: 'destructive', title: 'Đăng nhập thất bại', description: msg || 'Vui lòng thử lại sau.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>Nhập tài khoản và mật khẩu để tiếp tục</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl><Input placeholder="Nhập tên đăng nhập" autoComplete="username" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <div className="w-full text-muted-foreground">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Đăng ký ngay</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
