import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Snackbar } from "@mui/material";
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import { GetReportproblemByID, UpdateReportproblem } from "../../service/Servics";
import { ReportProblemInterface } from "../../models/IReportProblem";
import React from "react";
import axios from "axios";
import { UserInterface } from "../../models/IUser";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Admin_Complete(props: any) {
    const { params } = props;
    const [open, setOpen] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [emp, setEmp] = useState<UserInterface>();
    const [empName1, setEmpName] = useState("");
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose1 = () => {
        setOpen(false);
        setSuccess(false);
        setError(false)
    };

    const [reportProblem, setReportProblem] = React.useState<Partial<ReportProblemInterface>>({
        CompleteDate: new Date(),
    });
    const getreportProblemByID = async (id: any) => {
        let res = await GetReportproblemByID(id);
        if (res) {
            setReportProblem(res);
            console.log(res)
        }
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
            console.log("Combobox_employee", res);
            if (res.data) {
              setEmp(res.data);
              setEmpName(res.data.EmployeeName); // เพิ่มบรรทัดนี้
            } else {
              console.log("else");
            }
          });
      }
      
    const navigator = useNavigate();
    async function approveComplete() {
        try {
            let data = {
                ID: params,
                EmployeeID: reportProblem?.UserSerial,
                StID: 3,
                DepartmentID: reportProblem?.DepID,
                Heading: reportProblem?.Heading,
                Description: reportProblem?.Description,
                CompleteDate: new Date(),
                FileUploadID: reportProblem?.FileUploadID,
                EmployeeName: emp?.UserLname,

            };
            console.log(data)
            let res = await UpdateReportproblem(data);
            setSuccess(true);
            setTimeout(() => {
                window.location.reload();
            }, 800);
            // mail();
        } catch (err) {
            setError(true);
            console.log(err);
        }
    }
    async function notapproveComplete() {
        try {
            let data = {
                ID: params,
                EmployeeID: reportProblem?.UserSerial,
                StatusID: 2,
                DepartmentID: reportProblem?.DepID,
                Heading: reportProblem?.Heading,
                Description: reportProblem?.Description,
                NotificationDate: reportProblem?.NotificationDate
            };
            console.log(data)
            let res = await UpdateReportproblem(data);
            setSuccess(true);
            // setTimeout(() => {
            //     window.location.reload();
            // }, 800);

        } catch (err) {
            setError(true);
            console.log(err);
        }
    }
    useEffect(() => {
        getreportProblemByID(params);
        // กำหนดค่าเริ่มต้นให้กับ reportProblem.StatusID
        setReportProblem(prevReportProblem => ({
            ...prevReportProblem,
            StatusID: 3 // หรือค่าที่คุณต้องการ
        }));
    }, []);
    async function mail() {
        let data = {
            email: "kengjrw@gmail.com",
            password: "yrrpalwosqsnmxvg",
            empemail: "jirawatkeng086@gmail.com",
        };
        console.log(data)
        axios.post('http://localhost:8080/AmailComplete', data)
            .then(response => {
                console.log(response.data);
                // ทำสิ่งที่คุณต้องการเมื่อส่งอีเมลสำเร็จ
            })
            .catch(error => {
                console.error(error);
                // ทำสิ่งที่คุณต้องการเมื่อเกิดข้อผิดพลาดในการส่งอีเมล
            });
    }
    return (
        <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#93C47D' }}
                size="small"
                aria-label="delete"
                onClick={handleClickOpen}
            >  Complete
                <   DomainVerificationIcon />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose1}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    แก้ไขรายการนี้เสร็จแล้ว ?
                </DialogTitle>
                <DialogActions>
                    <Button color="success" onClick={approveComplete} autoFocus>
                        ใช่
                    </Button>
                    <Button color="inherit" onClick={handleClose1}>ยกเลิก</Button>
                    {/* <Button color="error" onClick={notapproveComplete} autoFocus>
                        ไม่ตรวจสอบ
                    </Button> */}
                </DialogActions>
                <Snackbar
                    open={success}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="success">
                        ยืนยันสำเร็จ
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="error">
                        ยืนยันไม่สำเร็จ
                    </Alert>
                </Snackbar>
            </Dialog>

        </div>
    );
}