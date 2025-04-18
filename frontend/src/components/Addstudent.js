import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StudentForm() {
  const [studentClass, setStudentClass] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');

  const handleClassChange = (e) => {
    setStudentClass(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rollNo && name && studentClass) {
      const newStudent = { rollNo, name, class: studentClass };

      try {
        const response = await fetch('http://localhost:5000/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newStudent),
        });

        if (response.ok) {
          setRollNo('');
          setName('');
          setStudentClass('');
          toast.success('Student added successfully!', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          toast.error('❌ Failed to save student');
        }
      } catch (error) {
        toast.error('❌ Error: Could not connect to server');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Class:</label>
          <select
            value={studentClass}
            onChange={handleClassChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select Class</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Roll No:</label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Add Student
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}

export default StudentForm;
