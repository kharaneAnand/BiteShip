import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from './components/protetecRoute'
import PublicRoute from './components/publicRoute'
import SelectRole from './pages/SelectRole'
import Navbar from './components/navbar'
import Accounts from './pages/Accounts'
import { useAppData } from './context/AppContext'
import Restaurant from './pages/Restaurant'
import RestaurantPage from './pages/RestaurantPage'
import Cart from './pages/Cart'
import AddAddressPage from './pages/Address'
import CheckOut from './pages/CheckOut'
import PaymentSuccess from './pages/PaymentSuccess'
import OrderSuccess from './pages/ordersuccess'


const App = () => {

  const {user} = useAppData() ;

  if(user && user.role === "seller") {
    return <Restaurant/> ;
  }

  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route element={<PublicRoute/>}>
             <Route path='/login' element={<Login/>}/>
          </Route>
          <Route element={<ProtectedRoute/>}>
             <Route path='/' element={<Home/>}/>
             <Route path='/paymentsuccess/:paymentId' element={<PaymentSuccess/>}/>
             <Route path='/ordersuccess' element={<OrderSuccess/>}/>
             <Route path='/address' element={<AddAddressPage/>}/>
              <Route path='/checkOut' element={<CheckOut/>}/>
             <Route path='/restaurant/:id' element={<RestaurantPage/>}/>
             <Route path='/cart' element={<Cart/>}/>
             <Route path='/select-role' element={<SelectRole/>}/>
             <Route path='/account' element={<Accounts/>}/>
          </Route>
        </Routes>
        <Toaster/>
      </BrowserRouter>
    </>
  )
}

export default App
