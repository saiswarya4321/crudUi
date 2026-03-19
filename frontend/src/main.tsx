import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '../src/App'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import TaskDetails from './taskDetails'
import AddTask from './pages/addTask'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UpdateTask from './updateTask'
import SignUp from './pages/signUp'
import Login from '../src/pages/login'
import Dashboard from './pages/dashboard'
import List from '../src/pages/List'
import ProtectedRoute from './components/ProtectedRoute'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<ProtectedRoute><App/></ProtectedRoute>}></Route>
      <Route path='/task/:id' element={<ProtectedRoute><TaskDetails/></ProtectedRoute>}></Route>
      <Route path='/addtask' element={<ProtectedRoute><AddTask/></ProtectedRoute>}></Route>
      <Route path='/update/:id' element={<ProtectedRoute><UpdateTask/></ProtectedRoute>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
       <Route path='/list' element={<ProtectedRoute><List/></ProtectedRoute>}></Route>
    </Routes>
    </BrowserRouter>
    <ToastContainer />
  </StrictMode>,
)
