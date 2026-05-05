import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/api/userService';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/EmptyState';
import { Heart, ChefHat } from 'lucide-react';

export default function FavoritesPage() {
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await userService.getFavorites(userId);
        setDishes(data || []);
      } catch {
        toast({ title: 'Lỗi', description: 'Không thể tải danh sách yêu thích.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) {
    return <p className="text-muted-foreground">Đang tải...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Món ăn yêu thích</h1>
        <p className="text-muted-foreground">
          Các món ăn bạn đã đánh dấu yêu thích.
        </p>
      </div>

      {dishes.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Chưa có món yêu thích"
          description="Bạn chưa có món ăn yêu thích nào. Hãy khám phá thư viện món ăn!"
          actionLabel="Khám phá món ăn"
          onAction={() => navigate('/dishes')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <Link key={dish.id} to={`/dishes/${dish.id}`}>
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-video overflow-hidden bg-muted">
                  {dish.imageUrl ? (
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ChefHat className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{dish.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {dish.categoryId}
                      </Badge>
                    </div>
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
