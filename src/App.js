import React from 'react'
// import CategoriaTable from './components/CategoriaTable'
// import Categoria from './components/Categoria'  
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import VerArticulos from './components/verArticulos'
//import articulosTable from './components/articulosTable'

const App = () => {
  return (
    <div className='container'>
      <h1 className='text-center'>Cosumir Api-Book  Spring Boot y React</h1>
      <h3 className='text-center py-3'>Muestra Listado de Articulo</h3>
      
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VerArticulos />} />
        </Routes>
      </BrowserRouter>


    </div>
  )
}

export default App
