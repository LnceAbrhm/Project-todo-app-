import { useState, useEffect } from "react";
import HandleAddtodo from "./api/todo/HandleAddtodo";
import HandleUpdate from "./api/todo/HandleUpdate";
import HandleDelete from "./api/todo/HandleDelete";
import middleware from "@/components/middleware";

type todo = {
    todoid : number;
    FK_todolist_id: number;
    isdone : boolean;
    task : string
  }

function HandleTodo(id : any) {
    const [todo, setTodo] = useState<todo[]>([]);
    const [newTask, setTask] = useState<string >('');
    
    useEffect(()=>{
      const handlegettodo = async () =>{
        try {
          const res = await fetch(`http://localhost:5555/todo/${id.id}`,{
            method: 'GET',
            credentials: 'include',
          })
          const data = await middleware(res);
            setTodo(data);
            
        } catch (error) {
          console.log(error);
        }
      }
      handlegettodo()
      }, [id])
  
      
    const handleAddtodo = async (id: number, task : string)=> {
      try {

        const data  = await HandleAddtodo(id, task);

          setTodo([...todo, data]);
          setTask('');

      } catch (error) {
        console.log(error);
      }
    }
    
    const handleUpdate = async (todoid : number) =>{
      try {
        const data  = await HandleUpdate(todoid);
        // looks for the specified todo then changes the isdone boolean to true 
          setTodo(todo.map(todo =>{
            if(todo.todoid == todoid){
              return {...todo, isdone : true};
            }
              return todo;
            }));
          
        
      } catch (error) {
        console.log(error);
      }
    }
  
    const handleDelete = async (todoid : number) =>{
      try {
        const data  = await HandleDelete(todoid);
        // looks for the specified todo then deletes it from the list 
          setTodo(todo.filter(todo =>{
            return todo.todoid !== todoid;
          }));
          
      } catch (error) {
        console.log(error);
      }
    }
  
    return(
      <>
        <ul className="list-outside list-disc pb-2 ps-2 ">
          {todo?.map(todo=>(
            <>
            <li key={todo.todoid}>
              <div className="inline-flex">
               <div className="w-36 " key={todo.todoid}><p className={`${todo.isdone ? 'line-through opacity-30 ': '' }`}>{todo.task}</p></div>
               {/* <!-- Update todo button --> */}
               <div className="mr-2" >
                <button onClick={()=>handleUpdate(todo.todoid)} className={`rounded-full bg-lime-400 text-white ${todo.isdone == true ? 'disabled:opacity-50' : 'hover:bg-lime-600'}`} disabled={todo.isdone == true}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                </button>
              </div>
              {/* <!-- Delete todo button --> */}
              <div>
                <button onClick={()=>handleDelete(todo.todoid)}className="rounded-full bg-red-400 text-white hover:bg-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
  
                </button>
              </div>
              </div>
              
            </li>
            </>
          ))} 
        </ul>
        {/* <!-- Add new todo button --> */}
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-1 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          <input type="text" name="task" id="task" onChange={(e)=>setTask(e.target.value)} value={newTask} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Add a task" autoComplete="off"/>
        </div>
        <div className="mt-2">
          <button onClick={()=>{handleAddtodo(id.id, newTask)}} className={`rounded-md bg-blue-600 px-2 py-1 text-white  ${newTask == '' ? 'disabled:opacity-50' : 'hover:bg-blue-700'}`} 
          disabled={newTask == ''} >
            <div className="inline-flex">
              add
            </div>
            <div className="inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 14" strokeWidth={1.5} stroke="currentColor" className="size-5 ">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            </div>
            </button>
        </div>
      </>
    )
  }

  export default HandleTodo;