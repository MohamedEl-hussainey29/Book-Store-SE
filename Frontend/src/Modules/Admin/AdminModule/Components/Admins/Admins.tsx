/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, IconButton, Tooltip, Button, CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminForm, { type AdminFormValues } from '../AddAdmin/AddAdmin';
import { CreateAdmin } from '../../../../../Api/modules/admins';
import { toast } from 'react-toastify';
import axiosClient from '../../../../../Api/axiosClient';
import { DeleteUser, GetAllUsers } from '../../../../../Api/modules/users';

const getInitials = (first: string, last: string) =>
  `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();

const avatarColors = ['#F5A623', '#3498db', '#2ecc71', '#9b59b6', '#e74c3c'];

export default function Admins() {
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await GetAllUsers();
      const list: any[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.users || [];

      const hasRoles = list.some((u) => u.role);

      if (hasRoles) {
        const admins = list.filter((u) => {
          const role = u.role?.toLowerCase();
          return role === 'admin' || role === 'administrator';
        });
        setAdminsList(admins);
      } else {
        // ✅ جيب الـ role من كل user بالـ ID
        const detailed = await Promise.all(
          list.map(async (u) => {
            try {
              const r = await axiosClient.get(`/users/${u.id}`);
              return { ...u, ...r.data };
            } catch {
              return u;
            }
          })
        );
        const hasRolesNow = detailed.some((u) => u.role);
        const admins = hasRolesNow
          ? detailed.filter((u) => {
              const role = u.role?.toLowerCase();
              return role === 'admin' || role === 'administrator';
            })
          : detailed; // fallback — اعرض الكل لو مفيش role في أي endpoint
        setAdminsList(admins);
      }
    } catch (err) {
      console.error('Failed to load admins', err);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await DeleteUser(id);
        toast.success('Admin deleted successfully!');
        loadAdmins();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete admin');
      }
    }
  };

  const handleAdd = async (data: AdminFormValues) => {
    try {
      await CreateAdmin({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
      });
      toast.success('Admin created successfully!');
      loadAdmins();
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create admin');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading admins...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Admins List
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({adminsList.length})
          </Typography>
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#ED553B', '&:hover': { bgcolor: '#d94a2f' }, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
        >
          Add New Admin
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F4F6F8' }}>
              {['#', 'Avatar', 'First Name', 'Last Name', 'Email', 'Phone', 'Actions'].map((col) => (
                <TableCell key={col} sx={{ fontWeight: 700, color: '#2C3E50', fontSize: 13 }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {adminsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#888' }}>
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              adminsList.map((admin: any, index: number) => (
                <TableRow key={admin.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell sx={{ fontSize: 13 }}>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      src={admin.img || admin.image}
                      sx={{ bgcolor: avatarColors[index % avatarColors.length], width: 38, height: 38, fontSize: 14, fontWeight: 700 }}
                    >
                      {!(admin.img || admin.image) && getInitials(admin.firstName, admin.lastName)}
                    </Avatar>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{admin.firstName}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{admin.lastName}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{admin.email}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{admin.phoneNumber}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton size="small" sx={{ color: '#ED553B' }} onClick={() => handleDelete(admin.id)}>
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

      <AdminForm open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmitAction={handleAdd} title="Add New Admin" />
    </Box>
  );
}
