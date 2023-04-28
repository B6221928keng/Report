import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Snackbar } from "@mui/material";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { GetReportproblemByID, UpdateReportproblem } from "../service/Servics";
import { ReportProblemInterface } from "../models/IReportProblem";
import React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Admin_Pending(props: any) {
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

    const [ReportProblem, setReportProblem] = useState<ReportProblemInterface>();
    const getreportProblemByID = async (id: any) => {
        let res = await GetReportproblemByID(id);
        if (res) {
            setReportProblem(res);
            console.log(res)
        }
    }
    const navigator = useNavigate();
    async function approvereport() {
        try {
            let data = {
                ID: params,
                EmployeeID: ReportProblem?.EmployeeID,
                StatusID: ReportProblem?.StatusID,
                DepartmentID: ReportProblem?.DepartmentID,
                Heading: ReportProblem?.Heading,
                Description: ReportProblem?.Description,
                NotificationDate: ReportProblem?.NotificationDate
                
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
    async function notapprovereport() {
        try {
            let data = {
                ID: params,
                EmployeeID: ReportProblem?.EmployeeID,
                StatusID: ReportProblem?.StatusID,
                DepartmentID: ReportProblem?.DepartmentID,
                Heading: ReportProblem?.Heading,
                Description: ReportProblem?.Description,
                NotificationDate: ReportProblem?.NotificationDate
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
            <IconButton
                color="inherit"
                size="small"
                aria-label="delete"
                onClick={handleClickOpen}
            >
                <PendingActionsIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose1}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    ต้องการตรวจสอบรายการนี้ ?
                </DialogTitle>
                <DialogActions>
                    <Button color="inherit" onClick={handleClose1}>ยกเลิก</Button>
                    <Button color="success" onClick={approvereport} autoFocus>
                        ตรวจสอบ
                    </Button>
                    <Button color="error" onClick={notapprovereport} autoFocus>
                        ไม่ตรวจสอบ
                    </Button>
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