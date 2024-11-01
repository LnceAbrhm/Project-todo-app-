
import { useState } from "react";


const login = () => {
  const [isSignup, setSignup] = useState<boolean>(false);
  const [uname, setUname] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [confirmPass, setConfirm] = useState<string>('');
  const [message, setMessage] = useState<string>();

  // condition for sign up submission
  const submitCondition = pass!=confirmPass ||confirmPass =='' && pass == '';

  // callback function for logging in and signing up
  const handleUserCreation = async (e : React.FormEvent, api : string) => {
    e.preventDefault();
    if(uname != '' && pass != ''){ 
      if( api.includes('log') || isSignup && pass==confirmPass){
        try {
          // calls for an api that clears the cookies returns a path that leads to login page
          const res = await fetch(`http://localhost:5555/${api}`,{
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            credentials: 'include',
            body: JSON.stringify({uname: uname, pass: pass}),
          })

          const data = await res.json();
          if(data.message){
            setMessage(data.message);
          }else{
            location.href = data.path;
          }
          
        } catch (error) {
          console.log(error);
        } 
      }  
    };
  }

  return (
    <>
      <div className="flex justify-center min-w-screen min-h-screen items-center bg-gradient-to-r from-indigo-400">
        <div className="bg-cream border border-neutral-500 p-20 rounded-lg shadow-lg">
          {/* title */}
          <div>
            <p className="font-bold pb-7 px-5 text-3xl">Todo List !!</p>
          </div>
          
          <form className="">
            {/* signup/login button */}
            <div className="pb-3">
              <div className="grid grid-cols-2">
                <button type="button" onClick={(e)=>{setSignup(true)}} className="ring-offset-0 ring-1 ring-neutral-800/15 rounded-l-lg hover:bg-orange-200 hover:text-black">SignUp</button>
                <button type="button" onClick={(e)=>{setSignup(false); setConfirm('')}} className="ring-offset-0 ring-1 ring-neutral-800/15 rounded-r-lg bg-orange-800 text-white hover:bg-orange-200 hover:text-black">LogIn</button>
              </div>
            </div>

            {/* form input */}
              <label>Username</label>
            <div>
              <input type="text" value={uname} required
              onChange={(e)=>{setUname(e.target.value)}} className="px-2 block w-40% rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
              <label>Password</label>
            <div>
              <input type="password" value={pass} required
              onChange={(e)=>{setPass(e.target.value)}} className="px-2 block w-40% rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </div>

            {isSignup && <div>
              <label>Confirm password</label>
                <div>
                  <input type ='password' value={confirmPass} required
                  onChange={(e)=>{setConfirm(e.target.value)}} className="px-2 block w-40% rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                {(pass!=confirmPass) && <div>
                  <p>Password does not match</p>
                </div>}
              </div>}

            {/* submit button */}
            <div>
              {/* condition disables the submit button when it is met stopping the user to submit */}
              <button type="submit" onClick={(e)=>{isSignup? handleUserCreation(e, 'signUp'): handleUserCreation(e, 'logIn')}} disabled={ uname == ''||(isSignup && submitCondition)||pass ==''}
              className={`my-1 mt-2 py-1 px-3 bg-blue-400 text-white ${ submitCondition ? 'disabled:opacity-50' : `hover:bg-blue-300 hover:text-white`} rounded-md `}>Submit</button>
            </div>
            <div><p>{message}</p></div>
          </form>
        </div>
      </div>
    </>
  )
}

export default login;