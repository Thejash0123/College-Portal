import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaTimesCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom'; // Use this hook to extract URL params

function ViewResult() {
  const { rollNo: rollNoFromUrl } = useParams(); // Extract rollNo from URL
  const [rollNo, setRollNo] = useState(rollNoFromUrl || ''); // Set it in state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle result fetch based on roll number
  const handleShowResult = async () => {
    if (!rollNo) {
      setResult({ error: 'Please enter your Roll Number.' });
      return;
    }

    // Check if roll number is 6 digits
    if (rollNo.length !== 4 || !/^\d+$/.test(rollNo)) {
      setResult({ error: 'Invalid Roll Number format. It must be 6 digits.' });
      return;
    }

    setLoading(true);
    setResult(null); // Clear previous result

    try {
      const response = await fetch(`http://localhost:5000/api/marks/${rollNo}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setResult({ error: data.message || 'No record found for this Roll Number.' });
      }
    } catch (error) {
      setResult({ error: 'Error fetching result. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  // Update rollNo from URL if it changes
  useEffect(() => {
    setRollNo(rollNoFromUrl);
  }, [rollNoFromUrl]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Exam Result</h2>
      <p style={styles.subHeading}>Enter your Roll Number to view your result.</p>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNo}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleShowResult()}
          onChange={(e) => {
            setRollNo(e.target.value);
            setResult(null); // Clear old result when typing
          }}
          style={styles.input}
          readOnly
        />
        <button
          onClick={handleShowResult}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#90CAF9' : '#1976D2',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Show Result'}
        </button>
      </div>

      <div style={styles.resultContainer}>
        {result && result.error && (
          <div style={styles.errorContainer}>
            <FaTimesCircle size={28} style={{ marginRight: '1rem', color: '#D32F2F' }} />
            <p style={styles.error}>{result.error}</p>
          </div>
        )}

        {result && !result.error && (
          <div style={styles.resultCard}>
            <FaUserGraduate size={30} style={{ color: '#1976D2', marginBottom: '1rem' }} />
            <p style={styles.resultText}><strong>Name:</strong> {result.name}</p>
            <p style={styles.resultText}><strong>Roll No:</strong> {rollNo}</p>
            <p style={styles.resultText}><strong>Total Marks:</strong> {result.totalMarks}</p>
            <p
              style={{
                ...styles.resultText,
                color: result.result === 'Fail' ? '#D32F2F' : '#4CAF50',
                fontWeight: '600',
              }}
            >
              <strong>Result:</strong> {result.result}
            </p>
            {result.result === 'Fail' && (
              <p style={styles.failNote}>⚠️ You have failed. Please try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 Styles
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
  subHeading: {
    fontSize: '1.1rem',
    color: '#555',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  button: {
    padding: '0.8rem 1.5rem',
    fontSize: '1.1rem',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
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
  failNote: {
    fontSize: '1rem',
    color: '#D32F2F',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
};

export default ViewResult;
