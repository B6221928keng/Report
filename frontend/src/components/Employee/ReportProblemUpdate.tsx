import React, { useEffect, useState } from 'react'
import { Box, Button, CssBaseline, FormControl, Grid, Select, SelectChangeEvent, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Container } from '@mui/system'
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper'
import SourceIcon from '@mui/icons-material/Source';
import moment from 'moment';
import { UserInterface } from "../../models/IUser";
import { StatusInterface } from "../../models/IStatus";
import { ReportProblemInterface, ReportProblemInterfaceT } from "../../models/IReportProblem";
import { DepartmentInterface } from "../../models/IDepartment";
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUploadRounded';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import { FileUploadInterface } from '../../models/IFileUpload';
import GppMaybeSharpIcon from '@mui/icons-material/GppMaybeSharp';
import SnackbarContent from '@mui/material/SnackbarContent';
import axios from 'axios';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ReportProblemUpdate(props: any) {
    const [message, setMessage] = React.useState<string>("");
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [date, setDate] = React.useState<Date | null>(null);
    const [user, setUser] = React.useState<UserInterface>();
    const [emp, setEmp] = React.useState<UserInterface>();
    const [status, setStatus] = React.useState<StatusInterface[]>([]);
    const [files, setFiles] = React.useState<FileUploadInterface[]>([]);
    const [fileUploads, setFileUploads] = React.useState<FileUploadInterface[]>([]);
    const [uploadError, setUploadError] = React.useState(false);
    const [uploadSuccess, setUploadSuccess] = React.useState(false);
    const [department, setDepartment] = React.useState<DepartmentInterface[]>([]);
    const [ReportProblem, setReportProblem] = React.useState<Partial<ReportProblemInterfaceT>>({
        NotificationDate: new Date(),
    });
    const { params, Amail, Email } = props;
    const [loading, setLoading] = React.useState(false);
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState<String>();
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
        const id = event.target.id as keyof typeof ReportProblem;
        const { value } = event.target;
        console.log("ID", id, "Value", value)
        setReportProblem({ ...ReportProblem, [id]: value });
    };

    const handleChange: any = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        console.log(event.target.value)
        const name = event.target.name as keyof typeof ReportProblem
        console.log(name)
        setReportProblem({
            ...ReportProblem,
            [name]: event.target.value,
        });
    };

    let { id } = useParams();
    const getreportProblemID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080";
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
                console.log("reportProblem", res)
                if (res.data) {
                    setReportProblem(res.data);
                } else {
                    console.log("else");
                }
            });
    };

    //ดึงพนักงาน
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

                console.log("Combobox_employee", res)
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
                    FileUploadID: 1,
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
            setFileSelected(true); // ตั้งค่า fileSelected เป็น true เมื่อมีการเลือกไฟล์
        }
    };
    const [uploadMessage, setUploadMessage] = React.useState("");
    const [uploaded, setUploaded] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();

        // กรณีมีการเลือกไฟล์
        if (fileSelected && files) {
            const apiUrl = "http://localhost:8080/uploadfile";
            if (files.length === 0) {
                setLoading(false);
                setShowSnackbar(true); // แสดง Snackbar เตือนให้อัปโหลดไฟล์
                return;
            }

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
                                FileUploadID: fileData.FileUploadID,
                                name: fileData.name,
                                size: fileData.size,
                                type: fileData.type,
                                CreatedAt: fileData.CreatedAt,
                                UpdatedAt: fileData.UpdatedAt,
                                content: null,
                            },
                        }));
                        setUploadSuccess(true);
                        setUploaded(true); // ตั้งค่า uploaded เป็น true เมื่ออัปโหลดไฟล์สำเร็จ
                        setFiles((prevFileUploads) => [...prevFileUploads, fileData]);
                        setUploadMessage("อัปโหลดแล้ว"); // ตั้งค่าข้อความ "อัปโหลดแล้ว"
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setUploadError(true);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            setShowSnackbar(true); // แสดง Snackbar เตือนให้เลือกไฟล์
        }
    };

    async function mail() {
        let data = {
            email: "jirawatkeng086@gmail.com",
            password: "awztnitdqwzgbfqx",
            empemail: "kengjrw@gmail.com",
        };

        axios.post('http://localhost:8080/Emailupdate', { message, ...data })
            .then(response => {
                console.log(response.data);
                // ทำสิ่งที่คุณต้องการเมื่อส่งอีเมลสำเร็จ
            })
            .catch(error => {
                console.error(error);
                // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการส่งอีเมล
            });
    }

    const convertType = (data: string | number | undefined | null) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };
    const did = localStorage.getItem('did')
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

        if (submitted) {
            return;
        }

        // เพิ่มเงื่อนไขเพื่อตรวจสอบว่ามีการเลือกไฟล์หรือไม่
        if (!fileSelected || (fileSelected && files.length === 0)) {
            setLoading(false);
            setShowSnackbar(true); // แสดง Snackbar เตือนให้เลือกไฟล์
            return;
        }

        let data = {
            ID: convertType(ReportProblem.ID),
            EmployeeID: emp?.UserNo,
            Heading: ReportProblem.Heading ?? "",
            Description: ReportProblem.Description ?? "",
            StatusID: 1,
            NotificationDate:  new Date(),
            DepartmentID: convertType(did),
            fileUploadID: convertType(ReportProblem.fileUploadID),
        };
        console.log(Email);
        console.log("FileUploadID:", ReportProblem.fileUploadID);
        console.log("FileUpload:", ReportProblem.FileUpload);
        console.log(data.fileUploadID);
        console.log("Data", data);
        const apiUrl = "http://localhost:8080/reportProblemE";
        const requestOptions = {
            method: "PATCH",
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
                    //mail();
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 400);
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
        getreportProblemID(id);
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
                <Alert onClose={handleClose} severity="success" icon={<CheckCircleSharpIcon />} style={{ fontSize: '20px' }}>
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
                    style={{ fontSize: '20px' }} // เพิ่มสไตล์ที่ต้องการตรงนี้
                >
                    อัพโหลดไฟล์สำเร็จ ต่อไปกดปุ่ม " บันทึกข้อมูล "
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
                        <span style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
                            <GppMaybeSharpIcon style={{ marginRight: '8px' }} />
                            {fileSelected && !files ? (
                                'กรุณากดปุ่ม "UPLOAD" ก่อนกดปุ่ม "บันทึกข้อมูล"'
                            ) : (
                                'กรุณาเลือกไฟล์ก่อน "UPLOAD" และกดปุ่ม "บันทึกข้อมูล"'
                            )}
                        </span>
                    }
                />
            </Snackbar>
            <Paper sx={{ p: 4, pb: 6 }}  >
                <Box display="flex" > <Box flexGrow={1}>
                    <Typography
                        component="h2"
                        variant="h5"
                        color="error"
                        gutterBottom
                    >
                        แก้ไขแบบฟอร์มแจ้งปัญหา Software

                        <Button style={{ float: "right" }}
                            component={RouterLink}
                            to="/reportProblemData"
                            variant="contained"
                            color="error">
                            <SourceIcon />
                            ข้อมูลการแจ้งปัญหา Software
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
                            <p>หัวข้อ</p>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="Heading"
                                    variant="outlined"
                                    value={ReportProblem.Heading}
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
                            <p>
                                <span style={{ color: 'black' }}>รายละเอียด</span>
                                <span style={{ color: 'red' }}>*</span>
                            </p>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="Description"
                                    variant="outlined"
                                    value={ReportProblem.Description}
                                    type="string"
                                    size="medium"
                                    placeholder="กรอกรายละเอียด"
                                    onChange={handleInputChange}
                                    multiline
                                    rows={6} // กำหนดจำนวนบรรทัดที่แสดงใน TextField
                                />
                            </FormControl>
                        </FormControl>
                    </Grid>
                </Grid>

                <div style={{ marginTop: '20px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="file" name="files" multiple onChange={handleFileChange} />
                            <Button type="submit" variant="contained" color={fileSelected ? "secondary" : "primary"}>
                                <span style={{ color: fileSelected ? 'yellow' : 'black' }}>UPLOAD</span>
                                <span style={{ color: 'red' }}>*</span>
                            </Button>
                            {uploadMessage && (
                                <div style={{ color: 'green', marginLeft: '20px' }}>{uploadMessage}</div>
                            )}
                        </div>
                    </form>
                </div>
                {/* <div style={{ marginTop: '20px' }}>
                    <form onSubmit={handleSubmit}>
                        <input type="file" name="files" multiple onChange={handleFileChange} />
                        <Button type="submit" variant="contained" color={fileSelected ? "secondary" : "primary"}>
                            <span style={{ color: fileSelected ? 'yellow' : 'black' }}>UPLOAD</span>
                            <span style={{ color: 'red' }}>*</span>
                        </Button>
                        {files.length > 0 && (
                            <div>
                                <h4>Selected Files:</h4>
                                <ul>
                                    {files.map((file, index) => (
                                        <li key={index}>{file.ID}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </form>
                </div> */}



                {/* 
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>วันที่/เวลา</p>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
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
                    </Grid>
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
                            to="/reportProblem"
                        >
                            ถอยกลับ
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submit}
                            disabled={
                                submitted ||
                                (!fileSelected || (fileSelected && files.length === 0)) ||
                                !uploaded // เพิ่มเงื่อนไขที่ต้องการ
                            }
                            component={RouterLink}
                            to="/reportProblemData"
                        >
                            บันทึกข้อมูล
                        </Button>

                    </Stack>
                </Grid>

            </Paper>
            <p style={{ marginTop: '20px' }}>
                <span style={{ color: 'black' }}>หมายเหตุ</span>
                <span style={{ color: 'red' }}>*</span>
                <span style={{ color: 'black' }}> ต้องกรอกข้อมูลให้ครบทุกอย่างถึงจะกดบันทึกข้อมูลได้</span>
            </p>
        </Container>



    );
}