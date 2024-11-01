
import { useEffect, useState } from "react";
import {useCookies} from 'react-cookie';
import HandleTodo from "@/components/Todo";
import HandleNewList from "@/components/api/card/HandleNewList";
import HandleListDelete from "@/components/api/card/HandleListDelete";
import middleware from "@/components/middleware";

type todoList = {
  todolist_id : number;
  FK_u_id: number;
  todo_date: string;
}

type todo = {
  todoid : number;
  FK_todolist_id: number;
  isdone : boolean;
  task : string
}


const card = () => {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [todolist, setTodoList] = useState<todoList[]>([]);
  const [id, setId] = useState<number>(cookies.id);

  // takes in the id of the user then fetches the data 
  useEffect(() => {
      const handlegettodolist = async () => {
      try {
        const res = await fetch(`http://localhost:5555/todolist/${id}`,{
          method: 'GET',
          credentials: 'include',
        })

        const data = await middleware(res);
        setTodoList(data);
        
      } catch (error) {
        console.log(error);
      }
    }
    handlegettodolist();
  }, [id])
  
  
  const handleNewList = async (id : number)=>{
    try {

      const data = await HandleNewList(id);
      // fills up the todolist with new added list
        setTodoList([...todolist,data]) ;
        
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleListDelete = async (todolist_id:number) =>{
    try {

      const data = await HandleListDelete(todolist_id)
      // removes the specified todo list from the list of todos
        setTodoList(todolist.filter(todolist =>{
          return todolist.todolist_id !== todolist_id; 
        }));
      
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
    {/* <!-- Add new list button --> */}
    <div className="fixed bottom-12 right-4">
      <button className="flex rounded-lg bg-blue-400 px-2 py-3 text-white hover:bg-blue-500 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg" onClick={()=>handleNewList(id)}> 
        Add List 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
    <div className="flex min-h-screen min-w-screen flex-wrap items-center justify-center gap-4 bg-gray-100 p-8">
    {/* <!-- Card --> */} 
    {todolist?.map(card =>(
      <>
      <div className="h-auto w-64 transform rounded-xl bg-white p-2 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl" key={card.todolist_id} >
        {/* <!-- Delete list button--> */}
        <div className="flex justify-end">
          <button className="rounded-full hover:text-white hover:bg-red-500 transition-all duration-200 " onClick={()=>handleListDelete(card.todolist_id)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
          <div className="ps-2">
            <h2 className="text-2xl font-bold mt-1">{new Date(card.todo_date).toDateString()}</h2>

            <div className="p-2">

              <HandleTodo id ={card.todolist_id}/>                   
              
            </div>
            
          </div>
        </div>
      </>
    ))}
    </div>
    </>
  )
}


export default card;
