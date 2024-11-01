'use client'

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const Nav = () => {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [condition, setCondition] = useState<string>();
  useEffect(()=>{
    setCondition(window.location.pathname)
  })
  const handlelogout = async ()=>{
    try {
      const res = await fetch(`http://localhost:5555/logOut`,{
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type' : 'application/json'
      }
      })
      
      const data = await res.json();
      if(data.path){
        location.href = data.path;
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handledeletion = async ()=>{
    try {
      const res = await fetch(`http://localhost:5555/deleteUser/${cookies.id}`,{
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type' : 'application/json'
      }
      })
      console.log('hit')
      const data = await res.json();
      if(data.path){
        location.href = data.path;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <header className="bg-indigo-400 text-white p-4 min-w-screen">
      <nav className="flex items-center justify-between">
        <div>To-do List</div>
        {/* Log out and Account delete button */}
        {condition != '/' ?
        <div className="justify-end inline-flex">
          <div className={`px-2 `}>
            <button onClick={()=>{handlelogout()}} className="font-semibold leading-6 text-white rounded-md bg-blue-300 px-2 py-1 text-white hover:bg-blue-400" >
            Log Out
            </button>
          </div>
          <div className="px-2"> 
            <button onClick={()=>{handledeletion()}} className="font-semibold leading-6 text-red-300 rounded-md bg-red-300 px-2 py-1 text-white hover:bg-red-500" >
            Delete Account
            </button>
          </div>
        </div>
         : ''}
        
      </nav>
    </header>
    </>
  )
}

export default Nav