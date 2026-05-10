
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AuthLayout from './Modules/Shared/Components/AuthLayout/AuthLayout'
import NotFound from './Modules/Shared/Components/NotFound/NotFound'
import Login from './Modules/AuthModule/Components/Login/Login'
import Register from './Modules/AuthModule/Components/Register/Register'
import ForgetPassword from './Modules/AuthModule/Components/ForgetPassword/ForgetPassword'
import ResetPassword from './Modules/AuthModule/Components/ResetPassword/ResetPassword'
import ChangePassword from './Modules/AuthModule/Components/ChangePassword/ChangePassword'
import MasterLayout from './Modules/Shared/Components/MasterLayout/MasterLayout'
import Home from './Modules/Customer/HomeModule/Components/Home/Home'
import Categories from './Modules/Customer/HomeModule/Components/Categories/Categories'
import Cart from './Modules/Customer/CartModule/Components/Cart/Cart'
import Profile from './Modules/Shared/Components/Profile/Profile'
import OrderConfirmation from './Modules/Customer/CartModule/Components/OrderConfirmation/OrderConfirmation'
import { ToastContainer } from 'react-toastify'
import Books from './Modules/Customer/BookModule/Components/Books/Books'
import BookDetails from './Modules/Customer/BookModule/Components/BookDetails/BookDetails'
import WhisList from './Modules/Customer/HomeModule/Components/WishList/WhisList'
// Admin Imports
import AdminLayout from './Modules/Shared/Components/AdminLayout/AdminLayout'
import AdminHome from './Modules/Admin/AdminHomeModule/Components/AdminHome/AdminHome'
import Users from './Modules/Admin/UsersModule/Components/Users/Users'
import Admins from './Modules/Admin/AdminModule/Components/Admins/Admins'
import AdminBooks from './Modules/Admin/AdminBooksModule/Components/AdminBooks/AdminBooks'
import AdminBookDetails from './Modules/Admin/AdminBooksModule/Components/AdminBookDetails/AdminBookDetails'
import AdminCategories from './Modules/Admin/CategoriesModule/Components/Categories/AdminCategories'
import AdminOrders from './Modules/Admin/AdminOrdersModule/Components/AdminOrders/AdminOrders'
import { CategoriesProvider } from './Contexts/CategoriesContext'
import ProtectedRoutes from './ProtectedRoutes/ProtectedRoutes'

function App() {

  const routes = createBrowserRouter([
    {
      path: '/',
      element: <AuthLayout/>,
      errorElement: <NotFound/>,
      children:[
        {index: true , element: <Login/>},
        {path: 'login' , element: <Login/>},
        {path: 'register' , element: <Register/>},
        {path: 'forget' , element: <ForgetPassword/>},
        {path: 'reset' , element: <ResetPassword/>},
        {path: 'change' , element: <ChangePassword/>}
      ]
    },
    {
      path: 'dashboard',
      element: <ProtectedRoutes allowedRoles={['user']}><MasterLayout/></ProtectedRoutes>,
      errorElement: <NotFound/>,
      children: [
        {index: true , element: <Home/>},
        {path: 'home' , element: <Home/>},
        {
          path: 'books',
          children: [
            {index: true , element: <Books/>},
            {path: ':bookId' , element: <BookDetails/>}
          ]
        },
        {path: 'categories' , element: <Categories/>},
        {
          path: 'cart' , 
          children: [
            {index:true , element: <Cart/>},
            {path: 'confirmation' , element: <OrderConfirmation/>},
          ]
        },
        {path: 'profile' , element: <Profile/>},
        {path: 'wishlist' , element: <WhisList/>},
      ]
    },
    // ── Admin Routes ──────────────────────────────────────────────────────
    {
      path: 'admin',
      element: <ProtectedRoutes allowedRoles={['admin']}><AdminLayout /></ProtectedRoutes>,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <AdminHome /> },
        { path: 'home', element: <AdminHome /> },
        { path: 'users', element: <Users /> },
        { path: 'admins', element: <Admins /> },
        { 
          path: 'books', 
          children: [
            { index: true, element: <AdminBooks /> },
            { path: ':bookId', element: <AdminBookDetails /> },
          ]
        },
        { path: 'categories', element: <AdminCategories /> },
        { path: 'orders', element: <AdminOrders /> },
        { path: 'profile', element: <Profile /> },
      ]
    }
  ])

  return (
    <>
      <ToastContainer />
      <CategoriesProvider><RouterProvider router={routes} /></CategoriesProvider>
    </>
  )
}

export default App
