/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import { useContext, useMemo } from 'react';
import { AuthContext } from '../../../../../Contexts/AuthContext';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

import { useFetch } from '../../../../../Hooks/useFetch';
import { GetAllOrders, GetStatistics, GetOrdersChartData, GetLoginStats } from '../../../../../Api/modules/admins';
import { GetBooks } from '../../../../../Api/modules/books';
import { GetAllUsers } from '../../../../../Api/modules/users';

export default function AdminHome() {
  const authContext = useContext(AuthContext);
  const userData = authContext?.userData;
  const adminName = userData?.firstName || userData?.name?.split(' ')[0] || "Admin";

  // ✅ جيب من الـ APIs الشغالة
  const { data: usersData, loading: usersLoading } = useFetch(GetAllUsers);
  const { data: ordersData, loading: ordersLoading } = useFetch(GetAllOrders);
  const { data: booksData, loading: booksLoading } = useFetch(GetBooks);

  // ✅ جرب تجيب الـ statistics العادية برضو (ممكن تشتغل لو الـ backend اتصلح)
  const { data: statsData } = useFetch(GetStatistics);
  const { loading: chartLoading } = useFetch(GetOrdersChartData);
  const { data: loginStatsData, loading: loginsLoading } = useFetch(GetLoginStats);

  // ✅ احسب الـ stats من الـ data الموجودة لو الـ /admin/statistics فاشل
  const usersList = Array.isArray(usersData) ? usersData : (usersData as any)?.data || [];
  const ordersList = Array.isArray(ordersData) ? ordersData : (ordersData as any)?.data || [];
  const booksList = Array.isArray(booksData) ? booksData : (booksData as any)?.data || [];

  const totalUsers = statsData?.totalUsers ?? statsData?.usersCount ?? usersList.filter((u: any) => {
    const role = u.role?.toLowerCase();
    return !role || role === 'user' || role === 'customer';
  }).length;

  const totalAdmins = statsData?.totalAdmins ?? statsData?.adminsCount ?? usersList.filter((u: any) => {
    const role = u.role?.toLowerCase();
    return role === 'admin' || role === 'administrator';
  }).length;

  const totalBooks = statsData?.totalBooks ?? statsData?.booksCount ?? booksList.length;
  const totalOrders = statsData?.totalOrders ?? statsData?.ordersCount ?? ordersList.length;

  const isLoading = usersLoading || ordersLoading || booksLoading || chartLoading || loginsLoading;

  // ✅ بيانات الـ Pie Chart للـ Orders
 const pieData = useMemo(() => {
  const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dayCounts: Record<string, number> = {
    'Sun': 0,
    'Mon': 0,
    'Tue': 0,
    'Wed': 0,
    'Thu': 0,
    'Fri': 0,
    'Sat': 0
  };

  const orders = Array.isArray(ordersData)
    ? ordersData
    : (ordersData as any)?.data || [];

  if (orders.length > 0) {
    orders.forEach((order: any) => {
      const dateStr =
        order.createdAt ||
        order.date ||
        order.creationDate;

      if (dateStr) {
        const d = new Date(dateStr);

        if (!isNaN(d.getTime())) {
          const dayName = daysOrder[d.getDay()];
          dayCounts[dayName]++;
        }
      }
    });
  }

  const sortedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return sortedDays.map(day => ({
    name: day,
    value: dayCounts[day]
  }));
}, [ordersData]);

  // ✅ بيانات الـ Line Chart للـ Login Statistics (Visits) - دائماً 7 أيام
  const visitsChartData = useMemo(() => {
    const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // 1. عمل Template بـ 7 أيام وقيمهم 0
    const template: Record<string, number> = {
      'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
    };

    // 2. دمج بيانات الـ API في الـ Template
    const rawData = loginStatsData?.data || loginStatsData || {};
    Object.entries(rawData).forEach(([date, count]) => {
      const d = new Date(date);
      const dayName = dayNames[d.getDay()];
      if (template[dayName] !== undefined) {
        template[dayName] += Number(count);
      }
    });

    // 3. تحويل الـ Template لـ Array مرتب حسب أيام الأسبوع
    return daysOrder.map(day => ({
      date: day,
      visits: template[day]
    }));
  }, [loginStatsData]);

  const PIE_COLORS = ['#2ecc71', '#e74c3c', '#F5A623', '#3498db', '#9b59b6', '#6a2784', '#34495e'];

  const statsCards = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 36, color: '#e74c3c' }} />,
      bg: '#FDF0EE',
    },
    {
      label: 'Total Admins',
      value: totalAdmins,
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 36, color: '#F5A623' }} />,
      bg: '#FEF8EE',
    },
    {
      label: 'Total Books',
      value: totalBooks,
      icon: <MenuBookIcon sx={{ fontSize: 36, color: '#3498db' }} />,
      bg: '#EEF4FD',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingCartIcon sx={{ fontSize: 36, color: '#2ecc71' }} />,
      bg: '#EEF9F2',
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" color="text.secondary">Loading dashboard data...</Typography>
      </Box>
    );
  }

  const hasPieData = pieData.some(d => d.value > 0);
  const hasVisitsData = visitsChartData.length > 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Greeting */}
      <Typography variant="h5" fontWeight={700} mb={3} sx={{ fontStyle: 'italic' }}>
        Hello,{' '}
        <Typography component="span" color="#F5A623" fontStyle="italic" fontSize="inherit" fontWeight="inherit">
          {adminName}!
        </Typography>
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={4}>
        {statsCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: card.bg,
                borderRadius: 3,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              {card.icon}
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Pie Chart — Orders Last 7 Days */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={3}>
              Orders Last 7 Days
            </Typography>
            {hasPieData ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    labelLine={true}
                    label={({ name, percent = 0, value }) => value > 0 ? `${name} ${(percent * 100).toFixed(0)}%`: ''}
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="square" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', textAlign: 'center' }}>
                <Typography variant="body2">No orders distribution data</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Line Chart — Last Visits */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #eee', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={3}>
              Last Visits
            </Typography>
            {hasVisitsData ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={visitsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={true} tickLine={true} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={true} tickLine={true} allowDecimals={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#F5A623" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#F5A623', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                <Typography variant="body2">No visits statistics available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
