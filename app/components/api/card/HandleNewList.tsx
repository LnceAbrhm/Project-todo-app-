import middleware from "@/components/middleware";


async function HandleNewList(id :number) {
    
    try {
        const res = await fetch(`http://localhost:5555/todolist`,{
          method: 'POST',
          body : JSON.stringify({FK_u_id: id}),
          credentials: 'include',
          headers: {
            'Content-Type' : 'application/json'
          }
          })
          
          return await middleware(res);
  
      } catch (error) {
        console.log(error);
      }
}

export default HandleNewList;