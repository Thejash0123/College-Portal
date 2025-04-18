import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let debounceTimer;

function AddAttendance() {
  const [rollNo, setRollNo] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [attendanceInput, setAttendanceInput] = useState('');
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  useEffect(() => {
    clearTimeout(debounceTimer);

    if (rollNo.trim() === '') {
      setAvailabilityMessage('');
      setMessageColor('');
      setStudentDetails(null);
      setAttendanceSubmitted(false);
      return;
    }

    debounceTimer = setTimeout(() => {
      checkRollNoExists(rollNo.trim());
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [rollNo]);

  const checkRollNoExists = async (rollNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${rollNumber}`);

      if (!response.ok) {
        setAvailabilityMessage('Student is not available ❌');
        setMessageColor('red');
        setStudentDetails(null);
        setAttendanceSubmitted(false); // Reset attendance status when student not found
        return;
      }

      const student = await response.json();

      if (student && student.rollNo.toString().trim() === rollNumber) {
        setStudentDetails(student);

        // Check if attendance has been already submitted
        if (student.attendanceSubmitted) {  // Assuming `attendanceSubmitted` flag
          setAvailabilityMessage('Student is available ✅. Attendance is already submitted.');
          setMessageColor('orange');
          setAttendanceSubmitted(true); // Mark attendance as already submitted
        } else {
          setAvailabilityMessage('Student is available ✅. Please enter attendance.');
          setMessageColor('green');
          setAttendanceSubmitted(false); // Mark attendance as not yet submitted
        }
      } else {
        setAvailabilityMessage('Student is not available ❌');
        setMessageColor('red');
        setStudentDetails(null);
        setAttendanceSubmitted(false);
      }
    } catch (error) {
      console.error('Error checking roll number:', error);
      setAvailabilityMessage('Server error. Try again later.');
      setMessageColor('orange');
      setStudentDetails(null);
      setAttendanceSubmitted(false);
    }
  };

  const handleChange = (e) => {
    setRollNo(e.target.value);
  };

  const handleSubmitAttendance = async () => {
    if (attendanceSubmitted) {
      toast.error('Attendance is already submitted for this student.');
      return;
    }

    if (!attendanceInput || isNaN(attendanceInput)) {
      toast.error('Please enter a valid attendance percentage.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students/${rollNo}/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance: attendanceInput + '%',
          name: studentDetails.name,
          rollNo: rollNo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }

      toast.success('Attendance updated successfully!');
      setAttendanceInput('');
      setAttendanceSubmitted(true); // Mark attendance as submitted
      checkRollNoExists(rollNo); // Refresh data after update
    } catch (error) {
      console.error(error);
      toast.error('Attendence already Submitted');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Check and Add Student Attendance</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Enter Roll No:</label>
        <input
          type="text"
          value={rollNo}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          placeholder="e.g. 101"
        />
      </div>

      {availabilityMessage && (
        <div style={{ fontSize: '14px', color: messageColor, marginTop: '5px' }}>
          {availabilityMessage}
        </div>
      )}

      {studentDetails && !attendanceSubmitted && (
        <div
          style={{
            marginTop: '20px',
            fontSize: '14px',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <p><strong>Name:</strong> {studentDetails.name}</p>

          <div style={{ marginTop: '15px' }}>
            <label>Enter Attendance (%):</label>
            <input
              type="number"
              value={attendanceInput}
              onChange={(e) => setAttendanceInput(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="e.g. 90"
            />
            <button
              onClick={handleSubmitAttendance}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Submit Attendance
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default AddAttendance;
