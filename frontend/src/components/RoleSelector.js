import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

function RoleSelector() {
  const [role, setRole] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRollNumber, setUserRollNumber] = useState(null); // Store logged-in user's roll number
  const [errorMessage, setErrorMessage] = useState('');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const [facultyUsername, setFacultyUsername] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [isFacultyAuthenticated, setIsFacultyAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRole(e.target.value);
    setIsAuthenticated(false); // Reset login state on role change
    setRollNumber('');
    setPassword('');
    setErrorMessage('');
    setLoginSuccessMessage(''); // Reset success message when role changes
    setFacultyUsername('');
    setFacultyPassword('');
    setIsFacultyAuthenticated(false); // Reset faculty authentication on role change
  };

  const handleStudentLogin = async () => {
    if (rollNumber.trim() === '' || password.trim() === '') {
      alert('Please fill in both Roll Number and Password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNo: rollNumber.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setLoginSuccessMessage('Login Successful!');
        setErrorMessage('');
        setUserRollNumber(rollNumber); // Set logged-in user's roll number
      } else {
        setErrorMessage(data.message || 'Invalid Roll Number or Password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  const handleFacultyLogin = () => {
    // Predefined credentials for faculty
    const predefinedUsername = 'faculty123';
    const predefinedPassword = 'password123';

    if (facultyUsername.trim() === '' || facultyPassword.trim() === '') {
      alert('Please fill in both Username and Password.');
      return;
    }

    if (facultyUsername === predefinedUsername && facultyPassword === predefinedPassword) {
      setIsFacultyAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid Username or Password');
      setIsFacultyAuthenticated(false);
    }
  };

  const styles = {
    container: {
      padding: '3rem 2rem',
      maxWidth: '500px',
      margin: '5rem auto',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #2d3e7f, #4a90e2)',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Roboto, sans-serif',
      textAlign: 'center',
    },
    heading: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '1.5rem',
    },
    radioGroup: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '1.5rem',
    },
    label: {
      fontSize: '1.2rem',
      color: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    roleInfo: {
      fontSize: '1.2rem',
      marginTop: '1rem',
      fontWeight: '500',
      color: '#ffffff',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginTop: '2rem',
    },
    button: {
      padding: '0.8rem 1.5rem',
      fontSize: '1.1rem',
      width: '100%',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#4CAF50',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
    buttonHover: {
      backgroundColor: '#45a049',
      transform: 'translateY(-4px)',
    },
    radioInput: {
      marginRight: '8px',
    },
    icon: {
      fontSize: '1.5rem',
      color: '#ffffff',
    },
    input: {
      padding: '0.7rem',
      fontSize: '1rem',
      width: '100%',
      marginBottom: '1rem',
      border: 'none',
      borderRadius: '5px',
    },
    errorMessage: {
      color: 'red',
      fontSize: '1rem',
      marginTop: '1rem',
    },
    successMessage: {
      color: 'green',
      fontSize: '1.2rem',
      marginTop: '1rem',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Select Your Role</h3>

      <div style={styles.radioGroup}>
        <label style={styles.label}>
          <input
            type="radio"
            name="role"
            value="student"
            checked={role === 'student'}
            onChange={handleChange}
            style={styles.radioInput}
          />
          <FaUserGraduate style={styles.icon} /> Student
        </label>

        <label style={styles.label}>
          <input
            type="radio"
            name="role"
            value="faculty"
            checked={role === 'faculty'}
            onChange={handleChange}
            style={styles.radioInput}
          />
          <FaChalkboardTeacher style={styles.icon} /> Faculty
        </label>
      </div>

      <p style={styles.roleInfo}>
        Selected Role: <strong>{role || 'None'}</strong>
      </p>

      {/* Student Login Form */}
      {role === 'student' && !isAuthenticated && (
        <div style={styles.buttonGroup}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            style={{ ...styles.button, ...styles.buttonHover }}
            onClick={handleStudentLogin}
          >
            Login
          </button>

          {/* Show error message if login failed */}
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

          {/* Show success message if login is successful */}
          {loginSuccessMessage && <p style={styles.successMessage}>{loginSuccessMessage}</p>}
        </div>
      )}

      {/* Student Options After Login */}
      {role === 'student' && isAuthenticated && userRollNumber && (
        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.buttonHover }}
            onClick={() => navigate(`/attendance/${userRollNumber}`)} // Allow student to view their attendance
          >
            View My Attendance
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonHover }}
            onClick={() => navigate(`/marks/${userRollNumber}`)} // Allow student to view their marks
          >
            View My Marks
          </button>
        </div>
      )}

      {/* Faculty Login Form */}
      {role === 'faculty' && !isFacultyAuthenticated && (
        <div style={styles.buttonGroup}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter Username"
            value={facultyUsername}
            onChange={(e) => setFacultyUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Enter Password"
            value={facultyPassword}
            onChange={(e) => setFacultyPassword(e.target.value)}
          />
          <button
            style={{ ...styles.button, ...styles.buttonHover }}
            onClick={handleFacultyLogin}
          >
            Login
          </button>

          {/* Show error message if login failed */}
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        </div>
      )}

      {/* Faculty Options After Login */}
      {role === 'faculty' && isFacultyAuthenticated && (
        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.buttonHover }}
            onClick={() => navigate('/add-student')}
          >
            Add Student
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonHover }}
            onClick={() => navigate('/attendence-form')}
          >
            Add Attendance
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonHover }}
            onClick={() => navigate('/add-marks')}
          >
            Add Marks
          </button>
        </div>
      )}
    </div>
  );
}

export default RoleSelector;
