import React , {useState , useRef , useEffect} from "react";
import "./bootstrap.css"
import "./todoStyle.css"

export default function TodoList(){
    const inputRef = useRef(null)
    const [todos , setTodos] = useState(0)
    const [completedTodos , setCompletedTodos] = useState(0)
    const [createTodo , setCreateTodo] = useState([])
    const [filter , setFilterTodo] = useState("All")

    useEffect(()=>{
        loadTask()
    },[])
    
    const createTodos = ()=>{
        const todoDate = new Date()
        if(inputRef.current.value.trim() ===''){
            alert("fill the field")
        }else{
            const todoArray = {
                id : Math.random().toString(36).substr(2, 9),
                text : inputRef.current.value,
                date : todoDate.toString(),
                completed: false
            }
            setCreateTodo([...createTodo , todoArray])
            setTodos(todos => todos+1)
            inputRef.current.value=''
            saveTasks([...createTodo , todoArray])
        }
    }

    function saveTasks(tasks){
        localStorage.setItem("todoList" , JSON.stringify(tasks))
    }

    function loadTask(){
        const storedTodo = localStorage.getItem("todoList")

        if(storedTodo){
            try{
                const parsedDate = Array.from(JSON.parse(storedTodo)).map(todo =>({
                    ...todo,
                    date:new Date(todo.date)
                }))
                setCreateTodo(parsedDate)
                setTodos(parsedDate.length)
                const doneTasks = parsedDate.filter(todo =>todo.completed).length
                setCompletedTodos(doneTasks)

            }catch(error){
                console.log("there's an error " , error)
            }
        }
    }

    useEffect(()=>{
        const handleEnter=(e)=>{
            if(e.key==="Enter"){
                e.preventDefault()
                createTodos()
            }
        }

        if(inputRef.current){
            inputRef.current.addEventListener("keydown" , handleEnter)
        }
        return()=>{
            inputRef.current.removeEventListener("keydown" , handleEnter)
        }
    } , [createTodo])

    const handleCheckbox = (i)=>{
        setCreateTodo((preTodo=>{
            const newTodo = [...preTodo]
            const todoIndex = newTodo.findIndex(todo => todo.id ===i)
            if(todoIndex===-1){
                return newTodo
            }
            newTodo[todoIndex].completed = !newTodo[todoIndex].completed
            const doneTasks = newTodo.filter(todo =>todo.completed).length
            setCompletedTodos(doneTasks)

            saveTasks(newTodo)

            return newTodo
        }))
    }
    
    const deletTodos = (item)=>{
        setCreateTodo(preTodo =>{
            const completedTodo = preTodo.find((todo)=> todo.id===item)
            const updatingTodo = preTodo.filter((todo)=> todo.id!==item)
            setTodos(preTodo => preTodo-1)
            if(completedTodo.completed && updatingTodo){
                setCompletedTodos(preTodo => preTodo-1)
            }
            saveTasks(updatingTodo)

            return updatingTodo
        })
    }

    const editTodos = (item)=>{
        setCreateTodo((preTodo=>{
            const newTodo = [...preTodo]
            const todoIndex = newTodo.findIndex(todo => todo.id ===item)
            if(todoIndex===-1){
                return newTodo
            }
            const update = prompt("Update Your Task" , newTodo[todoIndex].text)
            if(update ===null || update.trim()===''){
                return newTodo
            }else{
                newTodo[todoIndex].text = update
                saveTasks(newTodo)
                return newTodo
            }
        }))
    }
    
    const handleSelect = (e)=>{
        setFilterTodo(e.target.value)
    }

    const filterTodo = createTodo.filter(todo=>{
        if(filter ==="Completed"){
            return todo.completed
        }else if(filter === "Incompleted"){
            return !todo.completed
        }

        return true
    })
    
    return(
        <div id="todolist-container" className="">
            <h1 id="title">Todo List </h1>
            <input type="text"
            ref={inputRef}
            autoFocus 
            className="input-field" />
            <button onClick={createTodos} className="create-btn">create</button>
            <select onChange={handleSelect} id="select" className="form-select">
                <option value="All">All</option>
                <option value="Incompleted"  >Incomplete</option>
                <option value="Completed" >Completed</option>
            </select><br />
            <span className="span">Created task {todos}</span>
            <span className="span">Completed Tasks {completedTodos} of {todos}</span>
            <div id="tasks-container">
                {filterTodo.map((todo )=>(
                    <div key={todo.id}>
                        <input type="checkbox"
                        className="form-check-input" id="flexCheckDefault"
                        checked={todo.completed}  onChange={()=> handleCheckbox(todo.id)} /> 
                        <label htmlFor="">
                        {todo.text}//
                        {new Date(todo.date).toLocaleDateString()},{new Date(todo.date).toLocaleTimeString()}
                        </label>
                        <button onClick={()=>deletTodos(todo.id)} className="btn btn-outline-dark todo-btn">Remove</button>
                        <button onClick={()=>editTodos(todo.id)} className="btn btn-outline-dark todo-btn">Edit</button>
                    </div>
                ))}
            </div>
        </div>
    )
}