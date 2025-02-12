import React from 'react';

import MarkAttendance from '../components/MarkAttendance';
import CountMonthlyAttendance from '../components/CountMonthlyAttendance';

const Attendance = () => {
  return (
    <div style={styles.container}>
      <MarkAttendance />
      <CountMonthlyAttendance />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',  
    justifyContent: 'center',  // Centers content horizontally
    alignItems: 'flex-start',  // Aligns items to the top
    gap: '20px',  // Adds space between components
    width: '100%',  // Ensures full width
    padding: '20px',  // Adds some padding
  },
};

export default Attendance;
