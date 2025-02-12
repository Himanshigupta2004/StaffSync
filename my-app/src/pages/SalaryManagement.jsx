import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SalaryManagement.css';
const ManageEmployeeSalary = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newSalary, setNewSalary] = useState({
    baseSalary: '',
    bonus: '',
    extraHoursWorked: '',
  });
  const [salaryId, setSalaryId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [salaryLoading, setSalaryLoading] = useState(false);

  const getTokenFromLocalStorage = () => {
    return localStorage.getItem('jwt-token');
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const token = getTokenFromLocalStorage();
        if (!token) {
          setMessage('You need to log in to manage employees.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/allusers', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          const filteredEmployees = response.data.filter(employee => employee.role === 'employee');
          setEmployees(filteredEmployees);
        } else {
          setMessage('No employees found.');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setMessage(error.response?.data?.message || 'Error fetching employees');
      }
      setLoading(false);
    };

    fetchEmployees();
  }, []);

  const handleEmployeeClick = async (employee) => {
    setSelectedEmployee(employee);
    setSalaryId("");
    setNewSalary({
      baseSalary: "",
      bonus: "",
      extraHoursWorked: "",
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; 
  
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        setMessage("You need to log in to fetch salary details.");
        return;
      }
  
      const response = await axios.get(
        `http://localhost:5000/api/salary/getsalarydetails/${currentYear}/${currentMonth}/${employee._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("API Response:", response.data); 
  
      const salary = response.data.salary; 
      if (salary) {
        setSalaryId(salary._id); 
        setNewSalary({
          baseSalary: salary.baseSalary,
          bonus: salary.bonus,
          extraHoursWorked: salary.extraHoursWorked, 
        });
      } else {
        setSalaryId("");
        setMessage(
          "No salary record found for this employee in the selected month. Please calculate and save."
        );
      }
    } catch (error) {
      console.error("Error fetching salary details:", error);
      setMessage(
        error.response?.data?.message || "Error fetching salary details."
      );
    }
};

  
  const handleSalaryUpdateOrSave = async (e) => {
    e.preventDefault();

    const { baseSalary, bonus, extraHoursWorked } = newSalary;

    if (!baseSalary || !bonus || !extraHoursWorked) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (isNaN(baseSalary) || isNaN(bonus) || isNaN(extraHoursWorked)) {
      setMessage('Please enter valid numeric values.');
      return;
    }

    const token = getTokenFromLocalStorage();
    if (!token) {
      setMessage('You need to log in to update or save salary.');
      return;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    setSalaryLoading(true);

    if (salaryId) {
      try {
        const response = await axios.patch(
          `http://localhost:5000/api/salary/update-salary/${salaryId}`,
          { baseSalary, bonus, extraHoursWorked },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error updating salary');
      }
    } else {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/salary/calculate-salary/${currentMonth}/${currentYear}/${selectedEmployee._id}`,
          { baseSalary, bonus, extraHoursWorked },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(response.data.message);
        setSalaryId(response.data.salaryId);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error saving salary');
      }
    }

    setSalaryLoading(false);
  };

  const handleSalaryDelete = async () => {
    if (!salaryId) {
      setMessage('No salary record found to delete');
      return;
    }

    const token = getTokenFromLocalStorage();
    if (!token) {
      setMessage('You need to log in to delete salary.');
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/salary/delete-salary/${salaryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setSelectedEmployee(null);
      setNewSalary({
        baseSalary: '',
        bonus: '',
        extraHoursWorked: '',
      });
      setSalaryId('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting salary');
    }
  };

  return (
    <div className='manage-salary-hr'>
      <h2>Manage Employee Salary</h2>

    
      <div>
        <h3>Employees</h3>
        {loading ? (
          <p>Loading employees...</p>
        ) : (
          <ul>
            {employees.length === 0 ? (
              <p>No employees found.</p>
            ) : (
              employees.map((employee) => (
                <li key={employee._id} onClick={() => handleEmployeeClick(employee)}>
                  {employee.username}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {selectedEmployee && (
        <div >
          <h3>Manage Salary for {selectedEmployee.username}</h3>

          <form onSubmit={handleSalaryUpdateOrSave}>
            <label>
              Base Salary:
              <input
                type="number"
                value={newSalary.baseSalary}
                onChange={(e) => setNewSalary({ ...newSalary, baseSalary: e.target.value })}
              />
            </label>
            <label>
              Bonus:
              <input
                type="number"
                value={newSalary.bonus}
                onChange={(e) => setNewSalary({ ...newSalary, bonus: e.target.value })}
              />
            </label>
            <label>
              Extra Hours Worked:
              <input
                type="number"
                value={newSalary.extraHoursWorked}
                onChange={(e) => setNewSalary({ ...newSalary, extraHoursWorked: e.target.value })}
              />
            </label>

            {!salaryId ? (
              <button type="submit" disabled={salaryLoading}>
                {salaryLoading ? 'Processing...' : 'Calculate and Save Salary'}
              </button>
            ) : (
              <>
                <button type="submit" disabled={salaryLoading}>
                  {salaryLoading ? 'Processing...' : 'Update Salary'}
                </button>
                <button type="button" onClick={handleSalaryDelete}>
                  Delete Salary
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ManageEmployeeSalary;
