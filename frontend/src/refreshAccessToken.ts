import api from "./api";

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
      console.error("Refresh token not available. Please log in again.");
      return null;
    }

    const response = await api.post("/token/refresh/", {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;
    localStorage.setItem("access", newAccessToken); // Update the access token in local storage
    return newAccessToken;
  } catch (err) {
    console.error("Failed to refresh access token:", err);
    return null;
  }
};

export default refreshAccessToken;
