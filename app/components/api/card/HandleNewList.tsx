import middleware from "@/components/middleware";

// takes in the user id as param that is then use to post to the database for the new list also receives the newly added list
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