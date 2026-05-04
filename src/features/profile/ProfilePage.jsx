import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { userService } from '../../api/userService';
import { useUserStore } from '../../store/userStore';
import { useToast } from '../../hooks/use-toast';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

// Validation Schemas - Aligning with Postman (camelCase)
const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }).optional(),
  age: z.coerce.number().min(1).max(120).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other']).optional(),
  heightCm: z.coerce.number().min(50).max(250).optional(),
  weightKg: z.coerce.number().min(10).max(300).optional(),
});

const healthGoalSchema = z.object({
  goal_type: z.enum(['weight_loss', 'muscle_gain', 'maintain']),
  activity_level: z.enum(['low', 'medium', 'high']),
  target_weight_kg: z.coerce.number().min(10).max(300).optional(),
});

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { setProfile, setHealthGoal } = useUserStore();
  const { toast } = useToast();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      age: 20,
      gender: 'MALE',
      heightCm: 160,
      weightKg: 60,
    },
  });

  const goalForm = useForm({
    resolver: zodResolver(healthGoalSchema),
    defaultValues: {
      goal_type: 'maintain',
      activity_level: 'medium',
      target_weight_kg: 60,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, goalData] = await Promise.all([
          userService.getProfile().catch(() => null),
          userService.getHealthGoal().catch(() => null)
        ]);
        
        if (profileData) {
          setProfile(profileData);
          profileForm.reset({
            fullName: profileData.fullName || profileData.full_name || '',
            age: profileData.age || 20,
            gender: (profileData.gender || 'MALE').toUpperCase(),
            heightCm: profileData.heightCm || profileData.height_cm || 160,
            weightKg: profileData.weightKg || profileData.weight_kg || 60,
          });
        }
        
        if (goalData) {
          setHealthGoal(goalData);
          goalForm.reset({
            goal_type: goalData.goal_type || 'maintain',
            activity_level: goalData.activity_level || 'medium',
            target_weight_kg: goalData.target_weight_kg || 60,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [setProfile, setHealthGoal, profileForm, goalForm]);

  const onProfileSubmit = async (values) => {
    setIsSaving(true);
    try {
      const payload = { ...values, gender: values.gender.toUpperCase() };
      const updatedProfile = await userService.updateProfile(payload);
      setProfile(updatedProfile);
      toast({ title: "Cập nhật thành công", description: "Hồ sơ cá nhân đã được lưu lại." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật hồ sơ.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onGoalSubmit = async (values) => {
    setIsSaving(true);
    try {
      const updatedGoal = await userService.updateHealthGoal(values);
      setHealthGoal(updatedGoal);
      toast({ title: "Cập nhật thành công", description: "Mục tiêu sức khỏe đã được lưu lại." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật mục tiêu.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 font-medium">Đang tải thông tin hồ sơ...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin sức khỏe và mục tiêu của bạn</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="health-goal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Mục tiêu sức khỏe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="focus-visible:outline-none">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">Chỉ số cơ thể</CardTitle>
              <CardDescription>
                Cập nhật các chỉ số chính xác để hệ thống tính toán TDEE chuẩn nhất.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Tuổi</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Giới tính</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Nam</SelectItem>
                              <SelectItem value="FEMALE">Nữ</SelectItem>
                              <SelectItem value="OTHER">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="heightCm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Chiều cao (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="weightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Cân nặng (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full md:w-auto px-10 h-11">
                    {isSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health-goal" className="focus-visible:outline-none">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">Mục tiêu & Vận động</CardTitle>
              <CardDescription>
                Thiết lập mục tiêu để nhận được đề xuất Calo hàng ngày.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...goalForm}>
                <form onSubmit={goalForm.handleSubmit(onGoalSubmit)} className="space-y-8">
                  <FormField
                    control={goalForm.control}
                    name="goal_type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-bold text-slate-800">Mục tiêu của bạn là gì?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            {[
                              { id: 'weight_loss', label: 'Giảm cân', desc: 'Calo < TDEE' },
                              { id: 'maintain', label: 'Duy trì', desc: 'Calo = TDEE' },
                              { id: 'muscle_gain', label: 'Tăng cân', desc: 'Calo > TDEE' },
                            ].map((item) => (
                              <FormItem key={item.id} className="flex items-center space-x-0 space-y-0 relative">
                                <FormControl>
                                  <RadioGroupItem value={item.id} className="sr-only" />
                                </FormControl>
                                <FormLabel className={`flex flex-col p-4 w-full border-2 rounded-xl cursor-pointer transition-all ${field.value === item.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
                                  <span className="font-bold text-slate-900">{item.label}</span>
                                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={goalForm.control}
                    name="activity_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-slate-800">Mức độ vận động hàng ngày</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-slate-200">
                              <SelectValue placeholder="Chọn mức độ vận động" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Ít vận động (Làm việc văn phòng, không tập thể dục)</SelectItem>
                            <SelectItem value="medium">Vận động vừa (Tập thể dục 3-5 ngày/tuần)</SelectItem>
                            <SelectItem value="high">Vận động nhiều (Tập nặng 6-7 ngày/tuần)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={goalForm.control}
                    name="target_weight_kg"
                    render={({ field }) => (
                      <FormItem className="max-w-xs">
                        <FormLabel className="text-base font-bold text-slate-800">Cân nặng mục tiêu (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSaving} className="w-full md:w-auto px-10 h-11">
                    {isSaving ? 'Đang lưu...' : 'Lưu mục tiêu'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
