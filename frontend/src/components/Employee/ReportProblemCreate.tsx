import { Link as RouterLink } from "react-router-dom";
import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Container, sizeHeight } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import SourceIcon from '@mui/icons-material/Source';
import Paper from '@mui/material/Paper'
import { Button, CssBaseline, FormControl, Grid, Select, MenuItem, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import SnackbarContent from '@mui/material/SnackbarContent';
import axios from 'axios';
import { UserInterface } from "../../models/IUser";
import { StatusInterface } from "../../models/IStatus";
import { ReportProblemInterface } from "../../models/IReportProblem";
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUploadRounded';
import { EmployeeInterface } from "../../models/IEmployee";
import { DepartmentInterface } from "../../models/IDepartment";
import { FileUploadInterface } from "../../models/IFileUpload";
import GppMaybeSharpIcon from '@mui/icons-material/GppMaybeSharp';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ReportProblemCreate(props: any) {

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
    // const [filess, setFiless] = React.useState<FileUploadInterface>();
    const [files, setFiles] = React.useState<FileUploadInterface[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState<String>();
    const [message, setMessage] = React.useState<string>("");
    const [uploadSuccess, setUploadSuccess] = React.useState(false);
    const [uploadError, setUploadError] = React.useState(false);
    const [fileUploads, setFileUploads] = React.useState<FileUploadInterface[]>([]);
    const { params, Amail, Email } = props;
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const handleClose = (res: any) => {
        if (res === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
        setLoading(false)
        setUploadSuccess(false);
        setUploadError(false);
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

    const getFileUploads = () => {
        const apiUrl = "http://localhost:8080/fileUploads";
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
                console.log("FileUploads", res);
                if (res.data) {
                    console.log(res.data);
                    setFiles(res.data);
                } else {
                    console.log("else");
                }
            });
    };
    const [fileSelected, setFileSelected] = React.useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map((file) => {
                const fileInfo = {
                    ID: 0,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    CreatedAt: new Date(file.lastModified),
                    UpdatedAt: new Date(file.lastModified),
                    content: file,
                };
                console.log(fileInfo); // แสดงข้อมูลใน Console
                return fileInfo;
            });
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setFileSelected(true); // ตั้งค่าว่ามีการเลือกไฟล์แล้ว
        }
    };

    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();
        

        if (!ReportProblem.FileUploadID && files.length === 0) {
            setShowSnackbar(true);
            setLoading(false);
            return;
        } {
            // กรณีมีการเลือกไฟล์
            const apiUrl = "http://localhost:8080/uploadfile";
            if (files) {
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.content) {
                        formData.append('files', file.content);
                    }
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
                        setLoading(false);
                        console.log(data);
                        if (data.data && data.data.length > 0) {
                            const fileData = data.data[0];
                            const fileUploadID = fileData.ID;
                            setReportProblem((prevReportProblem) => ({
                                ...prevReportProblem,
                                FileUploadID: fileData.ID,
                                FileUpload: {
                                    ...(prevReportProblem.FileUpload || {}),
                                    ID: fileData.ID,
                                    name: fileData.name,
                                    size: fileData.size,
                                    type: fileData.type,
                                    CreatedAt: fileData.CreatedAt,
                                    UpdatedAt: fileData.UpdatedAt,
                                    content: null,
                                },
                            }));
                            setUploadSuccess(true);
                            setFiles((prevFileUploads) => [...prevFileUploads, fileData]);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setUploadError(true);
                        setLoading(false);
                    });
            }
        }
    };


    async function mail() {
        let data = {
            email: "jirawatkeng086@gmail.com",
            password: "awztnitdqwzgbfqx",
            empemail: "keng-085@hotmail.com",
        };

        axios.post('http://localhost:8080/Email', { message, ...data })
            .then(response => {
                console.log(response.data);
                // ทำสิ่งที่คุณต้องการเมื่อส่งอีเมลสำเร็จ
            })
            .catch(error => {
                console.error(error);
                // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการส่งอีเมล
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
        setLoading(true);
        // Validate Heading
        if (!ReportProblem.Heading) {
            setLoading(false);
            alert("กรุณากรอกหัวข้อของปัญหาด้วยนะครับ");
            return;
        }
        // Validate Description
        if (!ReportProblem.Description) {
            setLoading(false);
            alert("กรุณากรอกรายละเอียดของปัญหาด้วยนะครับ");
            return;
        }
        if (!ReportProblem.FileUploadID && fileSelected) {
            setShowSnackbar(true);
            setLoading(false);
            return;
        }
        if (submitted) {
            return;
        }
        let data = {
            ID: ReportProblem.ID,
            EmployeeID: emp?.ID,
            Heading: ReportProblem.Heading ?? "",
            Description: ReportProblem.Description ?? "",
            StatusID: 1,
            NotificationDate: ReportProblem.NotificationDate,
            DepartmentID: emp?.DepartmentID,
            FileUploadID: ReportProblem.FileUploadID,
        };
        console.log(Email);
        console.log("FileUploadID:", ReportProblem.FileUploadID);
        console.log("FileUpload:", ReportProblem.FileUpload);
        console.log(data.FileUploadID);
        console.log("Data", data);
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
                console.log("Res", res);
                if (res.data) {
                    setErrorMessage("");
                    setSuccess(true);
                    setSubmitted(true);
                    //  mail();
                } else {
                    setErrorMessage(res.error);
                    setError(true);
                }
            });
    }


    //ดึงข้อมูล ใส่ combobox
    React.useEffect(() => {

        getDepartment();
        getStatus();
        getUser();
        getEmployee();
        getFileUploads();


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
            <Snackbar open={uploadSuccess} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    icon={<DriveFolderUploadRoundedIcon />}
                >
                    อัพโหลดไฟล์สำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={uploadError} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    อัพโหลดไฟล์ไม่สำเร็จ: {ErrorMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)}>
                <SnackbarContent
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <GppMaybeSharpIcon style={{ marginRight: '8px' }} />
                            เมื่อทำการเลือกไฟล์แล้ว กรุณากดปุ่ม " UPLOAD "  ก่อนกดปุ่ม " บันทึกข้อมูล "
                        </span>
                    }
                />
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

                {/* <Grid item xs={4}>
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
                </Grid> */}


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

                <div style={{ marginTop: '20px' }}>
                    <form onSubmit={handleSubmit}>
                        <input type="file" name="files" multiple onChange={handleFileChange} />
                        <Button type="submit" variant="contained" color="primary">
                            Upload*
                        </Button>
                    </form>
                </div>



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
                            // component={RouterLink}
                            // to="/reportProblem"
                            disabled={submitted} // Disable the button if data has been submitted
                        >
                            บันทึกข้อมูล
                        </Button>

                    </Stack>
                </Grid>

            </Paper>
        </Container>



    );
}