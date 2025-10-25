import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, NotFound, Login, SignUp, FindCaregiver, About } from '@pages';
import MainLayout from '@components/layout/MainLayout';
import { ROUTES } from '@constants';

// App Routes
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<SignUp />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* Add more routes here */}
          <Route path={ROUTES.FIND_CAREGIVER} element={<FindCaregiver />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
