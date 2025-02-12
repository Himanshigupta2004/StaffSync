import axios from 'axios';

export const RegisterRoute = "http://localhost:5000/api/auth/register";

export const loginRoute = "http://localhost:5000/api/auth/login";

export const fetchAttendanceData = async (year, month, token) => {

  const url = `http://localhost:5000/api/att/monthly-record/${year}/${month}`;
  console.log('Making request to:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance data:', error.response || error.message || error);
    throw error;
  }
};



const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem("jwt-token");
  console.log("Token from localStorage:", token);  
  return token;
};


export const markAttendance = async (latitude, longitude) => {
  const token = getTokenFromLocalStorage(); 

  if (!token) {
    console.error("No token found, user is not authenticated.");
    return; 
  }

  const url = "http://localhost:5000/api/att/mark";
  
  try {
    const response = await axios.post(
      url,
      { latitude, longitude },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error marking attendance:", error.response?.data || error.message);
    throw error; 
  }
};



