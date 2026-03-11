import { BrowserRouter , Routes , Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from "./components/protectedRoute"
import PublicRoute from "./components/publicRoute"
import SelectRole from "./pages/SelectRole"
import Navbar from "./components/navbar"
import Account from "./pages/Account"
import { useAppData } from "./context/AppContext"
import Restaurant from "./pages/Restaurant"


const App = () => {

  const {user} = useAppData() 
  if(user && user.role === "seller"){
      return <Restaurant /> ;
  }
  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route element={<PublicRoute />}>
             <Route path="/login" element={<Login/>} />
          </Route>
          <Route element={<ProtectedRoute/>}>
             <Route path="/" element={<Home/>} />
             <Route path="/select-role" element={<SelectRole/>}/>
             <Route path="/account" element={<Account/>}/>
          </Route>
        </Routes>
        <Toaster/>
      </BrowserRouter>
    </>
  )
}

export default App
