/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  // IconButton,
  // Tooltip,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';

import { useFetch } from '../../../../../Hooks/useFetch';
import { GetAllOrders, UpdateOrderStatus } from '../../../../../Api/modules/admins';

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface Book {
  title: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  book: Book;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Order {
  id: number;
  user: User;
  date: string;
  status: 'pending' | 'shipped';
  total: number;
  orderItems: OrderItem[];
}

export default function AdminOrders() {
  const { data: ordersData, loading, refresh } = useFetch(GetAllOrders);
  const orders = ordersData || [];

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await UpdateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'rgba(241, 196, 15, 0.1)', color: '#f39c12' };
      case 'shipped': return { bg: 'rgba(52, 152, 219, 0.1)', color: '#3498db' };
      case 'delivered': return { bg: 'rgba(46, 204, 113, 0.1)', color: '#27ae60' };
      case 'canceled': return { bg: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c' };
      default: return { bg: '#eee', color: '#777' };
    }
  };

  if (loading && orders.length === 0) {
    return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Orders Management
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F4F6F8' }}>
              <TableCell sx={{ fontWeight: 700, color: '#2C3E50' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2C3E50' }}>Books</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2C3E50' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2C3E50' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2C3E50' }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order: Order) => (
              <TableRow key={order.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={600}> {order.user?.firstName} {order.user?.lastName}</Typography>
                    <Typography variant="caption" color="text.secondary">{order.user?.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    {order.orderItems?.map((item: any) => (
                      <Typography key={item.id}>
                        {item.book?.title} (x{item?.quantity})
                      </Typography>
                    ))}
                    </Stack>
                </TableCell>
                <TableCell sx={{ fontSize: 13, color: '#777' }}>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#393280' }}>
                  {order.total?.toFixed(2)} EGP
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                     value={order.status?.toLowerCase()}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      sx={{
                        height: 32,
                        fontSize: 12,
                        fontWeight: 700,
                        bgcolor: getStatusColor(order.status).bg,
                        color: getStatusColor(order.status).color,
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiSelect-icon': { color: getStatusColor(order.status).color }
                      }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
