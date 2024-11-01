import middleware from "@/components/middleware";


async function HandleUpdate(todoid : number) {
 
    try {
        const res = await fetch(`http://localhost:5555/todo/${todoid}`,{
          method: 'PUT',
          body : JSON.stringify({isdone : true, id: todoid}),
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

export default HandleUpdate