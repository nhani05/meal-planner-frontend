import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';

export default function DishRating({
  ratings = [],
  onSubmit,
  isLoading = false,
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1) return;
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="space-y-6">
      {/* Form đánh giá */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-4 rounded-lg border">
        <h3 className="font-semibold">Đánh giá món ăn</h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 transition-transform hover:scale-110"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hover || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 ? `${rating}/5 sao` : 'Chọn số sao'}
          </span>
        </div>
        <Textarea
          placeholder="Nhận xét của bạn (tùy chọn)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <Button type="submit" disabled={rating < 1 || isLoading} size="sm">
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </form>

      {/* Danh sách đánh giá */}
      {ratings.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">
            Đánh giá ({ratings.length})
          </h3>
          {ratings.map((r, i) => (
            <div key={i} className="border rounded-md p-3 space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < (r.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {r.submittedAt
                    ? new Date(r.submittedAt).toLocaleDateString('vi-VN')
                    : ''}
                </span>
              </div>
              {r.comment && (
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
