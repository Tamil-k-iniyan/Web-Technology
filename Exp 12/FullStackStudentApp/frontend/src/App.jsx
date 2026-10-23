import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/students";

function App() {
  const emptyForm = {
    regNo: "",
    name: "",
    department: "",
    email: "",
    cgpa: ""
  };

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  async function fetchStudents() {
    try {
      const response = await axios.get(API);
      setStudents(response.data);
    } catch {
      setMessage("Cannot load students. Check the backend and MongoDB.");
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadStudents() {
      try {
        const response = await axios.get(API);

        if (!ignore) {
          setStudents(response.data);
      }
      } catch {
        if (!ignore) {
          setMessage(
            "Cannot load students. Check the backend and MongoDB."
          );
        }
      }
    }

    loadStudents();

    return () => {
      ignore = true;
    };
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const data = {
        ...formData,
        cgpa: formData.cgpa === "" ? undefined : Number(formData.cgpa)
      };

      if (editId) {
        await axios.put(`${API}/${editId}`, data);
        setMessage("Student updated successfully!");
      } else {
        await axios.post(API, data);
        setMessage("Student added successfully!");
      }

      setFormData(emptyForm);
      setEditId(null);
      await fetchStudents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Operation failed.");
    }
  }
  function handleEdit(student) {
    setFormData({
      regNo: student.regNo,
      name: student.name,
      department: student.department,
      email: student.email || "",
      cgpa: student.cgpa ?? ""
    });
    setEditId(student._id);
    setMessage("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      setMessage("Student deleted successfully!");
      if (editId === id) {
        setEditId(null);
        setFormData(emptyForm);
      }
      await fetchStudents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed.");
    }
  }

  return (
    <main className="container">
      <h1>Student Management System</h1>
      <p className="subtitle">
        Full Stack Application using React, Node.js and MongoDB
      </p>

      <form onSubmit={handleSubmit} className="student-form">
        <input
          name="regNo"
          placeholder="Register Number"
          value={formData.regNo}
          onChange={handleChange}
          required
        />

        <input
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="number"
          name="cgpa"
          placeholder="CGPA"
          min="0"
          max="10"
          step="0.01"
          value={formData.cgpa}
          onChange={handleChange}
        />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {message && <p className="message">{message}</p>}

      <h2>Student List</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Register No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>CGPA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.regNo}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>{student.email}</td>
                <td>{student.cgpa}</td>
                <td>
                  <button onClick={() => handleEdit(student)}>
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="6">No student records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default App;
