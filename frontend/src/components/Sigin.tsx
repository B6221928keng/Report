import { Alert, Box, Typography, Button, Snackbar, TextField, Link, Grid } from "@mui/material";
import { useState } from "react";
import './signin.css';
import { Link as RouterLink } from 'react-router-dom';
import { SigninInterface } from "../models/ISignin";
import frame from './image/frame.svg';
import img from './image/logo.jpg';
import background from './image/background.jpg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CraeteAdmin from "./CraeteAdmin";
// import logo from './../image/logo.png'
export default function Signin() {
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [signin, setSignin] = useState<Partial<SigninInterface>>({});

    const handleClose: any = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };

    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof signin;
        const { value } = event.target;

        setSignin({ ...signin, [id]: value });
    };

    const login = () => {
        const apiUrl = "http://localhost:8080/signin";
        const requestOptions: any = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signin)
        };

        fetch(apiUrl, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    setSuccess(true);
                    localStorage.setItem("token", res.data.Token);
                    localStorage.setItem("uid", res.data.user_id);
                    localStorage.setItem("pid", res.data.p_id);
                    localStorage.setItem("role", res.data.role_name);
                    localStorage.setItem("did", res.data.department_name);
                    localStorage.setItem("std", res.data.status_name);
                    window.location.reload();
                } else {
                    console.log("error");
                    setError(true);
                }
            });
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    เข้าสู่ระบบสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    อีเมลหรือรหัสผ่านไม่ถูกต้อง
                </Alert>
            </Snackbar>
            <div className='from-box' >
                <img
                    style={{
                        maxHeight: "110vh",
                        maxWidth: "600px",
                        width: "100%",
                        backgroundPosition: "left 50%" // ปรับตำแหน่งของ background โดยเลื่อนไปทางซ้าย 20%
                    }}
                    className="img-box"
                    alt="Banner"
                    src={background}
                />
                <div>
                    <div className="logo" style={{ display: "flex", justifyContent: "center", marginBottom: "25px", marginTop: "130px" }}>
                        <img style={{ maxWidth: "180px", width: "100%" }} src={img} alt="Logo" />
                    </div>
                    <div className="form-page">
                        <div className="from-frame">
                            <div style={{ fontSize: "23px", fontWeight: "bold", color: "#0b0d94", paddingTop: "0px", fontFamily: "Rahong Regular" }}>
                                ระบบแจ้งปัญหาการใช้งานSoftware
                            </div>
                            <form noValidate className="form-in">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="UserName"
                                    label="Username"
                                    name="UserName"
                                    autoComplete="UserName"
                                    autoFocus
                                    value={signin.UserName || ""}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            login();
                                        }
                                    }}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    name="Password"
                                    type="password"
                                    id="Password"
                                    autoComplete="current-password"
                                    value={signin.Password || ""}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            login();
                                        }
                                    }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    style={{ backgroundColor: "#7484AD", color: "#F4F6F6" }}
                                    className="submit"
                                    onClick={login}
                                >
                                    Sign In
                                </Button>

                                <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Link href="/craeteAdmin" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
}
