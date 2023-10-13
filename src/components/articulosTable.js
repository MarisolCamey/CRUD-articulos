import React,{useEffect,useState} from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'

const baseUrl = 'http://localhost:9900/api/v1/articulos'
const ArticulosTable = () => {
    const[articulos,setArticulos]=useState([])
    const[search,setSearch]=useState('')
    const[filteredArticulos,setFilteredArticulos]=useState([])
    const obtenerArticulos=async()=>{
        try {
            const response=await axios.get(baseUrl)
            setArticulos(response.data.articuloResponse.articulos)
        }catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        const resul = articulos.filter((articulo) => {
            return articulo.nombre.toLowerCase().match(search.toLowerCase());
        });
        setFilteredArticulos(resul);
        },[search,articulos])
    useEffect(()=>{
        obtenerArticulos()
    },[])

    //definir las columnas DataTable
    const columns=[
        {
            name:'Id',
            selector: row => row.clave_articulo,
            sortable:true
        },
        {
            name:'Nombre',
            selector: row => row.nombre,
            sortable:true
        },
        {
            name:'Precio',
            selector: row => row.precio,
            sortable:true
        },   
        {
            name: 'Acciones',
            cell: row =>(
                <div className='d-flex justify-content-center'>
                    <button className='btn btn-warning'>Editar</button>
                    <button className='btn btn-danger ms-2' >Eliminar</button>
                </div>
            )
        }

    ]

  return (
    <div>
        <h3 className='text-center'>Muestra Listado de Articulo</h3>
         <div className='d-flex justify-content-end'>
            <button className='btn btn-primary'> Agregar </button>
         </div>

        <DataTable
            columns={columns}
            data={filteredArticulos}
            pagination
            paginationComponentOptions={{rowsPerPageText:'Filas por pagina',rangeSeparatorText:'de'}}
            fixedHeader
            fixedHeaderScrollHeight='600px'
            highlightOnHover
            subHeader
            subHeaderComponent={
                <input
                    type='text'
                    placeholder='Buscar Articulo'
                    className='w-25 form-control'
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}

                    />
                    
            }
        
        />
      
    </div>
  )
}

export default ArticulosTable
