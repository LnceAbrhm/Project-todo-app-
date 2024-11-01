const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./database/db');
const PORT=5555;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {authentication} = require('./middleware/authentication');
const cookieParser = require('cookie-parser');


app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(cookieParser());
//--------routes----------//

//User Routes

// Logins the user, if successful it redirects the user to the home page and creates cookies id and cookie
app.post('/logIn', async (req,res) => {
    const {uname, pass} = req.body;
    try {
       
        const checkUser = await pool.query('SELECT * FROM userinfo WHERE uname= $1', [uname]);
        if(!checkUser.rows.length) return res.status(200).json({message : 'User does not exist'});

        const userID = (checkUser.rows[0].u_id).toString();
        // jwt token for verification in the authentication
        const token = jwt.sign( {userID} , 'secretkey', {expiresIn: '1hr'});
        
        
        
        if (await bcrypt.compare(pass, checkUser.rows[0].pass)) {
            // cookies created
            res.cookie('id', checkUser.rows[0].u_id, {maxAge: 60 * 60 * 1000, SameSite : 'None'});
            res.cookie('token', token, {maxAge: 60 * 60 * 1000, httpOnly : true,  SameSite : 'None'});
            // sends
            res.status(200).json({'path' : '/home'});
            
        } else {
            res.json({message: 'incorrect password'})
        }

        
    } catch (error) {
        logger(error);
    }
})

// Create new user
app.post('/signUp', async (req, res) => {
    const {uname, pass}= req.body;
    const hashedPassword = await bcrypt.hash(pass, 10);
    try {
      
      const checkUser = await pool.query('SELECT * FROM userinfo WHERE uname= $1', [uname]);
      if(checkUser.rows.length) return res.status(200).json({message: 'User already exist'});
      
      const newUser = await pool.query('INSERT INTO userinfo (uname, pass) VALUES ($1, $2) RETURNING *', [uname, hashedPassword]);

      const userID = (newUser.rows[0].u_id).toString();
      const token = jwt.sign( {userID} , 'secretkey', {expiresIn: '1hr'});

      res.cookie('id', newUser.rows[0].u_id, {maxAge: 60 * 60 * 1000,  SameSite : 'None'});
      res.cookie('token', token, {maxAge: 60 * 60 * 1000,  SameSite : 'None'});
      res.status(200).json({'path' : '/home' });
      logger('New user created');
    } catch (error) {
        logger(error);
    }
})

// Deletes the account of the user
app.delete('/deleteUser/:id', async (req, res)=>{
    const {id}= req.params;
    try {

        const deleteUser = await pool.query('DELETE FROM userinfo WHERE u_id = $1', [id]);

        res.clearCookie('id');
        res.clearCookie('token');
        res.status(200).json({path: '/'});
        logger('User deleted');
    } catch (error) {
        logger(error);
    }
})

// Logs out the user while also clearing the browser of the cookies
app.get('/logOut', (req, res)=>{
    try {
        res.clearCookie('id');
        res.clearCookie('token');
        return res.status(200).json({path: '/'});
    } catch (error) {
        logger(error);
    }
    
})

// Todo List Routes

// Creates todolist
app.post('/todolist', authentication, async (req, res)=>{

    try {
        const {FK_u_id} = req.body;
        
        const newList = await pool.query('INSERT INTO todolist (FK_u_id, todo_date) VALUES ($1, $2) RETURNING *', [FK_u_id, new Date().toISOString()]);

        res.json(newList.rows[0]);
        logger("New list created");
    } catch (error) {
        logger(error);
    }
})

// Gets all todo list of a user
app.get('/todolist/:id', async (req,res)=>{
    
    try {
        const { id } = req.params;

        const getTodolist = await pool.query('SELECT * FROM todolist WHERE FK_u_id = $1 ORDER BY todolist_id ASC', [id]);

        res.json(getTodolist.rows);
        logger(`ID:${id} sent`);
    } catch (error) {
        logger(error);
    }
})

// Gets all todo list
app.get('/todolist', async (req,res)=>{
    try {
        const allTodolist = await pool.query('SELECT * FROM todolist');

        res.json(allTodolist.rows);
        logger("All todo list sent");
    } catch (error) {
        logger(error);
    }
})


//Deletes a todolist from the database
app.delete('/todolist/:id', authentication, async (req,res)=>{
    try {
        const {id} = req.params;

        const deleteTodo = await pool.query('DELETE FROM todolist WHERE todolist_id = $1', [id]);

        res.json("todo deleted");
        logger(`ID:${id} deleted`);
    } catch (error) {
        logger(error);
    }
})

// Todo Routes

//create todos
app.post('/todo', authentication, async (req, res)=>{
    try {
        const {FK_todolist_id, task} = req.body;

        const newTodo = await pool.query('INSERT INTO todo (FK_todolist_id, task) VALUES ($1, $2) RETURNING *', [FK_todolist_id, task]);

        res.json(newTodo.rows[0]);
        logger("New todo created");
    } catch (error) {
        logger(error);
    }
})

//get all todo
app.get('/todo', authentication, async (req,res)=>{
    try {
        const allTodo = await pool.query('SELECT * FROM todo');

        res.json(allTodo.rows);
        logger("All todo sent");
    } catch (error) {
        logger(error);
    }
})

//get all todo for a specific todo list
app.get('/todo/:id', authentication, async (req,res)=>{
    try {
        const { id } = req.params;

        const getTodo = await pool.query('SELECT * FROM todo WHERE FK_todolist_id = $1 ORDER BY todoid ASC', [id]);

        res.json(getTodo.rows);
    } catch (error) {
        logger(error);
    }
})

//update todo if its done
app.put('/todo/:id', authentication, async (req,res)=>{
    try {
        const {id} = req.params;
        const {isdone} = req.body;

        const updateTodo = await pool.query('UPDATE todo SET isdone =$1 WHERE todoid = $2', [isdone, id]);

        res.json("todo updated");
        logger(`ID:${id} updated`);
    } catch (error) {
        logger(error);
    }
})

//delete todo 
app.delete('/todo/:id', authentication, async (req,res)=>{
    try {
        const {id} = req.params;

        const deleteTodo = await pool.query('DELETE FROM todo WHERE todoid = $1', [id]);

        res.json("todo deleted");
        logger(`ID:${id} deleted`);
    } catch (error) {
        logger(error);
    }
})

function logger(log){
    console.log(log)
}

app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate');
});