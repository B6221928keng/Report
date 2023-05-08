import { Link as RouterLink } from "react-router-dom";
import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Container, sizeHeight } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import SourceIcon from '@mui/icons-material/Source';
import Paper from '@mui/material/Paper'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button, CssBaseline, FormControl, Grid, Select, MenuItem, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import axios from 'axios';

import UploadService from "../../service/FileUploadService";

import { UserInterface } from "../../models/IUser";
import { StatusInterface } from "../../models/IStatus";
import { ReportProblemInterface } from "../../models/IReportProblem";
import { EmployeeInterface } from "../../models/IEmployee";
import { DepartmentInterface } from "../../models/IDepartment";
import { set } from "date-fns";
import { FilesInterface } from "../../models/IFiles";


export default function ReportProblemCreate(this: any) {


    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [date, setDate] = React.useState<Date | null>(null);
    const [user, setUser] = React.useState<UserInterface>();
    const [emp, setEmp] = React.useState<EmployeeInterface>();
    const [status, setStatus] = React.useState<StatusInterface[]>([]);
    const [department, setDepartment] = React.useState<DepartmentInterface>();
    //const [medicineLabel, setMedicineLable] = React.useState<MedicineLabelsInterface[]>([]);
    const [ReportProblem, setReportProblem] = React.useState<Partial<ReportProblemInterface>>({
        NotificationDate: new Date(),
    });
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState<String>();
    const [message, setMessage] = React.useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [currentFile, setCurrentFile] = useState<File>();
    const [fileData, setFileData] = useState<string>("");




    const handleClose = (res: any) => {
        if (res === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
        setLoading(false)
    };

    const handleInputChange = (
        event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
        const id = event.target.id as keyof typeof ReportProblemCreate;
        const { value } = event.target;
        console.log("ID", id, "Value", value)
        setReportProblem({ ...ReportProblem, [id]: value });
    };

    const handleChange: any = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        console.log(event.target.value)
        const name = event.target.name as keyof typeof ReportProblemCreate
        console.log(name)
        setReportProblem({
            ...ReportProblem,
            [name]: event.target.value,
        });
    };

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

    //ดึงข้อมูลสถานะ
    function getStatus() {
        const apiUrl = "http://localhost:8080/statuses";
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

                console.log("Combobox_status", res)
                if (res.data) {
                    console.log(res.data)
                    setStatus(res.data);
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(event.target.files);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const apiUrl = "http://localhost:8080/uploadfile";

        if (files) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    // const handleFileUpload = (event: { target: { files: any[]; }; }) => {
    //     const file = event.target.files[0];
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
    //       setReportProblem({
    //         ...ReportProblem,
    //         FileUpload: [
    //           {
    //             FileUploadID: null, // ใส่ null เพื่อให้ backend สร้าง ID ให้เอง
    //             Name: file.name,
    //             Size: file.size,
    //             Type: file.type,
    //             Content: base64String,
    //           },
    //         ],
    //       });
    //     };
    //     reader.readAsDataURL(file);
    //   };




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



    const convertType = (data: string | number | undefined | null) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };

    function submit() {
        setLoading(true)
        let data = {
            ID: ReportProblem.ID,
            EmployeeID: emp?.ID,
            Heading: ReportProblem.Heading ?? "",
            Description: ReportProblem.Description ?? "",
            StatusID: 1,
            NotificationDate: ReportProblem.NotificationDate,
            DepartmentID: emp?.DepartmentID,
            FileUpload: ReportProblem.FileUploadID,
        };
        console.log("Data", data)
        const apiUrl = "http://localhost:8080/reportProblems";
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            timeout: 5000,
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
    //ดึงข้อมูล ใส่ combobox
    React.useEffect(() => {

        getDepartment();
        getStatus();
        getUser();
        getEmployee();


        console.log(localStorage.getItem("did"))

    }, []);

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    return (
        <Container maxWidth="lg">
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ: {ErrorMessage}
                </Alert>
            </Snackbar>
            <Paper sx={{ p: 4, pb: 10 }}  >
                <Box display="flex" > <Box flexGrow={1}>
                    <Typography
                        component="h2"
                        variant="h5"
                        color="error"
                        gutterBottom
                    >
                        แบบฟอร์มแจ้งปัญหา Software

                        <Button style={{ float: "right" }}
                            component={RouterLink}
                            to="/reportProblem"
                            variant="contained"
                            color="error">
                            <SourceIcon />ข้อมูลการแจ้งปัญหา Software
                        </Button>
                    </Typography>
                </Box>
                </Box>

                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                        <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
                            <Grid item xs={120}>
                                <Typography>From : {emp?.EmployeeName}
                                    <option />
                                </Typography></Grid>
                        </FormControl>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                        <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
                            <Grid item xs={120}><Typography>แผนก :  {localStorage.getItem("did")}</Typography></Grid>
                        </FormControl>
                    </FormControl>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
                            <p>หัวข้อ*</p>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="Heading"
                                    variant="outlined"
                                    type="string"
                                    size="medium"
                                    placeholder="กรอกหัวข้อ"
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={5}>
                        <FormControl fullWidth variant="outlined" style={{ width: '150%', float: 'left' }}>
                            <p>รายละเอียด*</p>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="Description"
                                    variant="outlined"
                                    type="string"
                                    size="medium"
                                    placeholder="กรอกรายละเอียด"
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </FormControl>
                    </Grid>
                </Grid>


                <div>
                    <form onSubmit={handleSubmit}>
                        <input type="file" name="files" multiple onChange={handleFileChange} />
                        <Button type="submit" variant="contained" color="primary">
                            Upload
                        </Button>
                    </form>
                </div>



                {/* <div className="col-4">
                    <button
                        className="btn btn-success btn-sm"
                        disabled={!currentFile}
                        onClick={upload}
                    >
                        Upload
                    </button>
                </div>


                {currentFile && (
                    <div className="progress my-3">
                        <div
                            className="progress-bar progress-bar-info"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            style={{ width: progress + "%" }}
                        >
                            {progress}%
                        </div>
                    </div>
                )}

                {message && (
                    <div className="alert alert-secondary mt-3" role="alert">
                        {message}
                    </div>
                )}

                <div className="card mt-3">
                    <div className="card-header">List of Files</div>
                    <ul className="list-group list-group-flush">
                        {fileUpload &&
                            fileUpload.map((fileUpload, index) => (
                                <li className="list-group-item" key={index}>
                                    <a href={fileUpload.Filename}>{fileUpload.ID}{fileUpload.Mimetype}</a>
                                </li>
                            ))}
                    </ul>
                </div> */}

                {/* <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>วันที่/เวลา</p>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={ReportProblem.NotificationDate}
                                    onChange={(newValue) => {
                                        setReportProblem({
                                            ...ReportProblem,
                                            NotificationDate: newValue,
                                            
                                        });
                                    }}
                                    
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid> */}

                <Grid item xs={4}></Grid>
                <Grid item xs={12}>
                    <Stack
                        spacing={2}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        sx={{ mt: 3 }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            component={RouterLink}
                            to="/"
                        >
                            ถอยกลับ
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submit}
                            component={RouterLink}
                            to="/reportProblem"
                        >
                            บันทึกข้อมูล
                        </Button>

                    </Stack>
                </Grid>

            </Paper>
        </Container>



    );
}