import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select,Paper, TextField, Typography, Table, TableHead, TableRow, TableBody, TableRowProps } from '@mui/material'
import Button from '@mui/material/Button'
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import axios from 'axios';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import PhotoIcon from '@mui/icons-material/Photo';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar'
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ReportProblemInterface } from "../../models/IReportProblem";
import { EmployeeInterface } from "../../models/IEmployee";
import { DepartmentInterface } from "../../models/IDepartment";
import { FileUploadInterface } from "../../models/IFileUpload";
import { set } from "date-fns";
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import { UserInterface } from "../../models/IUser";
import { upload } from "@testing-library/user-event/dist/upload";
import styles from './Table.module.css';

function ReportProblem() {
    const [emp, setEmp] = React.useState<EmployeeInterface>();
    const [Department, setDepartment] = React.useState<DepartmentInterface>();
    const [user, setUser] = React.useState<UserInterface>();
    const [reportProblem, setReportProblem] = React.useState<ReportProblemInterface[]>([]);
    const [uploadfile, setuploadfile] = React.useState<FileUploadInterface[]>([]);
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


    function getFile() {
        const apiUrl = `http://localhost:8080/downloadFile/:id`;
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

                console.log("Combobox_file_uploads", res)
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
            .then((response) => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const Filename = getFilenameFromResponseHeaders(contentDisposition) || filename;

                return response.blob().then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", filename);
                    link.innerHTML = filename;
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch((error) => console.log(error));
    }
    function getFilenameFromResponseHeaders(contentDisposition: string | null) {
        if (contentDisposition === null) {
            return null;
        }

        const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = regex.exec(contentDisposition);
        if (matches != null && matches[1]) {
            return matches[1].replace(/['"]/g, '');
        }
        return null;
    }
    const handleButtonClick = () => {
        setTimeout(() => {
            window.location.reload();
        }, 400);
    };

    useEffect(() => {
        getEmployee();
        getReportProblem();
        // handleDownloadFile();
        // getUser();
        // getDepartment();
        // getFile();
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
                    <Typography component="h2" variant="h6" color="error" gutterBottom>
                        ข้อมูลรายงานปัญหา Software
                    </Typography>
                </Box>
                <Box>
                    <Button
                        component={RouterLink}
                        to="/reportProblemCreate"
                        variant="contained"
                        color="error"
                    >
                        เพิ่มข้อมูลปัญหา Software
                    </Button>
                </Box>
            </Box>

            <TableContainer className="table-container">
                <div className="mb-4" style={{ marginTop: '20px' }}>
                    <Table className="table" aria-label="simple table">
                        <thead>
                            <tr>
                                <th className={styles.header}>ID</th>
                                <th className={styles.header}>ชื่อ</th>
                                <th className={styles.header}>หัวข้อ</th>
                                <th className={styles.header}>รายละเอียด</th>
                                <th className={styles.header}>เวลา</th>
                                <th className={styles.header}>ดาวน์โหลด</th>
                                <th className={styles.header}></th>
                                <th className={styles.header}>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportProblem
                                .sort((a, b) => b.ID - a.ID)
                                .map((reportProblem: ReportProblemInterface) => (
                                    <TableRow component="tr" key={reportProblem.ID}>
                                        <TableCell align="center" width="15" className={styles.cell}>
                                            {moment(reportProblem.NotificationDate).format('DDMMYY')}|{reportProblem.ID}
                                        </TableCell>
                                        <TableCell align="center" width="medium" className={styles.cell}>
                                            {emp?.EmployeeName}
                                        </TableCell>
                                        <TableCell align="center" width="15%" className={styles.cell}>
                                            {reportProblem.Heading}
                                        </TableCell>
                                        <TableCell align="center" width="20%" className={styles.cell}>
                                            {reportProblem.Description}
                                        </TableCell>
                                        <TableCell align="center" width="5%" className={styles.cell}>
                                            {moment(reportProblem.NotificationDate).format('HH:mm')}
                                        </TableCell>
                                        <TableCell align="left" className={styles.cell}>
                                            <IconButton onClick={() => handleDownloadFile(reportProblem.ID, reportProblem.FileUpload.name)}>
                                                <GetAppRoundedIcon />
                                            </IconButton>
                                            {reportProblem.FileUpload.name}
                                        </TableCell>
                                        <TableCell align="center" className={styles.cell}>
                                            <Button
                                                component={RouterLink}
                                                to={"/ReportProblemUpdate/" + reportProblem.ID}
                                                variant="contained"
                                                color="primary"
                                            >
                                                แก้ไขข้อมูล
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center" size="medium" className={styles.cell}>
                                            {reportProblem.Status.StatusName}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </tbody>
                    </Table>
                </div>
            </TableContainer>
            
        </Container>

    );
}



export default ReportProblem;