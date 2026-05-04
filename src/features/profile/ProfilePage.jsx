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

// Validation Schemas
const profileSchema = z.object({
  full_name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }).optional(),
  age: z.coerce.number().min(1).max(120).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  height_cm: z.coerce.number().min(50).max(250).optional(),
  weight_kg: z.coerce.number().min(10).max(300).optional(),
});

const healthGoalSchema = z.object({
  goal_type: z.enum(['weight_loss', 'muscle_gain', 'maintain']),
  activity_level: z.enum(['low', 'medium', 'high']),
  target_weight_kg: z.coerce.number().min(10).max(300).optional(),
});

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { profile, healthGoal, setProfile, setHealthGoal } = useUserStore();
  const { toast } = useToast();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      age: 20,
      gender: 'other',
      height_cm: 160,
      weight_kg: 60,
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
            full_name: profileData.full_name || '',
            age: profileData.age || 20,
            gender: profileData.gender || 'other',
            height_cm: profileData.height_cm || 160,
            weight_kg: profileData.weight_kg || 60,
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
      const updatedProfile = await userService.updateProfile(values);
      setProfile(updatedProfile);
      toast({
        title: "Cập nhật thành công",
        description: "Hồ sơ cá nhân đã được lưu lại.",
      });
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
      toast({
        title: "Cập nhật thành công",
        description: "Mục tiêu sức khỏe đã được lưu lại.",
      });
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
    return <div className="text-center py-12">Đang tải thông tin...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Hồ sơ cá nhân</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="profile">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="health-goal">Mục tiêu sức khỏe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Cập nhật các chỉ số cơ thể để hệ thống có thể tính toán chính xác nhu cầu dinh dưỡng của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
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
                          <FormLabel>Tuổi</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
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
                          <FormLabel>Giới tính</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Nam</SelectItem>
                              <SelectItem value="female">Nữ</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
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
                      name="height_cm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chiều cao (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="weight_kg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cân nặng (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health-goal">
          <Card>
            <CardHeader>
              <CardTitle>Mục tiêu sức khỏe</CardTitle>
              <CardDescription>
                Hệ thống sẽ dựa vào mục tiêu này để tính toán lượng Calo (TDEE) và Macros hàng ngày cho bạn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...goalForm}>
                <form onSubmit={goalForm.handleSubmit(onGoalSubmit)} className="space-y-8">
                  <FormField
                    control={goalForm.control}
                    name="goal_type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Mục tiêu của bạn là gì?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="weight_loss" />
                              </FormControl>
                              <FormLabel className="font-normal">Giảm cân</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="maintain" />
                              </FormControl>
                              <FormLabel className="font-normal">Duy trì cân nặng</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="muscle_gain" />
                              </FormControl>
                              <FormLabel className="font-normal">Tăng cơ / Tăng cân</FormLabel>
                            </FormItem>
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
                        <FormLabel>Mức độ vận động hàng ngày</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn mức độ vận động" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Ít vận động (Việc văn phòng, không tập thể dục)</SelectItem>
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
                        <FormLabel>Cân nặng mục tiêu (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {healthGoal?.daily_calories_kcal && (
                    <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
                      <p className="font-medium text-primary">TDEE / Calo mục tiêu hiện tại của bạn:</p>
                      <p className="text-2xl font-bold">{healthGoal.daily_calories_kcal} kcal / ngày</p>
                    </div>
                  )}

                  <Button type="submit" disabled={isSaving}>
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
