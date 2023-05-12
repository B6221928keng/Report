import React, { useEffect, useState } from "react";
import { EmployeeInterface } from "../models/IEmployee";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Toolbar, Typography, Button, Box, Badge } from "@mui/material";
import { UserInterface } from "../models/IUser";
import { DepartmentInterface } from "../models/IDepartment";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
const drawerWidth = 240;
export default function Navbar({ open, onClick }: any) {
    const [emp, setEmp] = React.useState<EmployeeInterface>();
    const [department, setDepartment] = React.useState<DepartmentInterface>();
    const [user, setUser] = React.useState<Partial<UserInterface>>({});
    interface AppBarProps extends MuiAppBarProps {
        open?: boolean;
    }
    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `-${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));
    const navigator = useNavigate();
    const handleSignOutClick = (e: any) => {
        localStorage.clear()
        navigator('/')
        window.location.reload()
    }
    //ดึงพนักงาน
    function getEmployee() {
        const UserID = localStorage.getItem("uid")
        const apiUrl = `http://localhost:8080/employeeId/${UserID}`;
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {

                console.log("Combobox_employee", res)
                if (res.data) {
                    setEmp(res.data);
                } else {
                    console.log("else");
                }
            });
    }
    //ดึงข้อมูลแผนก
    function getDepartment() {
        const UserID = localStorage.getItem("uid")
        const apiUrl = `http://localhost:8080/employeeUId/${UserID}`;
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {

                console.log("Combobox_department", res)
                if (res.data) {
                    console.log(res.data)
                    setDepartment(res.data);
                } else {
                    console.log("else");
                }
            });
    }

    useEffect(() => {
        getEmployee()
        getDepartment()

    }, [])
    return (
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={onClick}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    <Button
                        component={RouterLink}
                        to="/"
                        variant="contained"
                        color="primary"
                    >
                        Reporting Software Problems
                    </Button>
                </Typography>


                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex' }}>
                    <Typography
                        style={{
                            textAlign: 'right',
                            backgroundColor: "errorColor",
                            color: 'white',
                            padding: '5px 10px',
                            border: '0.5px solid white',
                            borderRadius: '20px',
                            display: 'inline-block'
                        }}
                    >
                        <AccountCircleRoundedIcon style={{ verticalAlign: 'middle', marginRight: '5px', color: "indigo" }} />
                        User: {emp?.EmployeeName} | {localStorage.getItem('did')}
                    </Typography>


                    <Button size="large" color="inherit" onClick={handleSignOutClick} variant='outlined'>
                        <Badge color="error">
                            <ExitToAppIcon />
                        </Badge>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>

    )
}