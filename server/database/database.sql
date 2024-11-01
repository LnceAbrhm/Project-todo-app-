CREATE DATABASE todoapp;

CREATE TABLE userinfo(
    u_id SERIAL PRIMARY KEY,
    uname VARCHAR(25),
    pass VARCHAR(255)
);

CREATE TABLE todolist(
    todolist_id SERIAL PRIMARY KEY,
    FK_u_id INT REFERENCES userinfo(u_id) ON DELETE CASCADE,
    todo_date VARCHAR(100)
);

CREATE TABLE todo(
    todoid SERIAL PRIMARY KEY,
    FK_todolist_id INT REFERENCES todolist(todolist_id) ON DELETE CASCADE,
    isdone BOOLEAN,
    task VARCHAR(255)
);



