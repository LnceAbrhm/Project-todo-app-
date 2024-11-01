import middleware from "@/components/middleware";


async function HandleAddtodo(id: number, task : string) {
    try {
        const res = await fetch(`http://localhost:5555/todo`,{
          method: 'POST',
          body : JSON.stringify({FK_todolist_id: id, task : task}),
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

export default HandleAddtodo