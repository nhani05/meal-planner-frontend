import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminService } from '@/api/adminService';
import { toast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const STATUS_MAP = {
  pending: { label: 'Chưa xử lý', className: 'bg-red-100 text-red-700' },
  processing: { label: 'Đang xử lý', className: 'bg-yellow-100 text-yellow-700' },
  resolved: { label: 'Đã xử lý', className: 'bg-green-100 text-green-700' },
};

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await adminService.getFeedbacks(params);
      setFeedbacks(data?.content || data || []);
    } catch {
      toast({ title: 'Lỗi', description: 'Không thể tải phản hồi.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleUpdateStatus = async () => {
    if (!selectedFeedback || !newStatus) return;
    try {
      await adminService.updateFeedbackStatus(selectedFeedback.id, newStatus);
      toast({ title: 'Thành công', description: 'Cập nhật trạng thái phản hồi.' });
      setSelectedFeedback(null);
      load();
    } catch {
      toast({ title: 'Lỗi', description: 'Không thể cập nhật.', variant: 'destructive' });
    }
  };

  const truncate = (text, len = 60) => {
    if (!text) return '';
    return text.length > len ? text.slice(0, len) + '...' : text;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Quản lý phản hồi</h1>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chưa xử lý</TabsTrigger>
          <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
          <TabsTrigger value="resolved">Đã xử lý</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Không có phản hồi nào.
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell>#{fb.id}</TableCell>
                    <TableCell>{truncate(fb.content, 80)}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_MAP[fb.status]?.className || ''}>
                        {STATUS_MAP[fb.status]?.label || fb.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {fb.submittedAt
                        ? new Date(fb.submittedAt).toLocaleDateString('vi-VN')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedFeedback(fb);
                          setNewStatus(fb.status);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedFeedback && (
        <ConfirmDialog
          open={!!selectedFeedback}
          onOpenChange={(open) => !open && setSelectedFeedback(null)}
          title={`Phản hồi #${selectedFeedback.id}`}
          description={
            <div className="space-y-4 text-left">
              <div>
                <span className="font-medium">Nội dung:</span>
                <p className="mt-1 text-sm">{selectedFeedback.content}</p>
              </div>
              <div>
                <span className="font-medium">Trạng thái:</span>
                <select
                  className="ml-2 rounded border px-2 py-1 text-sm"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Chưa xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="resolved">Đã xử lý</option>
                </select>
              </div>
              <div>
                <span className="font-medium">Ghi chú Admin:</span>
                <textarea
                  className="mt-1 w-full rounded border px-2 py-1 text-sm"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú..."
                />
              </div>
            </div>
          }
          confirmLabel="Lưu"
          cancelLabel="Đóng"
          variant="default"
          onConfirm={handleUpdateStatus}
        />
      )}
    </div>
  );
}
