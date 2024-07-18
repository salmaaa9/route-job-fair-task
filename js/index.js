const baseUrl = 'https://todos.routemisr.com';
var form = document.getElementById('form');
var todoInput = document.getElementById('toDo');
var checkbox = document.getElementById('');
var apikey = null;
var todos = [];



form.addEventListener('submit',function(e){
    e.preventDefault();
    var todo = todoInput.value;
    addToDo(todo);
    todoInput.value = '';
})

if(localStorage.getItem('apikey')){
    apikey = localStorage.getItem('apikey');
    getToDo(apikey)
    // displayTodos(todos);
}else{
    getApiKey()
}

async function getApiKey(){
   try{
    var res = await fetch(`${baseUrl}/api/v1/getApiKey`);
   if(!res.ok){
    throw new Error('failed to get apikey' + res.status)
   }
   var data = await res.json()
   if(data.message == 'success'){
    console.log(data)
    localStorage.setItem('apikey', data.apiKey)
   }else{
    throw new Error(JSON.stringify(data))
   }
   }
   catch (err){
    console.log(err);
   }
}


async function getToDo(key){
   try{
    var res = await fetch(`${baseUrl}/api/v1/todos/${key}`);
   if(!res.ok){
    throw new Error('failed to get ToDo' + res.status)
   }
   var data = await res.json() 
   if(data.message == 'success'){

//   display todos
    todos = data.todos;
    displayTodos(todos);
    localStorage.setItem("todo" ,todos);
    console.log(todos);

   }else{
    throw new Error(JSON.stringify(data))
   }
   }
   catch (err){
    console.log(err);
   }
}

async function addToDo(title){
    try{
     var res = await fetch(`${baseUrl}/api/v1/todos` ,{
         method: 'POST',
         body: JSON.stringify({
 
                 "apiKey": apikey,
                 "title": title
             }),
         headers: {
             'Content-Type': 'application/json',
         }
 
     })
    if(!res.ok){
     throw new Error('failed to addToDo' + res.status)
    }
    var data = await res.json() 
    if(data.message == 'success'){
 
 //   display todos
     getToDo(apikey)
 // save to dos to local storage
    }else{
     throw new Error(JSON.stringify(data))
    }
    console.log(data)
    }
    catch (err){
     console.log(err);
    }
}

async function deleteToDo(id){
    try{
     var res = await fetch(`${baseUrl}/api/v1/todos` ,{
         method: 'DELETE',
         body: JSON.stringify({
                 "todoId" : id ,
             }),
         headers: {
             'Content-Type': 'application/json',
         } 
     })
    if(!res.ok){
     throw new Error('failed to deleteToDo' + res.status)
    }
    var data = await res.json() 
    if(data.message == 'success'){
 
    //display todos
    getToDo(apikey)
    }else{
     throw new Error(JSON.stringify(data))
    }
    console.log(data)
    }
    catch (err){
     console.log(err);
    }
}

async function markCompleted(id){
    try{
     var res = await fetch(`${baseUrl}/api/v1/todos` ,{
         method: 'PUT',
         body: JSON.stringify({
                 "todoId" : id ,
             }),
         headers: {
             'Content-Type': 'application/json',
         } 
     })
    if(!res.ok){
     throw new Error('failed to markCompleted' + res.status)
    }
    var data = await res.json() 
    if(data.message == 'success'){
    // mark checkbox
        //display todos
    // getToDo(apikey)
    getToDo(apikey)
    }else{
     throw new Error(JSON.stringify(data))
    }
    }
    catch (err){
     console.log(err);
    }
}


function displayTodos(data){
    var string = '';
    for(var i = 0; i < data.length; i++){
        string += `
        <tr>
                <td>${data[i].title}</td>
                <td><input ${data[i].completed && 'checked disabled'} type="checkbox" name ="${'todo-'+ i}" id ="${i}"  ></td>
                <td><i onclick = "deleteToDo('${data[i]._id}')" class="fas fa-trash-can text-danger pointer"></i></td>
        </tr>
        `
        console.log(data[i])
    }
    document.getElementById('data').innerHTML = string;

    $('#data input').change(function(){
        var id = $(this).attr('id');
        markCompleted(data[id]._id)
    })
}