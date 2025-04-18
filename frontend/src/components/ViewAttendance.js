import React, { useEffect, useState } from 'react';
import { FaUserCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

function ViewAttendance() {
  const { rollNo } = useParams(); // Use the correct param name from the route
  const [rollNoState, setRollNoState] = useState(rollNo || '');
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update state when the rollNo from URL changes
  useEffect(() => {
    if (rollNo) {
      setRollNoState(rollNo);
    }
  }, [rollNo]);

  const handleShowAttendance = async () => {
    setLoading(true);
    setAttendance(null);

    try {
      const response = await fetch(`http://localhost:5000/api/attendance/${rollNoState}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }

      const data = await response.json();

      if (data.records && data.records.length > 0) {
        setAttendance(data.records);
      } else {
        setAttendance({ error: 'No record found for this Roll Number.' });
      }
    } catch (error) {
      setAttendance({ error: 'Error fetching attendance. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Attendance Details</h2>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <label htmlFor="rollNo">Roll Number:</label><br />
        <input
          type="text"
          id="rollNo"
          value={rollNoState}
          readOnly
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            textAlign: 'center'
          }}
        />
      </div>

      <button onClick={handleShowAttendance} style={styles.button} disabled={loading}>
        {loading ? 'Loading...' : 'Show Attendance'}
      </button>

      <div style={styles.resultContainer}>
        {attendance && attendance.error && (
          <div style={styles.errorContainer}>
            <FaExclamationTriangle size={30} style={{ marginRight: '1rem', color: '#D32F2F' }} />
            <p style={styles.error}>{attendance.error}</p>
          </div>
        )}

        {attendance && !attendance.error && Array.isArray(attendance) && attendance.length > 0 && (
          <div style={styles.resultCard}>
            <FaUserCheck size={30} style={{ color: '#4CAF50', marginBottom: '1rem' }} />
            {attendance.map((record, index) => (
              <div key={index} style={styles.resultText}>
                <p><strong>Name:</strong> {record.name}</p>
                <p><strong>Roll No:</strong> {record.rollNo}</p>
                <p><strong>Attendance:</strong> {record.attendance}</p>

                {parseInt(record.attendance.replace('%', '')) < 70 && (
                  <p style={styles.shortageText}>⚠️ <strong>Attendance Shortage</strong> – Please maintain minimum 70%!</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: 'auto',
    background: 'linear-gradient(145deg, #f1f1f1, #d3d3d3)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2.2rem',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  button: {
    padding: '0.8rem 1.5rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    display: 'block',
    margin: '0 auto',
  },
  resultContainer: {
    marginTop: '1.5rem',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    color: '#D32F2F',
    fontWeight: '500',
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  error: {
    fontSize: '1rem',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  resultText: {
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '0.8rem',
  },
  shortageText: {
    fontSize: '1rem',
    color: '#FF5722',
    marginTop: '1rem',
  },
};

export default ViewAttendance;
