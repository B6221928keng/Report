import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Snackbar } from "@mui/material";
import FmdBadIcon from '@mui/icons-material/FmdBad';
import { GetReportproblemByID, UpdateReportproblem } from "../../service/Servics";
import { ReportProblemInterface } from "../../models/IReportProblem";
import React from "react";
import moment from "moment";

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
    async function approvereport() {
        try {
            let data = {
                ID: params,
                EmployeeID: reportProblem?.EmployeeID,
                StatusID: 2,
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
    async function notapprovereport() {
        try {
            let data = {
                ID: params,
                EmployeeID: reportProblem?.EmployeeID,
                StatusID: 2,
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
                color="warning"
                size="small"
                aria-label="delete"
                onClick={handleClickOpen}
            > Pending
                < FmdBadIcon />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose1}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    ตรวจสอบรายการนี้ ?
                </DialogTitle>
                <DialogActions>
                    <Button color="success" onClick={approvereport} autoFocus>
                        ใช่
                    </Button>
                    <Button color="inherit" onClick={handleClose1}>ยกเลิก</Button>
                    {/* <Button color="error" onClick={notapprovereport} autoFocus>
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