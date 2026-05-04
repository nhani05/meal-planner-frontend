import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

const ingredientSchema = z.object({
  name: z.string().min(2, { message: 'Tên nguyên liệu phải có ít nhất 2 ký tự' }),
  calories_kcal: z.coerce.number().min(0, { message: 'Calo không được âm' }),
  protein_g: z.coerce.number().min(0, { message: 'Protein không được âm' }),
  carb_g: z.coerce.number().min(0, { message: 'Carb không được âm' }),
  fat_g: z.coerce.number().min(0, { message: 'Fat không được âm' }),
});

const IngredientModal = ({ isOpen, onClose, onSave, initialData }) => {
  const isEdit = !!initialData;

  const form = useForm({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: initialData?.name || '',
      calories_kcal: initialData?.calories_kcal || 0,
      protein_g: initialData?.protein_g || 0,
      carb_g: initialData?.carb_g || 0,
      fat_g: initialData?.fat_g || 0,
    },
  });

  const onSubmit = async (values) => {
    // Gọi hàm onSave từ Component cha (IngredientPage)
    await onSave(values, isEdit ? initialData.id : null);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa Nguyên liệu' : 'Thêm Nguyên liệu mới'}</DialogTitle>
          <DialogDescription>
            Nhập thông tin dinh dưỡng tính trên 100g nguyên liệu.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nguyên liệu <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Gạo lứt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calories_kcal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calo (kcal/100g) <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="protein_g"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Protein (g)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carb_g"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carb (g)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fat_g"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fat (g)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
              <Button type="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientModal;
