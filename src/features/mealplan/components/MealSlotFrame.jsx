import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const mealTypeLabels = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa',
  dinner: 'Bữa tối',
  snack: 'Bữa phụ'
};

const MealSlotFrame = ({ mealType, portions = [], onAddClick, onDeletePortion, onUpdatePortion }) => {
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalCalories = portions.reduce((sum, portion) => sum + (portion.calories_kcal || 0), 0);

  const startEdit = (portion) => {
    setEditingId(portion.id);
    setEditQty(String(portion.quantity_g || portion.quantityG || 100));
  };

  const saveEdit = (portionId) => {
    const qty = Number(editQty);
    if (qty > 0 && onUpdatePortion) {
      onUpdatePortion(mealType, portionId, qty);
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQty('');
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 border-b p-3 flex justify-between items-center">
        <h4 className="font-semibold flex items-center gap-2">
          {mealTypeLabels[mealType] || mealType}
          <span className="text-xs font-normal text-muted-foreground bg-slate-200 px-2 py-0.5 rounded-full">
            {Math.round(totalCalories)} kcal
          </span>
        </h4>
        <Button size="sm" variant="outline" onClick={() => onAddClick(mealType)}>
          <Plus className="w-4 h-4 mr-1" /> Thêm món
        </Button>
      </div>

      <div className="p-3">
        {portions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-md">
            Chưa có món ăn nào. Hãy thêm món để tính calo!
          </div>
        ) : (
          <ul className="space-y-2">
            {portions.map((portion) => (
              <li key={portion.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{portion.dishName || 'Món ăn'}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {editingId === portion.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="1"
                          value={editQty}
                          onChange={(e) => setEditQty(e.target.value)}
                          className="h-6 w-20 text-xs py-0 px-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(portion.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <span>g</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => saveEdit(portion.id)}>
                          <Check className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={cancelEdit}>
                          <X className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <button
                        className="hover:text-primary underline-offset-2 hover:underline"
                        onClick={() => startEdit(portion)}
                      >
                        {portion.quantity_g || portion.quantityG || 0}g
                      </button>
                    )}
                    <span>•</span>
                    <span>{Math.round(portion.calories_kcal || 0)} kcal</span>
                  </div>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500"
                    onClick={() => startEdit(portion)}
                    disabled={editingId === portion.id}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteTarget(portion)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete confirm mini-dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg space-y-4">
            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
            <p className="text-sm text-muted-foreground">
              Bạn có chắc muốn xóa <span className="font-medium text-foreground">{deleteTarget.dishName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Hủy</Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDeletePortion(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSlotFrame;
