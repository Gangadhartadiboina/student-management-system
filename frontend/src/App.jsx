
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    course: ""
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const API = "http://127.0.0.1:5000/students";

  // Get all students
  const getStudents = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setStudents(data);
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update Student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        age: Number(form.age)
      })
    });

    if (response.ok) {
      alert(editId ? "Student Updated!" : "Student Added!");

      setForm({
        name: "",
        email: "",
        age: "",
        course: ""
      });

      setEditId(null);
      getStudents();
    } else {
      alert("Operation failed");
    }
  };

  // Edit Student
  const editStudent = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      age: student.age,
      course: student.course
    });

    setEditId(student.id);
  };

  // Delete Student
  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure?")) {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        alert("Student Deleted!");
        getStudents();
      }
    }
  };

  // Search Students
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Enter Student Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Enter Age"
          value={form.age}
          onChange={handleChange}
          min="1"
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Enter Course"
          value={form.course}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>

      </form>

      <h2>Student Details</h2>

      <input
        type="text"
        placeholder="Search Student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>

              <td>
                <button onClick={() => editStudent(student)}>
                  Edit
                </button>

                <button onClick={() => deleteStudent(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredStudents.length === 0 && (
            <tr>
              <td colSpan="6">No students found</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default App;
