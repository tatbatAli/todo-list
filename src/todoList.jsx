import React, { useState, useRef, useEffect } from "react";
import "./bootstrap.css";
import "./todoStyle.css";

export default function TodoList() {
  const images = {
    lightOff: (
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACM0lEQVR4nMXXT4hOURgG8B9mGAs7xp/FMDUozMJmbOgbhgWF0OzIJIUlFqaUjQXJgqxkNStTdiTFQhoLTdiwIhkp84elMkqNbr2jr+l+1/3uvdM89XW/c84993nOe57znnNYGPRg2wJxq2EyRDSNDgxiBN/wBz/wEleiPQ958mwKbbgZZHfQh3VYglXYjVv4Hu8tT/lGb5Anz6bQjlcYxuqo68ZxXMJpLI36lXiM0RBWmrwtyK9hEbbjOT7ibtTfxgocwA4sjiiMRv/C5OJDw0GeYCeO1pXrkUzDeLQnIp7gIaaKknfEnM6GPQ/WY2v8P4YZ9CuIwTBcEfTGyJPpulhUwAj2liBPnvvwoqiAcaxpss+uMNyeKK/F16ICpsPFeZHm9qT/r6ICPqGr4MhnsTGWbCEM42yDtrd16TRrnZ/D/aICevAeLSlttRCRRd4S/YsY+R+e4oJ0/C/DncczJdEVS6q7AXmjXW1L9MvroUycxDssSyH/kPJ+a0zPKRXiAW7EXjAReV+k2rm4ikcqRnskpqk5YZ9JCf1EJKBK0YufsTRlCLiHy/NBPokTsTtmCfiMTVWS1+YstZkcv5aqyWsZI04c3xmmHGhgysrIBcFQbLFjsWGNRXmoKgG1jCTzG2dixJ1x+t0QUzQQ7fNGnuBN5Pb+ugh8iQgkh9DXSqAnx6XhcDj9CDaHB1ojAomgg2UEdOe8Lh2K0dY7f7QseRFMx8Wk8ImnLJKLyHXsXygBleAv3taQAfs5jbUAAAAASUVORK5CYII="
        alt="Light mode"
      />
    ),
    lightOn: (
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB4ElEQVR4nO3WO2tUQRTA8Z+bgFEEXcW1EJFUNjZqfLBqVk1AyabwlSJBRcFCEhTSRBOsxMLOQvFBECLRKKIfST+LDJwLl8suyb3LbrV/OHBmzmNmzsyduQwZUp4GnmIz5Cu+YTFsfWMEL2PAFmoFWytsawVbJWqo59q7sYV2B99Z3MZMxLWjIikmo15lUm1MhP4JzW38D+Ahjobvx+if6DLxHXMdKyX853EIz3GtyoB7oqwHo/2zUM7t2IV7GIttE7lmI/eOGMN4BH5Qnv0Yja2rR66UszSX8aRCXFrpDSzhQtngE5jDMVzFI9UYj/MwE7nmIncpzsel04k0uZMhV7r4LOO0HtiHL11stwrSifU4D6Wo4Q4uRnuzcHoX4+JJ5b0bvvPRl2wZeyM2cSn8Kt2QTbzOtdOgN7GK+yGrUYVky3iFST1wBFOhv8V07js/i4Wc70L0ZUxFTKanXKVpFh6b9TjRGankGam8GdNxbka75KpMDb9wPNppGzKyQ5hs32PCfaGFx4VB8/qz+Dz7Rh3vQj8XKx0JPfE+XsW+8gK/8bkgf+IF7Dtn4q+nXpC1sA1kAhtxtyc5FQ/OxqAm0Ih3vpFbfdJ/4LABMYl/eBPyt9dbrwoPohJboQ8Zogr/AZsnQZYtDLtRAAAAAElFTkSuQmCC"
        alt="Dark mode"
      />
    ),
  };

  const inputRef = useRef(null);
  const inputColor = useRef(null);
  const [todos, setTodos] = useState(0);
  const [completedTodos, setCompletedTodos] = useState(0);
  const [createTodo, setCreateTodo] = useState([]);
  const [filter, setFilterTodo] = useState("All");
  const [buttonPopOut, setButtonPopOut] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [toggleButton, setToggleButton] = useState(images.lightOff);

  useEffect(() => {
    loadTask();
  }, []);

  const createTodos = () => {
    const todoDate = new Date();
    if (inputRef.current.value.trim() === "") {
      alert("Please enter a task");
    } else {
      const todoArray = {
        id: Math.random().toString(36).substr(2, 9),
        text: inputRef.current.value,
        date: todoDate.toString(),
        completed: false,
        color:
          inputColor.current.value.trim() === ""
            ? "white"
            : inputColor.current.value,
      };
      setCreateTodo([...createTodo, todoArray]);
      setTodos((todos) => todos + 1);
      inputRef.current.value = "";
      inputColor.current.value = "";
      saveTasks([...createTodo, todoArray]);
      setButtonPopOut(false);
    }
  };

  function saveTasks(tasks) {
    localStorage.setItem("todoList", JSON.stringify(tasks));
  }

  function loadTask() {
    const storedTodo = localStorage.getItem("todoList");

    if (storedTodo) {
      try {
        const parsedDate = Array.from(JSON.parse(storedTodo)).map((todo) => ({
          ...todo,
          date: new Date(todo.date),
        }));
        setCreateTodo(parsedDate);
        setTodos(parsedDate.length);
        const doneTasks = parsedDate.filter((todo) => todo.completed).length;
        setCompletedTodos(doneTasks);
      } catch (error) {
        console.log("there's an error ", error);
      }
    }
  }

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createTodos();
      setButtonPopOut(false);
    }
  };

  const handleCheckbox = (i) => {
    setCreateTodo((preTodo) => {
      const newTodo = [...preTodo];
      const todoIndex = newTodo.findIndex((todo) => todo.id === i);
      if (todoIndex === -1) {
        return newTodo;
      }
      newTodo[todoIndex].completed = !newTodo[todoIndex].completed;
      const doneTasks = newTodo.filter((todo) => todo.completed).length;
      setCompletedTodos(doneTasks);

      saveTasks(newTodo);

      return newTodo;
    });
  };

  const deletTodos = (item) => {
    setCreateTodo((preTodo) => {
      const completedTodo = preTodo.find((todo) => todo.id === item);
      const updatingTodo = preTodo.filter((todo) => todo.id !== item);
      setTodos((preTodo) => preTodo - 1);
      if (completedTodo.completed && updatingTodo) {
        setCompletedTodos((preTodo) => preTodo - 1);
      }
      saveTasks(updatingTodo);

      return updatingTodo;
    });
  };

  const editTodos = (item) => {
    setCreateTodo((preTodo) => {
      const newTodo = [...preTodo];
      const todoIndex = newTodo.findIndex((todo) => todo.id === item);
      if (todoIndex === -1) {
        return newTodo;
      }
      const update = prompt("Update Your Task", newTodo[todoIndex].text);
      if (update === null || update.trim() === "") {
        return newTodo;
      } else {
        newTodo[todoIndex].text = update;
        saveTasks(newTodo);
        return newTodo;
      }
    });
  };

  const handleSelect = (e) => {
    setFilterTodo(e.target.value);
  };

  const filterTodo = createTodo.filter((todo) => {
    if (filter === "Completed") {
      return todo.completed;
    } else if (filter === "Incompleted") {
      return !todo.completed;
    }

    return true;
  });

  const PopOut = (props) => {
    return props.trigger ? (
      <div
        className="popOut"
        onClick={(e) => {
          if (e.target.className === "popOut") {
            setButtonPopOut(false);
          }
        }}
      >
        <div className="popOut-inner">{props.children}</div>
      </div>
    ) : (
      ""
    );
  };

  const themeButton = () => {
    setIsDark(!isDark);
    setToggleButton(isDark ? images.lightOff : images.lightOn);
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDark
      ? "rgb(15, 23, 42)"
      : "rgb(241, 245, 249)";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isDark]);

  return (
    <div id={isDark ? "dark-todolist-container" : "light-todolist-container"}>
      <h1 id="title">Todo List</h1>

      {/* Controls Section */}
      <div className="controls-wrapper">
        <button
          onClick={() => {
            setButtonPopOut(true);
          }}
          className="create-btn"
        >
          + New Task
        </button>
        <select onChange={handleSelect} id="select" className="form-select">
          <option value="All">All Tasks</option>
          <option value="Incompleted">Incomplete</option>
          <option value="Completed">Completed</option>
        </select>
        <button className="theme-toggle" onClick={themeButton}>
          {toggleButton}
        </button>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <span className="span">Total: {todos}</span>
        <span className="span">
          Completed: {completedTodos} of {todos}
        </span>
      </div>

      {/* Tasks Container */}
      <div id={isDark ? "dark-tasks-container" : "light-tasks-container"}>
        {filterTodo.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create one to get started!</p>
          </div>
        ) : (
          filterTodo.map((todo) => (
            <div
              key={todo.id}
              style={{ background: todo.color }}
              className="todo"
            >
              <input
                type="checkbox"
                className="form-check-input"
                id={`checkbox-${todo.id}`}
                checked={todo.completed}
                onChange={() => handleCheckbox(todo.id)}
              />
              <label htmlFor={`checkbox-${todo.id}`}>
                {todo.text}
                <br />
                <small style={{ opacity: 0.7, fontSize: "0.85rem" }}>
                  {new Date(todo.date).toLocaleDateString()} •{" "}
                  {new Date(todo.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </label>
              <button
                onClick={() => editTodos(todo.id)}
                className="todo-btn"
                title="Edit task"
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA70lEQVR4nO2XOwrCQBRFT+EnpaLxsy1LN+ACBFdgEKx1D8adCDZGiTtwA7aByMAThpFok3kKzoUphinO5b4LeYE/UQQsgD2wAmJNeAM4AqV1blomIjlToHBMJL7hQ+ACrOXumthpwDMnatvE3Bd8UAG3TZhOtLXh5r4EmlJMdXgm7y0f8Bg4AzkwqoBfgbEveBbghNhfC+emolq4UYDXqTjETnXh8m/Gngd43eoBpw/f86otpxYlwP3NzL3CjQ6yLKbWyvSEm2T6eFTHWZlT2V5U4EYT56ehlHGowI22FriQcSRSTBXNgI0k0dWC/oQeWPlyuT2hGAYAAAAASUVORK5CYII="
                  alt="Edit"
                />
              </button>
              <button
                onClick={() => deletTodos(todo.id)}
                className="todo-btn"
                title="Delete task"
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAg0lEQVR4nO2WwQmAMAxF/8mldAiXEhdtXCMi5GClijbpofgf5NCWJJ+kLQEIqWMGsAHQi4mdNUcKyc8imqNmb/fdiTTI+hMQUVZ3W5QCkJfQu3a3QCkAbAF4CcFnqL/+iL7SvwCxAGOF72S+ySNgDZiEFo+AwUQ8TcJ3liz5EYMQlNgB9dzfjdR/8lgAAAAASUVORK5CYII="
                  alt="Delete"
                />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Task Popup */}
      <PopOut trigger={buttonPopOut}>
        <label htmlFor="task-title">Task Title</label>
        <input
          type="text"
          id="task-title"
          ref={inputRef}
          className="input-field"
          onKeyDown={handleEnter}
          placeholder="Enter your task..."
          autoFocus
        />
        <label htmlFor="task-color">Task Color (optional)</label>
        <input
          type="text"
          id="task-color"
          className="input-field"
          ref={inputColor}
          onKeyDown={handleEnter}
          placeholder="e.g., #ffd700 or lightblue"
        />
        <button onClick={createTodos} className="todo-btn">
          Add Task
        </button>
        <button
          onClick={() => {
            setButtonPopOut(false);
          }}
          className="todo-btn"
        >
          Cancel
        </button>
      </PopOut>
    </div>
  );
}
