import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';

import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

const emailSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
});

const otpSchema = z.object({
  otp: z.string().min(6, { message: 'OTP phải có 6 ký tự' }),
});

const resetSchema = z.object({
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onEmailSubmit = async (values) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(values.email);
      setEmail(values.email);
      setStep(2);
      toast({
        title: "Đã gửi OTP",
        description: "Vui lòng kiểm tra email của bạn để lấy mã OTP.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Giả sử API verifyOtp trả về token dùng để reset
      const response = await authService.verifyOtp(email, values.otp);
      setResetToken(response.token || values.otp); // Fallback nếu API dùng chính OTP làm token
      setStep(3);
      toast({
        title: "Xác thực thành công",
        description: "Vui lòng đặt lại mật khẩu mới.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xác thực thất bại",
        description: error.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (values) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, values.password);
      toast({
        title: "Đặt lại mật khẩu thành công",
        description: "Bạn có thể đăng nhập bằng mật khẩu mới.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể đặt lại mật khẩu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Khôi phục mật khẩu</CardTitle>
          <CardDescription>
            {step === 1 && "Nhập email của bạn để nhận mã OTP"}
            {step === 2 && "Nhập mã OTP gồm 6 chữ số đã được gửi đến email"}
            {step === 3 && "Tạo mật khẩu mới cho tài khoản của bạn"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Gửi mã OTP'}
                </Button>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã OTP</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập 6 chữ số" {...field} maxLength={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
                </Button>
                <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => setStep(1)}>
                  Quay lại
                </Button>
              </form>
            </Form>
          )}

          {step === 3 && (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        {step === 1 && (
          <CardFooter className="flex flex-col space-y-4 text-center text-sm">
            <div className="text-muted-foreground">
              Nhớ mật khẩu?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
