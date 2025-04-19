const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const RegisterRoute = `${BASE_URL}/api/auth/register`;
export const loginRoute = `${BASE_URL}/api/auth/login`;

export const fetchAttendanceData = async (year, month, token) => {
  const url = `${BASE_URL}/api/att/monthly-record/${year}/${month}`;
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

export const markAttendance = async (latitude, longitude) => {
  const token = localStorage.getItem("jwt-token");
  if (!token) {
    console.error("No token found, user is not authenticated.");
    return; 
  }

  const url = `${BASE_URL}/api/att/mark`;
  
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
