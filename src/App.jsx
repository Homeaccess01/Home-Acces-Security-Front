import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./containers/auth/Login.jsx";
import Dashboard from "./containers/Dashboard.jsx";
import useAuth from "./hooks/authHook";
import {
  ConnectedPublicRoute,
  ConnectedSuperadminRoute,
} from "./utils/ProtectedRoute";
import TowersPage from './containers/admin/tower/TowersPage.jsx';
import CreateTowerPage from './containers/admin/tower/CreateTowerPage.jsx';
import EditTowerPage from './containers/admin/tower/EditTowerPage.jsx';
import ApartmentsPage from './containers/admin/apartment/ApartmentsPage.jsx';
import CreateAparmentPage from './containers/admin/apartment/CreateAparmentPage.jsx';
import EditApartmentPage from './containers/admin/apartment/EditApartmentPage.jsx';
import PersonPage from './containers/admin/person/PersonPage.jsx';
import CreatePersonPage from './containers/admin/person/CreatePersonPage.jsx';
import EditPersonPage from './containers/admin/person/EditPersonPage.jsx';

function App() {
  const { loadUser } = useAuth();

  React.useEffect(() => { loadUser(); }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<ConnectedPublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ConnectedSuperadminRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Torres */}
          <Route path="/dashboard/towers" element={<TowersPage />} />
          <Route path="/dashboard/towers/create" element={<CreateTowerPage />} />
          <Route path="/dashboard/towers/:id/edit" element={<EditTowerPage />} />

          {/* Apartamentos */}
          <Route path="/dashboard/apartments" element={<ApartmentsPage />} />
          <Route path="/dashboard/apartments/create" element={<CreateAparmentPage />} />
          <Route path="/dashboard/apartments/:id/edit" element={<EditApartmentPage />} />

          {/* Personas */}
          <Route path="/dashboard/people" element={<PersonPage />} />
          <Route path="/dashboard/people/create" element={<CreatePersonPage />} />
          <Route path="/dashboard/people/:id/edit" element={<EditPersonPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>Error 404</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
