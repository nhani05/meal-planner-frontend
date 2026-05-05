import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dishService } from '@/api/dishService';
import { userService } from '@/api/userService';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';
import { Heart, ArrowLeft, Clock, ChefHat } from 'lucide-react';

export default function DishDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const [dish, setDish] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const d = await dishService.getDishById(id);
        setDish(d);

        // Try to load nutrition and ingredients if available on dish object
        // or from separate endpoints if BE supports
        if (d.nutrition) setNutrition(d.nutrition);
        if (d.ingredients) setIngredients(d.ingredients);

        // Load ratings
        try {
          const r = await dishService.getDishRatings(id);
          setRatings(r || []);
        } catch {
          setRatings([]);
        }

        // Check favorite status
        try {
          const favs = await userService.getFavorites(userId);
          setIsFav(favs.some((f) => f.id === Number(id)));
        } catch {
          setIsFav(false);
        }
      } catch (err) {
        toast({
          title: 'Lỗi',
          description: 'Không tìm thấy món ăn.',
          variant: 'destructive',
        });
        navigate('/dishes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, userId, navigate]);

  const toggleFavorite = async () => {
    try {
      if (isFav) {
        await userService.removeFavorite(id, userId);
        setIsFav(false);
        toast({ title: 'Đã xóa khỏi yêu thích' });
      } else {
        await userService.addFavorite(id, userId);
        setIsFav(true);
        toast({ title: 'Đã thêm vào yêu thích' });
      }
    } catch {
      toast({ title: 'Lỗi', description: 'Không thể cập nhật yêu thích.', variant: 'destructive' });
    }
  };

  if (loading || !dish) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Image + basic info */}
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            {dish.imageUrl ? (
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ChefHat className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{dish.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{dish.categoryId}</Badge>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  {dish.totalTimeMin} phút
                </Badge>
                <Badge variant="outline">{dish.difficulty}</Badge>
              </div>
            </div>
            <Button
              variant={isFav ? 'default' : 'outline'}
              size="icon"
              onClick={toggleFavorite}
            >
              <Heart className={isFav ? 'fill-current' : ''} />
            </Button>
          </div>
        </div>

        {/* Right: Nutrition + Ingredients */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin dinh dưỡng / 100g</CardTitle>
            </CardHeader>
            <CardContent>
              {nutrition ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <div className="text-xl font-bold">{nutrition.caloriesPer100g}</div>
                    <div className="text-xs text-muted-foreground">kcal</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <div className="text-xl font-bold">{nutrition.proteinPer100g}g</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <div className="text-xl font-bold">{nutrition.carbPer100g}g</div>
                    <div className="text-xs text-muted-foreground">Carb</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <div className="text-xl font-bold">{nutrition.fatPer100g}g</div>
                    <div className="text-xs text-muted-foreground">Chất béo</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa có thông tin dinh dưỡng chi tiết.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nguyên liệu</CardTitle>
            </CardHeader>
            <CardContent>
              {ingredients.length > 0 ? (
                <ul className="divide-y">
                  {ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between py-2">
                      <span>{ing.name}</span>
                      <span className="text-muted-foreground">
                        {ing.quantityG} {ing.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa có danh sách nguyên liệu.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
