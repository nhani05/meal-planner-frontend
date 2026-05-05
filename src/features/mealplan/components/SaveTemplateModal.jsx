import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

const SaveTemplateModal = ({ isOpen, onClose, onSave, existingTemplates = [] }) => {
  const [templateName, setTemplateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleSubmit = async () => {
    if (!templateName.trim()) return;
    setIsLoading(true);
    try {
      await onSave(templateName.trim());
      setTemplateName('');
      setDuplicate(false);
      onClose();
    } catch (err) {
      if (err?.message?.includes('duplicate') || err?.response?.status === 409) {
        setDuplicate(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkDuplicate = (name) => {
    const exists = existingTemplates.some((t) => t.name?.toLowerCase() === name.toLowerCase());
    setDuplicate(exists);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lưu thành mẫu</DialogTitle>
          <DialogDescription>
            Lưu kế hoạch bữa ăn hiện tại để sử dụng lại sau này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Tên mẫu</Label>
            <Input
              id="templateName"
              placeholder="VD: Thực đơn giảm cân tuần 1"
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                checkDuplicate(e.target.value);
              }}
            />
            {duplicate && (
              <p className="text-xs text-amber-600">
                Tên mẫu đã tồn tại. Lưu sẽ ghi đè lên mẫu cũ.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={!templateName.trim() || isLoading}>
            {isLoading ? 'Đang lưu...' : 'Lưu mẫu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateModal;
