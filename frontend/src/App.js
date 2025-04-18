import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelector from './components/RoleSelector';
import ViewAttendance from './components/ViewAttendance';
import Addstudent from './components/Addstudent'
import AttendanceForm from './components/Addattendence';
import Addmarks from './components/Addmarks';
import ViewResult from './components/ViewResult';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelector />} />
       
        <Route path="/add-student" element={<Addstudent />} />
        <Route path="/attendence-form" element={<AttendanceForm />} />
        <Route path="/add-marks" element={<Addmarks />} />
        <Route path="/marks/:rollNo" element={<ViewResult />} />
        <Route path="/attendance/:rollNo" element={<ViewAttendance />} />


     
        
      </Routes>
    </Router>
  );
}

export default App;
