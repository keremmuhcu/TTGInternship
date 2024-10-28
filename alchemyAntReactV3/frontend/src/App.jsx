import {Routes, Route} from 'react-router-dom'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Index from './pages/Index'
import Basket from './pages/Basket'

const App = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Index/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/basket' element={<Basket/>}/>
            <Route path='*' element={<NotFound/>}/>
        </Routes>
    </div>
  )
}

export default App