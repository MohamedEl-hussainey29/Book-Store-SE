/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../Contexts/AuthContext';
import { UpdateUserProfile } from '../../../../Api/modules/users';
import { AuthAPI } from '../../../../Api';
import axiosClient from '../../../../Api/axiosClient';

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  description: string | null;
  categoryName: string;
  image: string | null;
  price: number;
  quantity: number;
  status: string;
  date: string;
}

interface OrderItem {
  id: number;
  book: Book;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: number;
  userId: number;
  date: string;
  status: string;
  total: number;
  orderItems: OrderItem[];
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  img: string;
  role: string;
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

const OrderRow = ({ order }: { order: Order }) => (
  <TableRow key={order.id} hover sx={{ '&:last-child td': { border: 0 } }}>
    <TableCell sx={{ color: '#555' }}>
      <Stack spacing={0.5}>
        {order.orderItems.map((item) => (
          <Typography key={item.id} variant="body2" fontWeight={500}>
            • {item.book.title} (x{item.quantity})
          </Typography>
        ))}
      </Stack>
    </TableCell>
    <TableCell sx={{ color: '#777' }}>{order.date}</TableCell>
    <TableCell>
      <Chip
        label={order.status}
        size="small"
        sx={{
          bgcolor: order.status === 'shipped' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(241, 196, 15, 0.1)',
          color: order.status === 'shipped' ? '#27ae60' : '#f39c12',
          fontWeight: 700,
          borderRadius: '6px'
        }}
      />
    </TableCell>
    <TableCell align="right" sx={{ fontWeight: 700, color: '#393280' }}>
      {order.total.toFixed(2)} EGP
    </TableCell>
  </TableRow>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <Grid size={{ xs: 12, md: 6 }}>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  </Grid>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Profile() {
  const location = useLocation();
  const {userData , setUserData}:any = useContext(AuthContext);

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [resetPassOpen, setResetPassOpen] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isInsideAdmin = location.pathname.includes('/admin');
  const isCustomer = userData?.role?.toLowerCase() === 'customer' ||
    userData?.role?.toLowerCase() === 'user' ||
    location.pathname.includes('/dashboard/');

  const fetchUserFromAPI = async (userId: number) => {
    try {
      const res = await axiosClient.get(`/users/${userId}`);
      const u = res.data;
      setProfileData({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        phone: u.phoneNumber || '',
        img: u.image || u.img || '',
        role: u.role || (isInsideAdmin ? 'Admin' : 'User'),
      });
      if (u.image || u.img) {
        setProfileImg(u.image || u.img);
      }
    } catch {
      loadFromJWT();
    }
  };

  const loadFromJWT = () => {
    const detectedRole = userData?.role || (isInsideAdmin ? 'Admin' : 'User');
    const firstName = userData?.firstName || userData?.name?.split(' ')[0] || '';
    const lastName = userData?.lastName || userData?.name?.split(' ').slice(1).join(' ') || '';
    const email = userData?.sub || userData?.email || '';
    const phone = userData?.phoneNumber || '';
    const img = userData?.image || '';

    setProfileData({ firstName, lastName, email, phone, img, role: detectedRole });
    if (img) setProfileImg(img);
  };

  useEffect(() => {
    const userId = userData?.id || userData?.userId;
    if (userId) {
      fetchUserFromAPI(Number(userId));
    } else {
      loadFromJWT();
    }

    if (isCustomer) {
      const custId = userData?.id || userData?.userId;
      if (custId) {
        axiosClient.get(`/orders/user/${custId}`)
          .then(res => {
            const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
            setOrders(list);
          })
          .catch(() => setOrders([]));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const { register: profileReg, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm<ProfileFormValues>();
  const { register: passReg, handleSubmit: handlePassSubmit, reset: resetPass } = useForm<PasswordFormValues>();

  useEffect(() => {
    if (profileData) {
      resetProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        
      });
    }
  }, [profileData, resetProfile]);

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('phoneNumber', data.phone);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const userId = userData?.id || userData?.userId;
      if (userId) {
        const response = await UpdateUserProfile(Number(userId), formData);
        setUserData({
          ...response?.data,
          imageVersion: Date.now(),
        });

        setProfileData(prev => prev ? {
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        } : prev);


        toast.success('Profile updated successfully!');
        setEditOpen(false);
        setSelectedFile(null);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to update profile';
      toast.error(msg);
    }
  };

  const handlePasswordChange = async (data: PasswordFormValues) => {
    try {

      if (data.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      const userId = userData?.id || userData?.userId;

      if (userId) {
        await AuthAPI.ChangePassword(Number(userId), {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        });

        toast.success('Password changed successfully!');
        setResetPassOpen(false);
        resetPass();
      }

    } catch (error: any) {

      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to change password';

      toast.error(msg);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (!profileData?.firstName) return 'U';
    return `${profileData.firstName[0]}${profileData.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Banner */}
      <Box sx={{ height: '200px', background: 'linear-gradient(135deg, #393280 0%, #ED553B 100%)', borderRadius: '0 0 24px 24px' }} />

      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #eee', mb: 4 }}>
          {/* Header */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ xs: 'center', md: 'flex-end' }} sx={{ mb: 6 }}>
            <Box sx={{ position: 'relative', mt: -10 }}>
              <Avatar src={`/api/images/users/${profileImg}`} sx={{ width: 160, height: 160, bgcolor: '#ED553B', fontSize: 48, fontWeight: 700, border: '6px solid #fff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                {!profileImg && getInitials()}
              </Avatar>
              <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
            </Box>

            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" fontWeight={700} color="#393280" gutterBottom>
                {profileData ? `${profileData.firstName} ${profileData.lastName}` : (userData?.name || 'User Name')}
              </Typography>
              <Chip label={profileData?.role?.toUpperCase() || 'USER'} sx={{ bgcolor: '#393280', color: '#fff', fontWeight: 600 }} />
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<LockResetIcon />} onClick={() => setResetPassOpen(true)} sx={{ color: '#393280', borderColor: '#393280' }}>
                Change Password
              </Button>
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditOpen(true)} sx={{ bgcolor: '#ED553B', '&:hover': { bgcolor: '#d94a2f' } }}>
                Edit Profile
              </Button>
            </Stack>
          </Stack>

          {/* Info Section */}
          <Typography variant="h6" fontWeight={700} color="#393280" mb={3} borderBottom="2px solid #f0f0f0" pb={1}>
            Personal Information
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <InfoItem label="Full Name" value={`${profileData?.firstName || ''} ${profileData?.lastName || ''}`} />
            <InfoItem label="Email Address" value={profileData?.email || ''} />
            <InfoItem label="Phone Number" value={profileData?.phone || 'Not set'} />
          </Grid>
        </Paper>

        {/* Orders Section */}
        {isCustomer && orders.length > 0 && (
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #eee' }}>
            <Typography variant="h6" fontWeight={700} color="#393280" mb={3} borderBottom="2px solid #f0f0f0" pb={1}>
              Recent Orders
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#393280' }}>Books</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#393280' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#393280' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#393280' }} align="right">Total Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => <OrderRow key={order.id} order={order} />)}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #eee', px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>Edit Profile Information</Typography>
          <IconButton onClick={() => setEditOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar src={profileImg || ''} sx={{ width: 100, height: 100, mx: 'auto', bgcolor: '#ED553B' }}>
                {!profileImg && getInitials()}
              </Avatar>
              <Button size="small" onClick={() => fileInputRef.current?.click()} sx={{ mt: 1, color: '#393280' }}>
                Change Photo
              </Button>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="First Name"
                  fullWidth
                  {...profileReg('firstName', { required: 'First name is required' })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Last Name"
                  fullWidth
                  {...profileReg('lastName', { required: 'Last name is required' })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Email Address"
                  fullWidth
                  disabled
                  value={profileData?.email || ''}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  {...profileReg('phone', { required: 'Phone number is required' })}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleProfileSubmit(handleProfileUpdate)}
            sx={{ bgcolor: '#393280', '&:hover': { bgcolor: '#2a2560' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={resetPassOpen} onClose={() => setResetPassOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handlePassSubmit(handlePasswordChange)}>
          <DialogTitle
            sx={{
              borderBottom: '1px solid #eee',
              px: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Reset Password
            </Typography>

            <IconButton onClick={() => setResetPassOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3, mt: 1 }}>
            <Stack spacing={3}>
              <TextField
                label="Old Password"
                type="password"
                fullWidth
                {...passReg('oldPassword')}
              />

              <TextField
                label="New Password"
                type="password"
                fullWidth
                {...passReg('newPassword')}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setResetPassOpen(false)}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#ED553B',
                '&:hover': { bgcolor: '#d94a2f' }
              }}
            >
              Update Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
