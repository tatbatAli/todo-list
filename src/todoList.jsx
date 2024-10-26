import React , {useState , useRef , useEffect} from "react";
import "./bootstrap.css"
import "./todoStyle.css"

export default function TodoList(){
    const inputRef = useRef(null)
    const inputColor = useRef(null)
    const [todos , setTodos] = useState(0)
    const [completedTodos , setCompletedTodos] = useState(0)
    const [createTodo , setCreateTodo] = useState([])
    const [filter , setFilterTodo] = useState("All")
    const [buttonPopOut , setButtonPopOut] = useState(false)
    const [isDark , setIsDark] = useState(false)
    const [toggleButton , setToggleButton] = useState("Dark")

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
                completed: false,
                color: inputColor.current.value.trim()===""?"white":null
            }
            setCreateTodo([...createTodo , todoArray])
            setTodos(todos => todos+1)
            inputRef.current.value=''
            saveTasks([...createTodo , todoArray])
            setButtonPopOut(false)
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

        const handleEnter=(e)=>{
            if(e.key==="Enter"){
                e.preventDefault()
                createTodos()
                setButtonPopOut(false)
            }
        }

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
    
    const PopOut = (props) =>{
        return(props.trigger?(
            <div className="popOut">
                <div className="popOut-inner">
                    {props.children}
                </div>
            </div>
            ):""
        )
    }

    const themeButton = ()=>{
        setIsDark(!isDark)
        setToggleButton(isDark ? "Dark": "Light")
    }

    useEffect(() => {

        document.body.style.backgroundColor = isDark ? "rgb(54, 54, 54)" : "rgb(208, 206, 206)";

        return () => {
            document.body.style.backgroundColor = "";
        };
    }, [isDark]);

    return(
        <div id={isDark? "dark-todolist-container": "light-todolist-container"}>
            <h1 id="title">Todo List </h1>
            <button onClick={()=>{setButtonPopOut(true)}}  className="create-btn">Create</button>
            <select onChange={handleSelect} id="select" className="form-select">
                <option value="All">All</option>
                <option value="Incompleted"  >Incomplete</option>
                <option value="Completed" >Completed</option>
            </select>
            <button className="btn btn-outline-dark todo-btn" onClick={themeButton}>{toggleButton}</button>
            <br />
            <span className="span">Created task {todos} </span>
            <span className="span">Completed Tasks {completedTodos} of {todos}</span>
            <div id={isDark?"dark-tasks-container":"light-tasks-container"}>
                {filterTodo.map((todo )=>(
                    <div key={todo.id} style={{background:todo.color}} className="todo">
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
            <PopOut trigger={buttonPopOut}>
                <label htmlFor="">Title:</label><br />
                <input type="text" ref={inputRef} className="input-field" onKeyDown={handleEnter} autoFocus/><br />
                <label htmlFor="">Color For Your Task:</label><br />
                <input type="text" className="input-field" ref={inputColor} onKeyDown={handleEnter}/><br />
                <button onClick={createTodos} className="btn btn-outline-dark todo-btn">Add Taks</button>
                <button onClick={()=>{setButtonPopOut(false)}} className="btn btn-outline-dark todo-btn">Cancel</button>
            </PopOut>
        </div>
    )
}