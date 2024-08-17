import { Route, Routes } from 'react-router-dom';
import './App.css'
import Header from './components/Header';
import Login from './components/Login';
import NonAuthenticatedRoute from './components/security/NonAuthenticatedRoute';
import SignUp from './components/SignUp';
import AuthenticatedRoute from './components/security/AuthenticatedRoute';
import Logout from './components/Logout';
import Error from './components/Error';
// import AdminRoute from './components/security/AdminRoute';
import Footer from './components/Footer';

const App : React.FC = () => {
  return (
    <div className="App">
      <div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <NonAuthenticatedRoute>
                <Login />
              </NonAuthenticatedRoute>
            }
          />
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
          <Route
            path="/logout"
            element={
              <AuthenticatedRoute>
                <Logout />
              </AuthenticatedRoute>
            }
          />
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
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App
