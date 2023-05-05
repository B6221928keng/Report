import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import {  ReportProblem2Interface, ReportProblemInterface } from '../../models/IReportProblem';
import {  ListAdminReportProblem3 } from '../../service/Servics';
import moment from 'moment';
import Report_End from "./Report_End";

function ReportProblemComplete() {
    const [reportlistRcom, setReportlist] = useState<ReportProblem2Interface[]>([])
    const getreportListReportComplete = async () => {
        let res = await ListAdminReportProblem3();
        if (res.data) {
            setReportlist(res.data);
            console.log(res.data)
        }
    };

    useEffect(() => {
        getreportListReportComplete()
    }, []);

    const columns: GridColDef[] = [
        {
            field: "id", headerName: "ID", type: "number", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{moment(params.row.NotificationDate).format('DDMMYY')}|{params.row.ID}</>
            },
        },
        {
            field: "Employee", headerName: "ผู้รายงาน", type: "string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.Employee?.EmployeeName}</>
            },
        },
        {
            field: "Department", headerName: "แผนก", type: "string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.Department.DepartmentName}</>;
            },
        },
        {
            field: "Heading", headerName: "หัวข้อ", type: "string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.Heading}</>;
            },
        },
        {
            field: "Description", headerName: "รายละเอียด", type: "string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.Description}</>;
            },
        },
        {
            field: "Status", headerName: "สถานะ", type: "string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.Status.StatusName}</>;
            },
        },
        { field: "NotificationDate", headerName: "เวลา", type: "date", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("HH:mm") },

        {
            field: "Complete",
            align: "center",
            headerAlign: "center",
            width: 120,
            renderCell: (params: GridRenderCellParams<any>) => {
                <EditIcon />
                return <Report_End params={params.row.ID} />;
            },
            sortable: false,
            description: "Status",
        },

    ];

    return (
        <div>
            <Container className="container" maxWidth="lg">
                <Paper
                    className="paper"
                    elevation={6}
                    sx={{
                        padding: 2.5,
                        borderRadius: 3,
                    }}
                >
                    <Box
                        display="flex"
                    >
                        <Box flexGrow={1}>
                            <Typography
                                component="h2"
                                variant="h5"
                                color="IndianRed"
                                sx={{ fontWeight: 'bold' }}
                                gutterBottom
                            >
                                รายการแจ้งปัญหาSoftware
                            </Typography>
                        </Box>
                        {/* <Box>
                        <Button
                            component={RouterLink}
                            to="/history"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            ประวัติอนุมัติ
                        </Button>
                    </Box> */}
                    </Box>

                    <Box sx={{ borderRadius: 30 }}>
                        <DataGrid
                            rows={reportlistRcom}
                            getRowId={(row) => row.ID}
                            columns={columns}
                            autoHeight={true}
                            density={'comfortable'}
                            sx={{ mt: 2, backgroundColor: '#eeeeee' }}
                        />
                    </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default ReportProblemComplete