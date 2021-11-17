import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {isEmpty, size} from 'lodash';
import {addDocument, deleteDocument, getCollection, updateDocument} from './Actions';
export default function App(){
  const [task, setTask]=useState("")
  const [encargado, setEncargado]=useState("");
  const [correo, setCorreo]=useState("");
  const [comentario, setComentario]=useState("");
  const[tasks, setTaks]=useState([])
  const[editMode,setEditMode]=useState(false)
  const[id,setId]=useState("")
  const[error, setError]=useState(null)

  useEffect(()=>{
    (async () =>{
      const result=await getCollection("tasks")
      console.log(result);
      if(result.statusResponse){
        setTaks(result.data)
      }
    })()
  },[])

  const addTask=async (e)=>{
    e.preventDefault();
    console.log(task+" "+encargado+" "+correo+" "+comentario);
    if (isEmpty(task) || isEmpty(encargado) || isEmpty(correo) || isEmpty(comentario)){
      console.log("No debes dejar campos vacios")
      return
    }
    const result = await addDocument("tasks",{name:task,encargado:encargado,correo:correo,comentario:comentario})
    if(!result.statusResponse){
      setError(result.error)
      return
    }
    setTaks([...tasks,{id:result.data.id,name:task,encargado:encargado,correo:correo,comentario:comentario}])
    setTask("")
    setEncargado("")
    setCorreo("")
    setComentario("")
  }

  const saveTask=async (e)=>{
    e.preventDefault()
    if(isEmpty(task) || isEmpty(encargado) || isEmpty(correo) || isEmpty(comentario)){
      console.log("task vacio")
      return
    }
    const result =await updateDocument("tasks",id, {name:task,encargado:encargado,correo:correo,comentario:comentario})
    if(!result.statusResponse){
      setError(result.error)
      return
    }
    const editedTasks=tasks.map(item=>item.id===id ? {id,name:task,encargado:encargado,correo:correo,comentario:comentario}:item)
    setTaks(editedTasks)
    setEditMode(false)
    setTask("")
    setEncargado("")
    setCorreo("")
    setComentario("")
    setId("")
  }

  const deleteTask=async(id)=>{
    const result=await deleteDocument("tasks", id)
    if(!result.statusResponse){
      setError(result.error)
      return
    }
    const filteredTasks=tasks.filter(task=>task.id !==id)
    setTaks(filteredTasks)
  }

  const editTask=(tarea)=>{
    setTask(tarea.name)
    setEncargado(tarea.encargado)
    setCorreo(tarea.correo)
    setComentario(tarea.comentario)
    setEditMode(true)
    setId(tarea.id)
  }

  return(
    <>
    <div className="container mt-5">
      <h1>Tareas</h1>
      <hr/>
      <div className="row align-items-start">
        <div className="col-8">
          <h4 className="text-center">Actividades</h4>
          {
            size(tasks)===0 ? (
              <h5 className="text-center">Aún no hay tareas</h5>
            ) : (
              <ul className="list-group">
                {
                  tasks.map((task)=>(
                    <li className="list-group-item" key={task.id}>
                      <h2>Tarea: {task.name}</h2> 
                      <p>Encargado: {task.encargado}</p>
                      <p>Correo del encargado: {task.correo}</p>
                      <p>Comentario: {task.comentario}</p>
                      <button className="btn btn-danger btn-sm float-right mx-2"
                        onClick={() => deleteTask(task.id)}
                      >Eliminar</button>
                      <button className="btn btn-warning btn-sm float-right"
                        onClick={() => editTask(task)}
                        >Editar</button>
                    </li>
                  ))
                }
              </ul>
            )
          }
        </div>
        <div className="col-4">
          <h4 className="text-center">{editMode ? "Modificar tarea":"Agregar Tarea"}</h4>
          <form onSubmit={editMode ? saveTask : addTask}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingresa una tarea..."
              onChange={(text)=>setTask(text.target.value)}
              value={task}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Encargado..."
              onChange={(text)=>setEncargado(text.target.value)}
              value={encargado}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="ejemplo@..."
              onChange={(text)=>setCorreo(text.target.value)}
              value={correo}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="comentario..."
              onChange={(text)=>setComentario(text.target.value)}
              value={comentario}
            />
            <button className={editMode ? "btn btn-warning btn-block" : "btn btn-dark btn-block"}
              type="submit">{editMode ? "Guardar" : "Agregar"}</button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
