const login = (userData, jwt) => {
  setUser(userData);
  setToken(jwt);
  localStorage.setItem("token", jwt);

  if (userData.role === "ADMIN") {
    window.location.href = "/admin";
  } else if (userData.role === "SECURITY") {
    window.location.href = "/security";
  } else {
    window.location.href = "/employee";
  }
};
