import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Consertos from './pages/Consertos/Consertos'
import Fundos from './pages/Fundos/Fundos'
import Relatorios from './pages/Relatorios/Relatorios'
import Atas from './pages/Atas/Atas'
import AguaExtra from './pages/AguaExtra/AguaExtra'
import Regras from './pages/Regras/Regras'
import PrivateRoute from './components/PrivateRoute'
import Seed from './dev/Seed'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/consertos"
        element={
          <PrivateRoute>
            <Consertos />
          </PrivateRoute>
        }
      />
      <Route
        path="/fundos"
        element={
          <PrivateRoute>
            <Fundos />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <Relatorios />
          </PrivateRoute>
        }
      />
      <Route
        path="/atas"
        element={
          <PrivateRoute>
            <Atas />
          </PrivateRoute>
        }
      />
      <Route
        path="/agua-extra"
        element={
          <PrivateRoute>
            <AguaExtra />
          </PrivateRoute>
        }
      />
      <Route
        path="/regras"
        element={
          <PrivateRoute>
            <Regras />
          </PrivateRoute>
        }
      />
      <Route path="/seed" element={<Seed />} />
    </Routes>
  )
}

export default App
