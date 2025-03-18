import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

interface Todo {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  frequency: string;
}

const Dashboard: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<string>("");
  const [position, setPosition] = useState<{ right: number; bottom: number }>(
    { right: -20, bottom: 40 }
  );

  useEffect(() => {
    const updateButtonPosition = () => {
      const div = document.querySelector(".position-relative");
      if (div) {
        const rect = div.getBoundingClientRect();
        setPosition({ right: window.innerWidth - rect.right, bottom: window.innerHeight - rect.bottom });
      }
    };

    updateButtonPosition();
    window.addEventListener("resize", updateButtonPosition);
    return () => window.removeEventListener("resize", updateButtonPosition);
  }, []);

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
      await response.json();

      setTodoList((prevTodoList) => prevTodoList.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  const [updatedTodo, setUpdatedTodo] = useState<Todo>({
    _id: "",
    name: "",
    description: "",
    date: "",
    time: "",
    frequency: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTodo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditClick = (todo: Todo) => {
    setUpdatedTodo(todo);
  };

  const updateTodoList = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const updatedData: Todo = await response.json();
      setTodoList((prevTodoList) => prevTodoList.map((todo) => (todo._id === id ? updatedData : todo)));
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, date, time, frequency }),
      });
      const data: Todo = await response.json();
      setTodoList((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const response: Response = await fetch("http://localhost:3000/todos");
        const data: Todo[] = await response.json();
        setTodoList(data);
      } catch (error) {
        console.error("Error fetching data:", (error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval: NodeJS.Timeout = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

    return (
        <p className="position-relative col-12 col-sm-9 col-lg-5 mx-auto overflow-scroll p-2 border" style={{ height: "100vh" }}>
            <h2>Welcome Back Heuro</h2>
        
            <div>
                <h3 style={{ fontSize: "15px" }}>To-Do List</h3>
                <p style={{ fontSize: "13px" }}>Tap on a to-do list to view details...</p>
        
                <div className="d-flex flex-column gap-2">
                {todoList?.map((list: Todo) => (
                    <div key={list._id} className="border text-dark p-2 rounded border-black d-flex align-items-center justify-content-between">
                    <div
                        role="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasTwo"
                        aria-controls="offcanvasTwo"
                        onClick={() => handleEditClick(list)}
                    >
                        <div className="d-flex align-items-center gap-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id={`flexCheck${list._id}`} />
                        </div>
                        <div className="d-flex flex-column text-left">
                            <p style={{ fontSize: "13px" }} className="mb-0">{list.name}</p>
                            <span style={{ fontSize: "11px" }} className="text-sm">{list.description}</span>
                        </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <div className="d-flex flex-column text-left">
                        <label style={{ fontSize: "13px" }}>Due On</label>
                        <div className="d-flex gap-2 align-items-center">
                            <p style={{ fontSize: "11px" }} className="mb-0">{new Date(list.date).toLocaleDateString()}</p>
                            <p style={{ fontSize: "11px" }} className="mb-0">{list.time}</p>
                        </div>
                        </div>
                        <button onClick={() => deleteTodo(list._id)} className="bg-transparent border border-0">
                        <MdDelete size={25} />
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}