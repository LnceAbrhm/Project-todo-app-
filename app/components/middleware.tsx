

async function middleware(res : Response) {
  // checks if the data sent back by the backend server has path 
  // in it to determine the appropriate path for the user
    const data = await res.json();
    if(data.path){
        location.href = data.path;
      }else{
        return data;
      }
}

export default middleware