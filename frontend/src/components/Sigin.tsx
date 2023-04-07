import { Alert, Box, Button, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import './signin.css';
import { SigninInterface } from "../models/ISignin";
import frame from './image/frame.svg';
// import logo from './../image/logo.png'
export default function Signin(){
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const [signin, setSignin] = useState<Partial<SigninInterface>>({})


    const handleClose: any = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };


    //function change state handle when typing 

    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof signin; //id will collect attribute key event
        const { value } = event.target; //value will collect value attribute

        setSignin({ ...signin, [id]: value })
    }
    

    const login = () => {
        const apiUrl = "http://localhost:8080/signin";
        const requestOptions: any = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signin)
        }

        fetch(apiUrl, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    setSuccess(true);
                    localStorage.setItem("token", res.data.Token)
                    localStorage.setItem("uid", res.data.user_id)
                    localStorage.setItem("pid", res.data.p_id)
                    localStorage.setItem("role", res.data.role_name)
                    localStorage.setItem("dep", res.data.department_name)
                    
                    window.location.reload()
                } else {
                    console.log("error")
                    setError(true)
                }
            })
    }
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
                    style={{ maxHeight: "100vh" }}
                    className="img-box"
                    alt="Banner"
                    src={frame}

                />

                <div id='from-page' className='form-page'>
                    <div id='from-frame' className='from-frame'>
                        <div id="logo" className='logo'>
                            {/* <img className="img" alt="logo" src={logo}/> */}
                        </div>
                        <form noValidate className='form-in'>
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
                                className='submit'
                                onClick={login}
                                >
                                Sign In
                            </Button>

                        </form>
                    </div>
                </div>
            </div>
        </Box>
    )
}