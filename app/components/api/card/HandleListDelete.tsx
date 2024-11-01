import middleware from "@/components/middleware";


async function HandleListDelete(todolist_id : number) {
    try {
        const res = await fetch(`http://localhost:5555/todolist/${todolist_id}`,{
          method: 'DELETE',
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

export default HandleListDelete