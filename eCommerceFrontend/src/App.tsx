import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import NonAuthenticatedRoute from "./components/security/NonAuthenticatedRoute";
import SignUp from "./components/SignUp";
import AuthenticatedRoute from "./components/security/AuthenticatedRoute";
import Logout from "./components/Logout";
import Error from "./components/Error";
import AdminRoute from "./components/security/AdminRoute";
import Footer from "./components/Footer";
import MainPage from "./components/MainPage";
import AdminMain from "./components/admin_pages/AdminMain";
import AdminCategories from "./components/admin_pages/AdminCategories";
import AdminProducts from "./components/admin_pages/AdminProducts";
import AdminCategoryUpdate from "./components/admin_pages/AdminCategoryUpdate";
import AdminProductUpdate from "./components/admin_pages/AdminProductUpdate";
import AdminOrders from "./components/admin_pages/AdminOrders";
import AdminUsers from "./components/admin_pages/AdminUsers";
import Cart from "./components/user_pages/Cart";
import Wishlist from "./components/user_pages/Wishlist";
import Checkout from "./components/user_pages/Checkout";
import Profile from "./components/user_pages/Profile";
import Orders from "./components/user_pages/Orders";
import OrderDetailed from "./components/user_pages/OrderDetailed";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import ProductsByCategory from "./components/ProductsByCategory";
import ProductsBySearch from "./components/ProductsBySearch";
import ProductDetailed from "./components/ProductDetailed";

const App: React.FC = () => {
  return (
    <div className="App">
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/not-authorized"
            element={
              <Error
                message="You are NOT AUTHORIZED to see this page."
                status={403}
              />
            }
          />
          <Route
            path="/bad-request"
            element={
              <Error
                message="BAD REQUEST, you couldn't give what system wants :("
                status={400}
              />
            }
          />
          <Route
            path="/server-error"
            element={<Error message="It's not you it's us :(" status={500} />}
          />
          <Route
            path="*"
            element={
              <Error
                message="The page you want to reach NOT FOUND."
                status={404}
              />
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/categories/:categoryId/products" element={<ProductsByCategory />} />
          <Route path="/products/search" element={<ProductsBySearch />} />
          <Route path="/products/:productId" element={<ProductDetailed />} />
          //! Non-Logged User Routes
          <Route
            path="/login"
            element={
              <NonAuthenticatedRoute>
                <Login />
              </NonAuthenticatedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <NonAuthenticatedRoute>
                <SignUp />
              </NonAuthenticatedRoute>
            }
          />
          //! Logged User Routes
          <Route
            path="/logout"
            element={
              <AuthenticatedRoute>
                <Logout />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <AuthenticatedRoute>
                <Cart />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <AuthenticatedRoute>
                <Checkout />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <AuthenticatedRoute>
                <Wishlist />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/profile/orders"
            element={
              <AuthenticatedRoute>
                <Orders />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/profile/orders/:orderId"
            element={
              <AuthenticatedRoute>
                <OrderDetailed />
              </AuthenticatedRoute>
            }
          />
          //! Admin Routes
          <Route
            path="/administrator"
            element={
              <AdminRoute>
                <AdminMain />
              </AdminRoute>
            }
          />
          <Route
            path="/administrator/categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />
          <Route
            path="/administrator/categories/:categoryId"
            element={
              <AdminRoute>
                <AdminCategoryUpdate />
              </AdminRoute>
            }
          />
          <Route
            path="/administrator/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/administrator/products/:productId"
            element={
              <AdminRoute>
                <AdminProductUpdate />
              </AdminRoute>
            }
          />
          <Route
            path="/administrator/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/administrator/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
