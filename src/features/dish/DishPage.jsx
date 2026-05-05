import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Heart,
  ChefHat,
  Loader2,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';
import { dishService } from '../../api/dishService';
import { userService } from '../../api/userService';
import { useAuthStore } from '../../store/authStore';
import { EmptyState } from '../../components/EmptyState';
import { SkeletonImageCard } from '../../components/SkeletonCard';

const CALORIE_RANGES = [
  { label: 'Tất cả', min: '', max: '' },
  { label: '< 200 kcal', min: 0, max: 200 },
  { label: '200 – 400 kcal', min: 200, max: 400 },
  { label: '400 – 600 kcal', min: 400, max: 600 },
  { label: '> 600 kcal', min: 600, max: 99999 },
];

const DishPage = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [calorieFilter, setCalorieFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useAuthStore();

  const fetchDishes = async () => {
    setIsLoading(true);
    try {
      const data = await dishService.getDishes();
      setDishes(Array.isArray(data) ? data : data?.content || []);
    } catch {
      toast({ variant: 'destructive', title: 'Không thể tải danh sách món ăn' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await dishService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      // silently fail
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await userService.getFavorites(userId);
      setFavorites(new Set((data || []).map((d) => d.id)));
    } catch {
      setFavorites(new Set());
    }
  };

  useEffect(() => {
    fetchDishes();
    fetchCategories();
    fetchFavorites();
  }, []);

  const toggleFavorite = async (e, dishId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (favorites.has(dishId)) {
        await userService.removeFavorite(dishId, userId);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(dishId);
          return next;
        });
      } else {
        await userService.addFavorite(dishId, userId);
        setFavorites((prev) => new Set(prev).add(dishId));
      }
    } catch {
      toast({ title: 'Lỗi', description: 'Không thể cập nhật yêu thích.', variant: 'destructive' });
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setCalorieFilter('');
  };

  const calRange = CALORIE_RANGES.find((r) => r.label === calorieFilter);

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      !searchTerm ||
      dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || String(dish.categoryId) === categoryFilter;
    const cal = dish.nutritionInfo?.caloriesPer100g ?? 0;
    const matchesCal =
      !calRange ||
      (cal >= calRange.min && cal <= calRange.max);
    return matchesSearch && matchesCategory && matchesCal;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thư viện món ăn</h1>
          <p className="text-muted-foreground text-sm">
            Tìm kiếm và khám phá các món ăn phù hợp.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((s) => !s)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Bộ lọc
          </Button>
          <Button size="sm" onClick={() => navigate('/dishes/new')}>
            <Plus className="w-4 h-4 mr-2" /> Thêm món
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tên món..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={calorieFilter} onValueChange={setCalorieFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Calo /100g" />
              </SelectTrigger>
              <SelectContent>
                {CALORIE_RANGES.map((r) => (
                  <SelectItem key={r.label} value={r.label}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || categoryFilter || calorieFilter) && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="w-3 h-3 mr-1" /> Xóa bộ lọc
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <SkeletonImageCard count={8} />
      ) : filteredDishes.length === 0 ? (
        <EmptyState
          title="Không tìm thấy món ăn"
          description="Thử xóa bộ lọc hoặc thêm món ăn mới."
          actionLabel="Xóa bộ lọc"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDishes.map((dish) => {
            const cal =
              dish.nutritionInfo?.caloriesPer100g ??
              dish.nutritionInfo?.caloriesKcal ??
              0;
            const isFav = favorites.has(dish.id);
            return (
              <Link key={dish.id} to={`/dishes/${dish.id}`}>
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md group">
                  <div className="aspect-video overflow-hidden bg-muted relative">
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
                    <button
                      onClick={(e) => toggleFavorite(e, dish.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFav
                            ? 'fill-red-500 text-red-500'
                            : 'text-slate-500'
                        }`}
                      />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{dish.name}</h3>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {categories.find(
                            (c) => String(c.id) === String(dish.categoryId)
                          )?.name || 'Món ăn'}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {Math.round(cal)} kcal/100g
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DishPage;
