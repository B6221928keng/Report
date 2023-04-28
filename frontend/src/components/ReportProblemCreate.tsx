import { Link as RouterLink } from "react-router-dom";
import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Container } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import SourceIcon from '@mui/icons-material/Source';
import Paper from '@mui/material/Paper'
import { Button, FormControl, Grid, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import axios from 'axios';
// import { FileUploadtInterface } from "../models/IFiles";
import { UserInterface } from "../models/IUser";
import { StatusInterface } from "../models/IStatus";
import { ReportProblemInterface } from "../models/IReportProblem";
import { EmployeeInterface } from "../models/IEmployee";
import { DepartmentInterface } from "../models/IDepartment";

export default function ReportProblemCreate(this: any) {

    // const [fileUpload, setFileUpload] = useState<FileUploadtInterface[]>([]);
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

    // interface Report {
    //     id: number;
    //     name: string;
    //     date: string;
    //     files: string[];
    //   }
      
    //   interface FileUploadProps {
    //     onUploadComplete: () => void;
    //   }
      
    //   const FileUploadComponent: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
    //     const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
      
    //     const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    //       setSelectedFiles(e.target.files);
    //     };
      
    //     const handleUpload = async () => {
    //       if (!selectedFiles) return;
      
    //       const formData = new FormData();
    //       for (let i = 0; i < selectedFiles.length; i++) {
    //         formData.append('files', selectedFiles[i]);
    //       }
      
    //       try {
    //         await axios.post('/api/upload', formData);
    //         console.log('Files uploaded successfully');
    //         onUploadComplete();
    //       } catch (err) {
    //         console.error(err);
    //       }
    //     };
    // }
    // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const apiUrl = "http://localhost:8080/uploads";
    //     const requestOptions = {
    //         method: "GET",
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-type": "application/json",
    //         },
    //     };
    //     try {
    //         const response = await fetch(apiUrl, requestOptions);
    //         const data = await response.json();
    //         console.log("fileupload", event.target.files);
    //         if (event.target.files) {
    //             console.log(event.target.files);
    //             setFileUpload(data);
    //         } else {
    //             console.log("else");
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };

    // const handleUpload = async () => {
    //     const apiUrl = "http://localhost:8080/upload";
    //     const requestOptions = {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     };
    //     try {
    //       if (files) {
    //         const formData = new FormData();
    //         for (let i = 0; i < files.length; i++) {
    //           formData.append("fileupload", files[i]);
    //         }
    //         const response = await fetch(apiUrl, {
    //           ...requestOptions,
    //           body: formData,
    //         });
    //         const data = await response.json();
    //         console.log(data);
    //       }
    //     } catch (error) {
    //       console.error("Error:", error);
    //     }
    //   };

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

                console.log("Combobox_Employee", res)
                if (res.data) {
                    console.log(res.data)
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
            EmployeeID: emp?.ID,
            Heading: ReportProblem.Heading ?? "",
            Description: ReportProblem.Description ?? "",
            StatusID: 1,
            NotificationDate: ReportProblem.NotificationDate,
            DepartmentID: emp?.DepartmentID,
            // FileUpload: fileUpload,
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
        // handleUpload();
        console.log(localStorage.getItem("dep"))

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
                            <Grid item xs={120}><Typography>แผนก :  {localStorage.getItem("dep")}</Typography></Grid>
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
                <option />

                {/* <div>
                    <input type="file" name="files" multiple onChange={handleFileChange} />
                    <button onSubmit={handleUpload}>Upload</button>
                </div> */}

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