import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let debounceTimer;

function Addmarks() {
  const [rollNo, setRollNo] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [marks, setMarks] = useState({
    english: '',
    mathematics: '',
    science: '',
    ai_ml: '',
    cloud: ''
  });
  const [totalMarks, setTotalMarks] = useState(0);
  const [result, setResult] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [marksAlreadyAdded, setMarksAlreadyAdded] = useState(false);

  useEffect(() => {
    clearTimeout(debounceTimer);

    if (rollNo.trim() === '') {
      setAvailabilityMessage('');
      setMessageColor('');
      setStudentDetails(null);
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
        return;
      }

      const student = await response.json();

      if (student && student.rollNo.toString().trim() === rollNumber) {
        setAvailabilityMessage('Student is available ✅');
        setMessageColor('green');
        setStudentDetails(student);
        checkMarksExist(rollNumber);
      } else {
        setAvailabilityMessage('Student is not available ❌');
        setMessageColor('red');
        setStudentDetails(null);
      }
    } catch (error) {
      console.error('Error checking roll number:', error);
      setAvailabilityMessage('Server error. Try again later.');
      setMessageColor('orange');
      setStudentDetails(null);
    }
  };

  const checkMarksExist = async (rollNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${rollNumber}/marks`);
      const data = await response.json();

      if (data && data.totalMarks > 0) {
        setMarksAlreadyAdded(true);
      } else {
        setMarksAlreadyAdded(false);
      }
    } catch (error) {
      console.error('Error checking marks:', error);
      setMarksAlreadyAdded(false);
    }
  };

  const handleChange = (e) => {
    setRollNo(e.target.value);
  };

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
    setMarks((prevMarks) => ({ ...prevMarks, [name]: value }));
  };

  const calculateTotalMarks = () => {
    const total = Object.values(marks).reduce((acc, mark) => acc + (parseInt(mark) || 0), 0);
    setTotalMarks(total);
    evaluatePassFail(total);
  };

  const evaluatePassFail = (total) => {
    const pass = total >= 250;
    setResult(pass ? 'Pass' : 'Fail');
  };

  const handleSubmitMarks = async () => {
    if (marksAlreadyAdded) {
      toast.error('Marks already added for this roll number.');
      return;
    }

    if (isNaN(totalMarks) || totalMarks === 0) {
      toast.error('Please calculate marks before submitting.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students/${rollNo}/marks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollNo: rollNo,
          name: studentDetails.name,
          totalMarks: totalMarks,
          result: result,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update marks');
      }

      toast.success('Marks submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error('Error submitting marks. Try again later.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Check Student Roll Number</h2>
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

      {studentDetails && (
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

          {!marksAlreadyAdded ? (
            <div style={{ marginTop: '15px' }}>
              <label>English:</label>
              <input
                type="number"
                name="english"
                value={marks.english}
                onChange={handleMarksChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              <label>Mathematics:</label>
              <input
                type="number"
                name="mathematics"
                value={marks.mathematics}
                onChange={handleMarksChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              <label>Science:</label>
              <input
                type="number"
                name="science"
                value={marks.science}
                onChange={handleMarksChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              <label>AI/ML:</label>
              <input
                type="number"
                name="ai_ml"
                value={marks.ai_ml}
                onChange={handleMarksChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              <label>Cloud:</label>
              <input
                type="number"
                name="cloud"
                value={marks.cloud}
                onChange={handleMarksChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              <button
                onClick={calculateTotalMarks}
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
                Calculate Total Marks
              </button>

              {totalMarks > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <p><strong>Total Marks:</strong> {totalMarks}</p>
                  <p><strong>Result:</strong> {result}</p>
                </div>
              )}

              <button
                onClick={handleSubmitMarks}
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
                Submit Marks
              </button>
            </div>
          ) : (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Marks have already been added for this student.
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Addmarks;
