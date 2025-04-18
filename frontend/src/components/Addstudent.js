import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StudentForm() {
  const [studentClass, setStudentClass] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');

  const generateRollNo = async (classNumber) => {
    const baseRoll = parseInt(`${classNumber}01`); // Start with 'classNumber01' (e.g., Class 1 => 1001)
    
    console.log('Base Roll:', baseRoll); // Debugging: Check the calculated base roll number
    
    try {
      const response = await fetch(`http://localhost:5000/api/students/class/${classNumber}`);
      const students = await response.json();
  
      console.log('Students from API:', students); // Debugging: Check the data fetched from API
      
      const existingRolls = students.map((s) => parseInt(s.rollNo)); // Ensure all roll numbers are integers
      console.log('Existing Rolls:', existingRolls); // Debugging: Check the existing roll numbers in the array
      
      let candidateRoll = baseRoll;
  
      // Increment the roll number until an unused one is found
      while (existingRolls.includes(candidateRoll)) {
        console.log('Candidate Roll before increment:', candidateRoll); // Debugging: Check candidate roll before increment
        candidateRoll = candidateRoll + 1; // Increment roll number by 1 (using candidateRoll + 1)
        console.log('Candidate Roll after increment:', candidateRoll); // Debugging: Check candidate roll after increment
      }
  
      setRollNo(candidateRoll.toString()); // Set the available roll number
      console.log('Final Roll No:', candidateRoll); // Debugging: Log the final available roll number
  
    } catch (err) {
      console.error('Error generating roll number:', err);
      setRollNo(baseRoll.toString()); // Fallback to the base roll number if an error occurs
    }
  };
  
  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setStudentClass(selectedClass);
    if (selectedClass) {
      generateRollNo(selectedClass);
    }
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
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
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
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Class {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Roll No:</label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)} // Allow editing roll number
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
