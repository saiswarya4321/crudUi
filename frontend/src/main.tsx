import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '../src/App'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import TaskDetails from './taskDetails'
import AddTask from './addTask'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UpdateTask from './updateTask'
import SignUp from './signUp'
import Login from './login'
import Dashboard from './dashboard'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}></Route>
      <Route path='/task/:id' element={<TaskDetails/>}></Route>
      <Route path='/addtask' element={<AddTask/>}></Route>
      <Route path='/update/:id' element={<UpdateTask/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
    </Routes>
    </BrowserRouter>
    <ToastContainer />
  </StrictMode>,
)
