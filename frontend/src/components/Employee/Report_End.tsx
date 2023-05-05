import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Snackbar } from "@mui/material";
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import { GetReportproblemByID, UpdateReportproblem } from "../../service/Servics";
import { ReportProblemInterface } from "../../models/IReportProblem";
import React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Report_End(props: any) {
    const { params } = props;
    const [open, setOpen] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
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
        NotificationDate: new Date(),
    });
    const getreportProblemByID = async (id: any) => {
        let res = await GetReportproblemByID(id);
        if (res) {
            setReportProblem(res);
            console.log(res)
        }
    }
    const navigator = useNavigate();
    async function approveEnd() {
        try {
            let data = {
                ID: params,
                EmployeeID: reportProblem?.EmployeeID,
                StatusID: 4,
                DepartmentID: reportProblem?.DepartmentID,
                Heading: reportProblem?.Heading,
                Description: reportProblem?.Description,
                NotificationDate: new Date(),

            };
            console.log(data)
            let res = await UpdateReportproblem(data);
            setSuccess(true);
            setTimeout(() => {
                window.location.reload();
            }, 800);

        } catch (err) {
            setError(true);
            console.log(err);
        }
    }
    async function notapproveEnd() {
        try {
            let data = {
                ID: params,
                EmployeeID: reportProblem?.EmployeeID,
                StatusID: 4,
                DepartmentID: reportProblem?.DepartmentID,
                Heading: reportProblem?.Heading,
                Description: reportProblem?.Description,
                NotificationDate: reportProblem?.NotificationDate
            };
            console.log(data)
            let res = await UpdateReportproblem(data);
            setSuccess(true);
            setTimeout(() => {
                window.location.reload();
            }, 800);

        } catch (err) {
            setError(true);
            console.log(err);
        }
    }
    useEffect(() => {
        getreportProblemByID(params);
    }, []);
    return (
        <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#93C47D' }}
                size="small"
                aria-label="delete"
                onClick={handleClickOpen}
            >  End
                <   DomainVerificationIcon />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose1}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    ใช้งานได้ปกติ ?
                </DialogTitle>
                <DialogActions>
                    <Button color="inherit" onClick={handleClose1}>ยกเลิก</Button>
                    <Button color="success" onClick={approveEnd} autoFocus>
                        ใช่
                    </Button>
                    {/* <Button color="error" onClick={notapproveEnd} autoFocus>
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