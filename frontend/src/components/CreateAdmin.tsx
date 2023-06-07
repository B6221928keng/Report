import { SetStateAction, useState } from "react";
import { Box, Button, TextField, Snackbar, Typography } from "@mui/material";
import axios from "axios";

export default function CreateAdmin() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const handleUsernameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setPassword(event.target.value);
  };
  const handleEmployeeNameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setEmployeeName(event.target.value);
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleFormSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // Perform database save operation here
    setOpenSnackbar(true);
    setUsername("");
    setEmail("");
    setPassword("");
    setEmployeeName("");
  };
  const handleSignIn = () => {
    const data = {
      userName: username,
      password: password,
      employeeName: employeeName,
      email: email,
    };

    axios
      .post("http://localhost:8080/signin", data)
      .then((response) => {
        // Handle success
        console.log(response);
      })
      .catch((error) => {
        // Handle error
        console.log(error);
      });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "16px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <TextField
          label="EmployeeName"
          type="employeeName"
          value={employeeName}
          onChange={handleEmployeeNameChange}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Sign In
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Data saved successfully"
      />
    </Box>
  );
}
