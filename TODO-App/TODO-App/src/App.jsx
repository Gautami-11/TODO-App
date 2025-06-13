import React, { useState, useEffect } from "react";
import icon from "../src/assets/image.png"
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const statusOptions = ["Pending", "In progress", "Completed"];
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");

  const addNote = () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required!");
      return;
    }

    //date handling - not allowing year more than 2031
    const maxAllowedDate = new Date("2031-12-31");
    const selectedDueDate = new Date(dueDate);

    if (dueDate && selectedDueDate > maxAllowedDate) {
      alert("Due date cannot be after 2031-12-31!");
      return;
    }

    if (edit) {
      setNotes(
        notes.map((note) =>
          note.id === editId
            ? {
                ...note,
                title,
                description,
                dueDate,
                status: note.status || "Pending",
              }
            : note
        )
      );
      setEdit(false);
      setEditId(null);
    } else {
      setNotes([
        ...notes,
        { id: Date.now(), title, description, dueDate, status: "Pending" },
      ]);
    }
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setDueDate(note.dueDate || "");
    setEdit(true);
    setEditId(note.id);
  };

  const handleStatusChange = (id, newStatus) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, status: newStatus } : note
      )
    );
  };

  //loading
  useEffect(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem("notes"));
      console.log("Loaded from localStorage:", storedNotes);

      if (storedNotes && storedNotes.length > 0) {
        setNotes(storedNotes);
      }
    } catch (error) {
      console.error("Error parsing notes from localStorage", error);
      setNotes([]);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    console.log("Saving to localStorage:", notes);
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  let filteredNotes = [...notes];

  if (filterStatus !== "All") {
    filteredNotes = filteredNotes.filter(
      (note) => note.status === filterStatus
    );
  }

  if (sortOrder === "Due Date") {
    filteredNotes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortOrder === "Title") {
    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
  }


  return (
  <div >
  <div>
     <header className="flex items-center justify-center bg-gray-800 py-6 px-4 text-amber-300 text-2xl sm:text-3xl md:text-4xl font-normal">
      <div className="flex items-center space-x-4">
        <img src={icon} alt="App Icon" className="w-10  h-10 sm:w-12 sm:h-12" />
        <h1 className="text-center">To-Do List App</h1>
      </div>
    </header>

      <div className=" items-center flex-col p-5 md:flex  ">
        <div>
          <input
            type="text"
            placeholder="Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full   bg-blue-100 border border-cyan-950 text-cyan-950  rounded px-3 py-2 mb-3"           />
          <textarea
            placeholder="Comments"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full  bg-blue-100 border border-cyan-950 text-cyan-950 rounded px-3 py-2 mb-3"
            rows="2"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            max="2031-12-31"
            className="w-full    bg-blue-100 border border-cyan-950 text-cyan-950 rounded px-3 py-2 mb-3"
          /> 
          <button
            onClick={addNote}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg m-2  hover:bg-blue-800 text-center"
          >
            {edit ? "Update" : "Add"}
          </button>
          <div className=" gap-4   justify-center my-4">
            <select className="bg-blue-600 text-white px-4 py-2 m-2 rounded-lg hover:bg-blue-800 " onChange={(e) => setFilterStatus(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>In progress</option>
              <option>Completed</option>
            </select>

            <select  className="bg-blue-600 text-white px-4 py-2 m-2 rounded-lg hover:bg-blue-800" onChange={(e) => setSortOrder(e.target.value)}>
              <option>None</option>
              <option>Due Date</option>
              <option>Title</option>
            </select>
          </div>
        </div>
      </div>
      
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 p-4   xl:grid-cols-4 2xl:grid-cols-5">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-3 rounded-xl shadow-lg flex justify-evenly items-center mb-5 mt-5 bg-gray-700 "
          >
            <div className="mb-4">
        <h3 className="text-xl font-bold text-white ">{note.title}</h3>
        <p className="text-white  mt-2">{note.description}</p>
        <p className="text-sm text-white  mt-2">Due Date: {note.dueDate || "Not set"}</p>
            </div>

            <div className=" mt-auto">
            <select
              value={note.status}
              onChange={(e) => handleStatusChange(note.id, e.target.value)}
              className="p-2  m-2 rounded-lg bg-purple-900 hover:bg-purple-950 text-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className=" flex-col">
              <button
                onClick={() => deleteNote(note.id)}
                className="bg-red-500 m-2 text-white px-2 py-1 rounded mb-2 hover:bg-red-800"
              >
                Delete
              </button>
              <button
                onClick={() => editNote(note)}
                className="bg-green-500 m-2 text-white px-2 py-1 rounded hover:bg-green-800"
              >
                Edit
              </button>
            </div>
          </div>
          </div>
        ))}
        
      </div>
    </div>
    </div>
  );
}

export default App;

