import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink, useParams } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { ReportProblemInterface } from "../models/IReportProblem";
import { EmployeeInterface } from "../models/IEmployee";
import { set } from "date-fns";
import { UserInterface } from "../models/IUser";
import { DepartmentInterface } from "../models/IDepartment";
import { removeListener } from "process";
import { removeEmitHelper } from "typescript";
import Admin_Pending from "./Admin_Pending";

function AdminReportProblem() {
    const [emp, setEmp] = React.useState<EmployeeInterface>();
    const [user, setUser] = React.useState<UserInterface>();
    const [file, setfile] = useState<File | null>(null);
    const [reportProblem, setReportProblems] = React.useState<ReportProblemInterface[]>([]);
    const [department, setDepartment] = React.useState<DepartmentInterface>();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [ReportProblem, setReportProblem] = React.useState<Partial<ReportProblemInterface>>({
        NotificationDate: new Date(),
    });

    const getReportProblem = async () => {
        const apiUrl = "http://localhost:8080/reportProblemstatus1";
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
                console.log(res.data);
                if (res.data) {
                    setReportProblems(res.data);
                }
            });
    };
    function getUser() {
        const UserID = localStorage.getItem("uid")
        const apiUrl = `http://localhost:8080/users/${UserID}`;
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
                console.log("Combobox_User", res)
                if (res.data) {
                    setUser(res.data);
                } else {
                    console.log("else");
                }
            });
    }
    function getEmployee() {
        const UserID = localStorage.getItem("uid")
        const apiUrl = `http://localhost:8080/employeeID/${UserID}`;
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

                console.log("Combobox_Employee", res)
                if (res.data) {
                    console.log(res.data)
                    setEmp(res.data);
                } else {
                    console.log("else");
                }
            });
    }

    function submit1() {
        setLoading(true)
        let data = {
            EmployeeID: emp?.ID,
            Heading: ReportProblem.Heading ?? "",
            Description: ReportProblem.Description ?? "",
            StatusID: 2,
            NotificationDate: ReportProblem.NotificationDate,
            DepartmentID: department?.ID,
            File: file,
        };
        console.log("Data", data)
        const apiUrl = "http://localhost:8080/reportProblem";
        const requestOptions = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log("Res", res)
                if (res.data) {
                    setErrorMessage("")
                    setSuccess(true);
                } else {
                    setErrorMessage(res.error)
                    setError(true)
                }
            });
    }


    useEffect(() => {
        getEmployee();
        getReportProblem();
        getUser();

    }, []);


    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (res: any) => {
        if (res === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };

    return (

        <div>

            <Container maxWidth="md">
                <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        ลบข้อมูลสำเร็จ
                    </Alert>
                </Snackbar>
                <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        ลบข้อมูลไม่สำเร็จ: {ErrorMessage}
                    </Alert>
                </Snackbar>

                <Box

                    display="flex"

                    sx={{

                        marginTop: 2,

                    }}

                >

                    <Box flexGrow={1}>

                        <Typography
                            component="h2"
                            variant="h6"
                            color="error"
                            gutterBottom
                        >
                            ข้อมูลรอตรวจสอบปัญหาSoftware
                        </Typography>
                    </Box>

                </Box>

                <TableContainer >

                    <Table aria-label="simple table">

                        <TableHead>
                            <TableRow>
                                <TableCell align="left" width="10%">
                                    ID
                                </TableCell>
                                <TableCell align="left" width="20%">
                                    ผู้รายงาน
                                </TableCell>
                                <TableCell align="left" width="25%">
                                    แผนก
                                </TableCell>
                                <TableCell align="left" width="5%">
                                    หัวข้อ
                                </TableCell>

                                <TableCell align="center" width="5%">
                                    รายละเอียด
                                </TableCell>
                                <TableCell align="center" width="25%">
                                    สถานะ
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่/เวลา
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    ไฟล์
                                </TableCell>
                                <TableCell align="center" width="6%">

                                </TableCell>
                                <TableCell align="center" width="6%">

                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {reportProblem.map((reportProblem: ReportProblemInterface) => (
                                <TableRow key={reportProblem.ID}>
                                    <TableCell align="left" width="10"> {reportProblem.ID}            </TableCell>
                                    <TableCell align="left" width="medium"> {emp?.EmployeeName}           </TableCell>
                                    <TableCell align="left" width="medium"> {reportProblem.Department.DepartmentName} </TableCell>
                                    <TableCell align="left" size="medium"> {reportProblem.Heading}      </TableCell>
                                    <TableCell align="center" size="medium"> {reportProblem.Description}           </TableCell>
                                    <TableCell align="center" size="medium"> {reportProblem.Status.StatusName}           </TableCell>
                                    <TableCell align="center" width="42%" > {moment(reportProblem.NotificationDate).format('HH:mm  DD MMMM yyyy')}     </TableCell>
                                    {/* <TableCell align="center">
                                        <IconButton aria-label="delete" vertical-align="middle" onClick={() => DeleteReportProblem(reportProblem.ID)}><DeleteIcon /></IconButton >
                                    </TableCell> */}
                                    <TableCell align="center" size="medium">    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            aria-label="OPEN"
                                            variant='contained'
                                            color="primary"
                                            onClick={() => Admin_Pending(reportProblem.ID)}
                                        >
                                            Pending
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}

export default AdminReportProblem;