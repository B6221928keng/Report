import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import axios from 'axios';
import PhotoIcon from '@mui/icons-material/Photo';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ReportProblemInterface } from "../models/IReportProblem";
import { EmployeeInterface } from "../models/IEmployee";
import { set } from "date-fns";
import { UserInterface } from "../models/IUser";
import { FileInterface } from "../models/IFile";
import { upload } from "@testing-library/user-event/dist/upload";
function ReportProblem() {
    const [emp, setEmp] = React.useState<EmployeeInterface>();
    const [user, setUser] = React.useState<UserInterface>();
    const [reportProblem, setReportProblem] = React.useState<ReportProblemInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");
    const [currentImage, setCurrentImage] = React.useState<File>();
    const [previewImage, setPreviewImage] = React.useState<string>("");
    const [progress, setProgress] = React.useState<number>(0);
    const [message, setMessage] = React.useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imageInfos, setImageInfos] = React.useState<Array<FileInterface>>([]);
    const getReportProblem = async () => {
        const apiUrl = "http://localhost:8080/reportProblem";
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
                    setReportProblem(res.data);
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

                console.log("Combobox_Employee", res)
                if (res.data) {
                    console.log(res.data)
                    setEmp(res.data);
                } else {
                    console.log("else");
                }
            });
    }
    const DeleteReportProblem = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/reportProblems/${id}`, requestOptions)
            .then((response) => response.json())
            .then(
                (res) => {
                    if (res.data) {
                        setSuccess(true)
                        console.log("ยกเลิกสำเร็จ")
                        setErrorMessage("")
                    }
                    else {
                        setErrorMessage(res.error)
                        setError(true)
                        console.log("ยกเลิกไม่สำเร็จ")
                    }
                    getReportProblem();
                }
            )
    }
    //อัพรูป
    const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files as FileList;
        setCurrentImage(selectedFiles?.[0]);
        setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
        setProgress(0);
    };


    const handleApi = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
            method: "OPEN",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/reportProblems/${id}`, requestOptions)
            .then((response) => response.json())
            .then(
                (res) => {
                    if (image) {
                        const formData = new FormData();
                        formData.append("image", image);
                        axios.post("url", formData).then((res) => {
                            console.log(res);
                        });
                    }
                })
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
                            ข้อมูลรายงานปัญหาSoftware
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/reportProblemCreate"

                            variant="contained"

                            color="error"

                        >

                            เพิ่มข้อมูลปัญหาSoftware

                        </Button>

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
                                    <TableCell align="center">
                                        <IconButton aria-label="OPEN"
                                            vertical-align="middle"
                                            onClick={() => handleApi(reportProblem.ID)}><PhotoIcon /></IconButton >
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete"
                                            vertical-align="middle"
                                            onClick={() => DeleteReportProblem(reportProblem.ID)}><DeleteIcon /></IconButton >
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button

                                            component={RouterLink}
                                            to={"/ReportProblemUpdate/" + reportProblem.ID}
                                            variant='contained'
                                            color="primary"

                                        >
                                            แก้ไขข้อมูล
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



export default ReportProblem;