import {BrowserRouter,Routes,Route,useLocation} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Product from './pages/Product.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Story from './pages/Story.jsx'
import About from './pages/About.jsx'
import Profile from './pages/Profile.jsx'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} /> 
        <Route path="/product/detail/:id" element={<ProductDetail />} />
        <Route path="/story" element={<Story />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
