/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, IconButton, Tooltip, CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetAllUsers, DeleteUser } from '../../../../../Api/modules/users';
import { toast } from 'react-toastify';
import { decodeJwt, getStoredToken } from '../../../../../utils/jwtHelper';

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

const avatarColors = ['#F5A623', '#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#1abc9c', '#e67e22'];

const isAdmin = (u: any): boolean => {
  const role = (u.role || u.userRole || u.type || u.userType || u.authority || '')
    .toString().toLowerCase();
  return role === 'admin' || role === 'administrator' || role === 'role_admin';
};

export default function Users() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ جيب بيانات الـ current admin من الـ JWT — عشان نحذفه من قائمة الـ users
  const token = getStoredToken();
  const tokenPayload = token ? decodeJwt(token) : null;
  const currentAdminEmail: string | null = tokenPayload?.sub || tokenPayload?.email || null;
  const currentAdminId: number | null = tokenPayload?.userId || tokenPayload?.id || null;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await GetAllUsers();
      const list: any[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.users || res.data?.items || [];

      // ─── Step 1: هل الـ response فيه role field؟
      const hasRole = list.some((u) => u.role || u.userRole || u.type || u.userType || u.authority);
      if (hasRole) {
        setUsersList(list.filter((u) => !isAdmin(u)));
        return;
      }

      // ─── Step 2: مفيش role — استبعد الـ current admin بالـ email/id من الـ JWT
      // ✅ كل user مش بيتطابق مع الـ admin الـ logged-in يتعرض كـ user
      const withoutCurrentAdmin = list.filter((u) => {
        const emailMatch = currentAdminEmail && u.email?.toLowerCase() === currentAdminEmail.toLowerCase();
        const idMatch = currentAdminId && Number(u.id) === Number(currentAdminId);
        return !(emailMatch || idMatch); // استبعد الـ current admin
      });

      setUsersList(withoutCurrentAdmin);
    } catch (err) {
      console.error('Failed to load users', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await DeleteUser(id);
      toast.success('User deleted successfully!');
      loadUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Users List
        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({usersList.length})
        </Typography>
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F4F6F8' }}>
              {['#', 'Avatar', 'First Name', 'Last Name', 'Email', 'Phone', 'Actions'].map((col) => (
                <TableCell key={col} sx={{ fontWeight: 700, color: '#2C3E50', fontSize: 13 }}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#888' }}>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              usersList.map((user: any, index: number) => (
                <TableRow key={user.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell sx={{ color: '#555', fontSize: 13 }}>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      src={user.img || user.image || user.imagePath}
                      sx={{ bgcolor: avatarColors[index % avatarColors.length], width: 38, height: 38, fontSize: 14, fontWeight: 700 }}
                    >
                      {!(user.img || user.image || user.imagePath) && getInitials(user.firstName, user.lastName)}
                    </Avatar>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{user.firstName}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{user.lastName}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{user.email}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete User">
                      <IconButton size="small" sx={{ color: '#e74c3c' }} onClick={() => handleDelete(user.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
