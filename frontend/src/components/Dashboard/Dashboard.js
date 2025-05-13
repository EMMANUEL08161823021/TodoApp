import React from 'react'
import { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import "bootstrap/dist/js/bootstrap.bundle.min";

// https://tasknest-6kyq.onrender.com


const Dashboard = () => {

    // const todoUrl = process.env.TODO_API_BASE_URL;


    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [todoList, setTodoList] = useState([])
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const [Loading, setLoading] = useState(false)
    const [frequency, setFrequency] = useState("");
    const [position, setPosition] = useState({ right: '-20%', bottom: 40 });

    const YourComponent = () => {
    
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
    }

    const deleteTodo = async(id)=> {
        // e.preventDefault();

        try {
            const response = await fetch(`https://tasknest-6kyq.onrender.com/todos/${id}`, {
                method: 'DELETE',

            });
            const data = await response.json()

            console.log(data);
            
            setTodoList((prevTodoList) => prevTodoList.filter(todo => todo._id !== id));
            // setTodoList(todoList.filter(todo => todo._id !== id))
        } catch (error) {
            console.log('error', error.message);
            
            
        }

    }
    

    const [updatedTodo, setUpdatedTodo] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        frequency: '',
    });
    
    const handleChange = (e) => {
        setUpdatedTodo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    
    const handleEditClick = (list) => {

        setUpdatedTodo({
            id: list._id,
            name: list.name || '',
            description: list.description || '',
            date: list.date || '',
            time: list.time || '',
            frequency: list.frequency || '',
        });
        
    };

    const updateTodo = async (e, id) => {
        e.preventDefault();
        
        try {
            // ✅ Extract only updated fields (no unnecessary data)
            const updates = {};
            if (updatedTodo.name) updates.name = updatedTodo.name;
            if (updatedTodo.description) updates.description = updatedTodo.description;
            if (updatedTodo.date) updates.date = new Date(updatedTodo.date).toISOString(); // Format date
            if (updatedTodo.time) updates.time = updatedTodo.time;
            if (updatedTodo.frequency) updates.frequency = updatedTodo.frequency;
    
            const response = await fetch(`https://tasknest-6kyq.onrender.com/todos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates), // ✅ Send only updated fields
            });
            if (!response.ok) throw new Error("Failed to update task");

            setMessage("Task updated successfully! ✅");
            setMessageType("success");
            setShowMessage(true); // ✅ Show message

            setTimeout(() => setMessage(""), 3000);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const updatedData = await response.json();
            console.log("Updated Todo Saved:", updatedData);
    
            // ✅ Update UI efficiently
            setTodoList((prev) =>
                prev.map((todo) => (todo._id === id ? updatedData : todo))
            );

        } catch (error) {
            setMessage("Failed to update task ❌");
            console.error("Error updating todo:", error);
        }
    };
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://tasknest-6kyq.onrender.com/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, date, time, frequency }),
            });
    
            if (!response.ok) throw new Error("Failed to create task");
            console.log("Submitting task with:", { name, description, date, time, frequency });
            
    
            const data = await response.json();
            console.log("New Task Created:", data);
    
            setMessage("Task Created successfully! ✅");
            setMessageType("success");
            setShowMessage(true);
    
            setTimeout(() => setShowMessage(false), 3000); // Hide after 3 sec
    
            setTodoList((prev) => [data, ...prev]); // ✅ Add new task to top
    
    
        } catch (error) {
            setMessage("Failed to create task ❌");
            setMessageType("error");
            setShowMessage(true);
            console.error("Error:", error.message);
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://tasknest-6kyq.onrender.com/todos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                const data = await response.json();
    
                const sortedTodos = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTodoList(sortedTodos);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    
        // Refresh every 10 seconds instead of 1s
        const interval = setInterval(fetchData, 10000);
    
        return () => clearInterval(interval);
    }, []);
    



    return (
        <div className='position-relative col-12 col-sm-9 col-lg-5 mx-auto overflow-scroll p-2 border' style={{height: '100vh'}}>
            <h2>Welcome Back</h2>

            <div className=''>
                <h3 style={{fontSize: '15px'}}>To-Do List</h3>
                <p style={{fontSize: '13px'}}>Tap on a to-do list to view details and tap on the plus icon to create a new to-do list</p>


                <div className='d-flex flex-column gap-2'>
                    {
                        todoList.map((list, index)=> (
                            <div className='border text-dark p-2 rounded border-black d-flex align-items-center justify-content-between'>

                                <div className="col-7">
                                    <div className='d-flex align-items-center gap-1'>
                                        <div class="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flexCheckDefault"
                                               
                                            />                                        
                                        </div>                        
                                        <div
                                            type="button" 
                                            data-bs-toggle="offcanvas" 
                                            data-bs-target="#offcanvasTwo" 
                                            aria-controls="offcanvasTwo"
                                            key={index} 
                                            onClick={() => handleEditClick(list)}
                                            style={{width: '100%'}} 
                                            className='d-flex flex-column text-left'>
                                            <p style={{fontSize: '13px'}} className='mb-0'>{list.name}</p>
                                            <span style={{fontSize: '11px'}} className='text-sm'>{list.description}</span>
                                        </div>
                                    </div>
                                    
                
                                </div>
                                <div className='col-4 d-flex justify-content-between align-items-center'>
                                    <div className='d-flex flex-column text-left'>
                                        <label style={{fontSize: '13px'}}>Due On</label>
                                        <p style={{fontSize: '11px'}} className='mb-0'>{new Date(list.date).toLocaleDateString()}</p>                                            
                                        
                                    </div>
                                    <button onClick={()=> deleteTodo(list._id)} className='bg-transparent border border-0'><MdDelete size={25} /></button>
                                </div>
                            </div>
                            
                        ))
                    }
                    <div className="col-12 col-sm-9 col-lg-5 mx-auto offcanvas offcanvas-bottom" style={{height: '100vh'}} id="offcanvasOne" tabIndex="-1" aria-labelledby="offcanvasOneLabel">
                        {showMessage && (
                            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} text-center`} role="alert">
                                {message}
                            </div>
                        )}
                        <div className="offcanvas-body small">
                            <h2>Create a new to-do list</h2>
                            <p>Please fill out this form to ensure a secure and customised learning journey</p>
                            <form className='container px-0'>
                                <div className='d-flex flex-column gap-2'>
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <label>Task Name</label>
                                        <input
                                            className='input border border-dark p-3 rounded'
                                            name='name'
                                            type='text'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder='Kindly enter the title of the task'
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label>Description</label>
                                        <input
                                            className='p-3 border border-dark rounded'
                                            name='description'
                                            type='text'
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            placeholder='What it entails'
                                        />
                                    </div>
                                    <div className='d-flex flex-column col-12'>
                                        <label>Task Date and Time</label>
                                        <div style={{width: '100%'}} className='d-flex justify-content-between align-items-center'>
                                            <div style={{width: '45%'}} className='d-flex flex-column'>
                                                <label>Date</label>
                                                <input
                                                    className='p-3 border border-dark  rounded'
                                                    name='date'
                                                    type='date'
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    required
                                                    // placeholder='Your password'
                                                />
                                            </div>
                                            <div style={{width: '45%'}} className='d-flex flex-column'>
                                                <label>Time</label>
                                                <input
                                                    className='p-3 border border-dark  rounded'
                                                    name='time'
                                                    type='time'
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label>How often will you like to have this todo?</label>
                                        <input
                                            className='p-3 border border-dark rounded'
                                            name='frequency'
                                            type='text'
                                            value={frequency}
                                            onChange={(e) => setFrequency(e.target.value)}
                                            required
                                            placeholder='daily, weekly, monthly'
                                        />
                                    </div>
                                    
                    
                                    <div className='d-flex justify-content-between mt-2 align-items-center' style={{ width: '100%' }}>
                                        <button style={{ width: '45%' }} className='button col-6 p-3 border border-dark rounded-pill' data-bs-dismiss="offcanvas" type='submit'>Cancel</button>
                                        <button style={{ width: '45%' }} onClick={handleCreateTask} className='button col-6 p-3 border border-dark bg-dark text-white rounded-pill' type='submit'>Save</button>
                                    </div>
                            
                                </div>
                            </form>
                        </div>
                    </div>
                   
                </div>

                {/* Open Offcanvas 1 */}
               
                <button 
                    className="btn btn-primary d-flex justify-content-center p-3 m-3 rounded-circle position-fixed"
                    style={{ bottom: `${position.bottom}px`, right: `${position.right}px` }}
                    data-bs-toggle="offcanvas" 
                    data-bs-target="#offcanvasOne" 
                    aria-controls="offcanvasOne">
                    <IoAdd size={25} />
                </button>

            </div>

            {/* Canvas 2 */}
            <div className="col-12 col-sm-9 col-lg-5 mx-auto offcanvas offcanvas-bottom" style={{height: '100vh'}} id="offcanvasTwo" tabIndex="-1" aria-labelledby="offcanvasTwoLabel">
                {showMessage && (
                    <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} text-center`} role="alert">
                        {message}
                    </div>
                )}
                <div class="offcanvas-body small">
                    <h2>Edit a new to-do list</h2>
                    <p style={{fontSize: '13px'}}>Please fill out this form to ensure a secure and customised learning journey</p>
                    <form className='container px-0'>
                        <div className='d-flex flex-column gap-2'>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <label style={{fontSize: '13px'}}>Task Name</label>
                                <input
                                    className='input border border-dark p-3 rounded'
                                    name='name'
                                    type='text'
                                    value={updatedTodo.name} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="Name the task title"
                                />
                            </div>
                            <div className='d-flex flex-column'>
                                <label style={{fontSize: '13px'}}>Description</label>
                                <input
                                    className='p-3 border border-dark rounded'
                                    name='description'
                                    type='text'
                                    value={updatedTodo.description} 
                                    onChange={handleChange} 
                                    required
                                    placeholder='What it entails'
                                />
                            </div>
                            <div style={{width: '100%'}} className='d-flex justify-content-between align-items-center'>
                                <div style={{width: '45%'}} className='d-flex  flex-column'>
                                    <label style={{fontSize: '13px'}}>Date</label>
                                    <input
                                        className="p-3 border border-dark rounded"
                                        name="date"
                                        type="date"
                                        value={updatedTodo.date ? updatedTodo.date.split("T")[0] : ""} 
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div style={{width: '45%'}} className='d-flex  flex-column'>
                                    <label style={{fontSize: '13px'}}>Time</label>
                                    <input
                                        className='p-3 border border-dark  rounded'
                                        name='time'
                                        type='time'
                                        value={updatedTodo.time} 
                                        onChange={handleChange} 
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{fontSize: '13px'}}>How often will you like to have this todo?</label>
                                <input
                                    className='p-3 border border-dark rounded'
                                    name='frequency'
                                    type='text'
                                    value={updatedTodo.frequency} 
                                    onChange={handleChange} 
                                    required
                                    placeholder='daily, weekly, monthly'
                                />
                            </div>
                            
                            <div className='mt-2 d-flex justify-content-between align-items-center' style={{width:'100%'}}>
                                <button onClick={(e)=> e.preventDefault()} style={{width:'45%'}} className='button p-3 border border-dark rounded-pill' data-bs-dismiss="offcanvas" type='submit'>Cancel</button>
                                <button onClick={(e)=> updateTodo(e, updatedTodo.id)} style={{width:'45%'}} className='button p-3 bg-dark text-white border border-dark rounded-pill' type='submit'>Save</button>
                            </div>
                    
                        </div>
                    </form>
                </div>
            </div>
     
    
        </div>
    )
}

export default Dashboard