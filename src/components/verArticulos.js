import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../functions'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



const VerArticulos = () => {

 

  const url = 'http://localhost:9900/api/v1/articulos'

  const [articulos, setArticulos] = useState([]) 
  const [id, setId] = useState('')
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')

  const [operation, setOperation] = useState(1) 
  const [title, setTitle] = useState('')


  useEffect(() => {
    getArticulos()

  }, [])

  const getArticulos = async () => {
    try {
      debugger;
      const response = await axios.get(url)
      console.log(response);
      setArticulos(response.data.articuloResponse.articulos)
      console.log(response.data.articuloResponse.articulos)
    } catch (error) {
      console.log('Error al obtener los articulos ', error)
    }
  }

 
  const openModal = (op, id, name, precio) => { //op 1: Guardar, 2: Editar
  
    setNombre('')
    setPrecio('')
   // setFabricante('')
    setOperation(op)
    if (op === 1) {
      setTitle('Registrar Articulo')
    } else if (op === 2) {
      setTitle('Editar Articulo')
      setId(id)
      setNombre(name)
      setPrecio(precio)
     // setFabricante(fabricante)
    }

    window.setTimeout(() => {
      document.getElementById('nombre').focus()
    }, 500)

  }

  /*----------------------validar que los campos de formularios esten llenos para enviar solicitud------------------*/

  const validarCampos = () => {
    var parametros;
    var metodo;
    debugger;
    if (nombre.trim() === '') {
      show_alerta('Escribe el nombre del articulo', 'warning')
    }
    else if (precio.trim() === '') {
      show_alerta('Escribe el precio del producto', 'warning')
    }
 else {
      //Si los campos estan llenos se procede a enviar la solicitud

      if (operation === 1) {
        parametros = {
          nombre: nombre,
          precio: precio,
          //fabricante: fabricante
        }
        metodo = 'POST'
      }else{
        parametros = {
          id: id,
          nombre: nombre,
          precio: precio,
          //fabricante:fabricante
        }
        metodo = 'PUT'
      }
      enviarSolicitud( metodo,parametros)
    }
  }


  /*----------------------funcion para enviar la solicitud------------------*/

  const enviarSolicitud = async ( metodo,parametros) => {
     await axios({ method: metodo, url: url, data: parametros }).then(function (response) {
      let tipo = response.data[0]
      let mensaje = response.data[1]
      show_alerta(mensaje, tipo)


      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getArticulos()
      }

    })
      .catch(function (error) {
        show_alerta('Error al enviar la solicitud', 'error')
        console.log(error)
      })

  }

  /*----------------------funcion para eliminar un articulo------------------*/

  const eliminarArticulo = async (id,name) => {

     const MySwal = withReactContent(Swal)
     MySwal.fire({
      title: '¿Estas seguro de eliminar el articulo '+name+'?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(url+'/'+id).then(function (response) {
          let tipo = response.data[0] //success o error
          let mensaje = response.data[1] //mensaje de respuesta
          show_alerta(mensaje, tipo)
          getArticulos()
        })
          .catch(function (error) {
            show_alerta('Error al enviar la solicitud', 'error')
            console.log(error)
          })
      }
    })

  }


  return (
    <div className='App'>

      {/* Renderizar el boton Agregar Articulo */}
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalArticulo'>
                <i className="fa-solid fa-circle-plus"></i>Agregar Articulo</button>
            </div>
          </div>
        </div>

        {/* Renderizar la tabla de articulos */}

        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <div className='table-responsive'>
              <table className='table table-striped table-hover table-bordered'>
                <thead className='table-dark'>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {articulos.map((articulo) => (
                    <tr key={articulo.clave_articulo}>
                      <td>{articulo.clave_articulo}</td>
                      <td>{articulo.nombre}</td>
                      <td>{articulo.precio}</td> 
                     
                      <td>
                        <button onClick={() => openModal(2, articulo.id, articulo.nombre, articulo.precio)}
                          className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalArticulo'>
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        {' '}
                        <button onClick={()=>eliminarArticulo(articulo.id,articulo.nombre)} className='btn btn-danger'>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Renderizar el modal para agregar articulos */}
      <div id='modalArticulo' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>

            {/* cuerpo del Modal */}
            <div className='modal-body'>
              <input type='hidden' id='id'></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                <input
                  type='text'
                  id='nombre'
                  className='form-control'
                  placeholder='Nombre'
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                <input
                  type='text'
                  id='precio'
                  className='form-control'
                  placeholder='Precio'
                  value={precio}
                  onChange={e => setPrecio(e.target.value)}
                />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                <input
                  type='text'
                  id='fabricante'
                  className='form-control'
                  placeholder='Fabricante'
                 // value={fabricante}
                  //onChange={e => setFabricante(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
              
              </div>

              {/* button de Guardar */}
              <div className='d-grid col-6  mx-auto'>
                <button onClick={()=>validarCampos()} className='btn btn-success' type='button' id='btnGuardar'>
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
              {/* pie del Modal */}

              <div className='modal-footer'>
                <button id ='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                  <i className="fa-solid fa-window-close"></i> Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerArticulos
