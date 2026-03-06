import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Consertos from './pages/Consertos'
import Fundos from './pages/Fundos'
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
      <Route path="/seed" element={<Seed />} />
    </Routes>
  )
}

export default App
