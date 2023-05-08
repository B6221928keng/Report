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
import { ReportProblemInterface } from "../../models/IReportProblem";
import { EmployeeInterface } from "../../models/IEmployee";
import { DepartmentInterface } from "../../models/IDepartment";
import { FilesInterface } from "../../models/IFiles";
import { set } from "date-fns";
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import { UserInterface } from "../../models/IUser";
import { upload } from "@testing-library/user-event/dist/upload";
function ReportProblem() {
    const [emp, setEmp] = React.useState<EmployeeInterface>();
    const [Department, setDepartment] = React.useState<DepartmentInterface>();
    const [user, setUser] = React.useState<UserInterface>();
    const [reportProblem, setReportProblem] = React.useState<ReportProblemInterface[]>([]);
    const [uploadfile, setuploadfile] = React.useState<FilesInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");
    const [currentImage, setCurrentImage] = React.useState<File>();
    const [previewImage, setPreviewImage] = React.useState<string>("");
    const [progress, setProgress] = React.useState<number>(0);
    const [message, setMessage] = React.useState<string>("");
    const [image, setImage] = useState<File | null>(null);
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
    // function getUser() {
    //     const UserID = localStorage.getItem("uid")
    //     const apiUrl = `http://localhost:8080/users/${UserID}`;
    //     const requestOptions = {
    //         method: "GET",
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },
    //     };
    //     fetch(apiUrl, requestOptions)
    //         .then((response) => response.json())
    //         .then((res) => {
    //             console.log("Combobox_User", res)
    //             if (res.data) {
    //                 setUser(res.data);
    //             } else {
    //                 console.log("else");
    //             }
    //         });
    // }
    // function getDepartment() {
    //     const UserID = localStorage.getItem("uid")
    //     const apiUrl = `http://localhost:8080/employeeUId/${UserID}`;
    //     const requestOptions = {
    //         method: "GET",
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },
    //     };
    //     fetch(apiUrl, requestOptions)
    //         .then((response) => response.json())
    //         .then((res) => {

    //             console.log("Combobox_Department", res)
    //             if (res.data) {
    //                 console.log(res.data)
    //                 setDepartment(res.data);
    //             } else {
    //                 console.log("else");
    //             }
    //         });
    // }
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

    // const DeleteReportProblem = async (id: string | number | undefined) => {
    //     const apiUrl = "http://localhost:8080";
    //     const requestOptions = {
    //         method: "DELETE",
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },
    //     };

    //     fetch(`${apiUrl}/reportProblems/${id}`, requestOptions)
    //         .then((response) => response.json())
    //         .then(
    //             (res) => {
    //                 if (res.data) {
    //                     setSuccess(true)
    //                     console.log("ยกเลิกสำเร็จ")
    //                     setErrorMessage("")
    //                 }
    //                 else {
    //                     setErrorMessage(res.error)
    //                     setError(true)
    //                     console.log("ยกเลิกไม่สำเร็จ")
    //                 }
    //                 getReportProblem();
    //             }
    //         )
    // }
    const apiUrl = "http://localhost:8080";
    function handleDownloadFile(id: number, filename: string) {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
        fetch(`${apiUrl}/downloadFile/${id}`, requestOptions)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob], { type: "application/octet-stream" })
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename);
                link.innerHTML = filename; // เพิ่มคำสั่งนี้เพื่อแสดงชื่อไฟล์
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => console.log(error));
    }

    // //อัพรูป
    // const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFiles = event.target.files as FileList;
    //     setCurrentImage(selectedFiles?.[0]);
    //     setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
    //     setProgress(0);
    // };


    useEffect(() => {
        getEmployee();
        getReportProblem();
        // getUser();
        // getDepartment();
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
                                <TableCell align="center" width="5%">
                                    ID
                                </TableCell>
                                <TableCell align="left" width="20%">
                                    ผู้รายงาน
                                </TableCell>
                                {/* <TableCell align="left" width="25%">
                                    แผนก
                                </TableCell> */}
                                <TableCell align="center" width="20%">
                                    หัวข้อ
                                </TableCell>

                                <TableCell align="left" width="20%">
                                    รายละเอียด
                                </TableCell>
                                <TableCell align="center" width="5%">
                                    เวลา
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    ดาวน์โหลด
                                </TableCell>
                                <TableCell align="center" width="10%">

                                </TableCell>
                                <TableCell align="center" width="6%">
                                    สถานะ
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {reportProblem.map((reportProblem: ReportProblemInterface) => (
                                <TableRow key={reportProblem.ID}>
                                    <TableCell align="center" width="15">  {moment(reportProblem.NotificationDate).format('DDMMYY')}|{reportProblem.ID}            </TableCell>
                                    <TableCell align="left" width="medium"> {emp?.EmployeeName}           </TableCell>
                                    {/* <TableCell align="left" width="medium"> {reportProblem.Department.DepartmentName} </TableCell>  */}
                                    <TableCell align="center" width="15%"> {reportProblem.Heading}      </TableCell>
                                    <TableCell align="left" width="20%"> {reportProblem.Description}           </TableCell>
                                    <TableCell align="center" width="5%" > {moment(reportProblem.NotificationDate).format('HH:mm ')}     </TableCell>

                                    {/* <TableCell align="center" width="medium">
                                        {reportProblem.FileUpload?.name ? (
                                            <a href={`http://localhost:8080/downloadFile/${reportProblem.FileUpload.ID}`} download>
                                                <IconButton size="small">
                                                    <GetAppRoundedIcon />
                                                </IconButton>
                                                {reportProblem.FileUpload.name}
                                            </a>
                                        ) : "-"}
                                    </TableCell> */}
                                    <TableCell align="left">
                                        <IconButton onClick={() => handleDownloadFile(reportProblem.ID, reportProblem.FileUpload.name)}>
                                            <GetAppRoundedIcon />
                                        </IconButton>
                                        {reportProblem.FileUpload.name} {/* เพิ่มคำสั่งนี้เพื่อแสดงชื่อไฟล์ */}
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
                                    <TableCell align="center" size="medium"> {reportProblem.Status.StatusName}           </TableCell>
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