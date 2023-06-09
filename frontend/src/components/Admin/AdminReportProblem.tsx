import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";
import { Link as RouterLink, useParams } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { ReportProblemInterface } from "../../models/IReportProblem";
import { set } from "date-fns";
import { UserInterface } from "../../models/IUser";
import { DepartmentInterface } from "../../models/IDepartment";
import { removeListener } from "process";
import { removeEmitHelper } from "typescript";
import Admin_Pending from "./Admin_Pending";

function AdminReportProblem() {
    const [emp, setEmp] = React.useState<UserInterface>();
    const [user, setUser] = React.useState<UserInterface>();
    const [file, setfile] = useState<File | null>(null);
    const [reportProblem, setReportProblems] = React.useState<ReportProblemInterface[]>([]);
    const [department, setDepartment] = React.useState<DepartmentInterface>();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [ReportProblem, setReportProblem] = React.useState<Partial<ReportProblemInterface>>({ 
    });


    let { id } = useParams();
    const getreportProblemID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080/";
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/reportProblem/${id}`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log("ReportProblem", res)
                if (res.data) {
                    setReportProblem(res.data);
                } else {
                    console.log("else");
                }
            });
    };
    
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

                console.log("Combobox_Employee", res)
                if (res.data) {
                    console.log(res.data)
                    setEmp(res.data);
                } else {
                    console.log("else");
                }
            });
    }
    const navigate = useNavigate();
    const convertType = (data: string | number | undefined | null) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };

    function submit2() : void {
        setLoading(true)
        let data = {
            ID:  ReportProblem.ID,
            EmployeeID: emp?.UserLname,
            Heading: ReportProblem.Heading,
            Description: ReportProblem.Description,
            StatusID: 2,
            DepartmentID: convertType(ReportProblem.DepID),
            NotificationDate: new Date().toISOString(),
        };
        console.log("Data", data);
        const apiUrl = "http://localhost:8080/reportProblems";
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log("Res", res);
                if (res.data) {
                    setErrorMessage("");
                    setSuccess(true);
                    navigate(`/adminReportComplete/${res.data.ID}`); // use the new ID returned from the server
                } else {
                    setErrorMessage(res.error);
                    setError(true);
                }
            })
    };


    React.useEffect(() => {
        getEmployee();
        getReportProblem();
        getUser();
        getreportProblemID(id);

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
                        บันทึกข้อมูลสำเร็จ
                    </Alert>
                </Snackbar>
                <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        บันทึกลบข้อมูลไม่สำเร็จ: {ErrorMessage}
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
                                    <TableCell align="left" width="medium"> {emp?.UserLname}           </TableCell>
                                    <TableCell align="left" width="medium"> {reportProblem.Department.DepName} </TableCell>
                                    <TableCell align="left" size="medium"> {reportProblem.Heading}      </TableCell>
                                    <TableCell align="center" size="medium"> {reportProblem.Description}           </TableCell>
                                    <TableCell align="center" size="medium"> {reportProblem.Status.StatusName}           </TableCell>
                                    <TableCell align="center" width="42%" > {moment(reportProblem.NotificationDate).format('HH:mm  DD MMMM yyyy')}     </TableCell>
                                    
                                    <TableCell align="center" size="medium">    </TableCell>
                                    <TableCell align="center">
                                        <div>
                                            {success && <p>Form submitted successfully!</p>}
                                            <TableBody>
                                                {/* ... */}
                                            </TableBody>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={submit2}
                                                disabled={loading}
                                            >
                                                {loading ? "Loading..." : "Pending"}
                                            </Button>
                                        </div>
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