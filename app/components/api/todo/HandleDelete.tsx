import middleware from "@/components/middleware";


async function HandleDelete(todoid : number) {
    try {
        const res = await fetch(`http://localhost:5555/todo/${todoid}`,{
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

export default HandleDelete