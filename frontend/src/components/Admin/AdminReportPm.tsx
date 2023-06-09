import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid';
import { ReportPrInterface, ReportProblemInterface } from '../../models/IReportProblem';
import { ListAdminReportProblem1 } from '../../service/Servics';
import Admin_Pending from './Admin_Pending';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import moment from 'moment';

function ProblemShow() {
    const [reportlist, setReportlist] = useState<ReportPrInterface[]>([])
    const getreportList = async () => {
        let res = await ListAdminReportProblem1();
        if (res.data) {
            setReportlist(res.data);
            console.log(res.data)
        }
    };
    const [empName, setEmpName] = useState("");

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

                // Check if the response contains an updated file
                if (response.status === 200 && response.url) {
                    const link = document.createElement("a");
                    link.href = response.url;
                    link.setAttribute("download", Filename);
                    link.innerHTML = Filename;
                    document.body.appendChild(link);
                    link.click();
                }
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
    useEffect(() => {
        getreportList()
    }, []);
    const columns: GridColDef[] = [
        {
            field: "id", headerName: "ID", type: "number", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <><b>{moment(params.row.NotificationDate).format('DDMMYY')}|{params.row.ID}</b></>
            },
        },
        {
            field: "Employee", headerName: "ผู้รายงาน", type: "string", width: 105, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.UserLname}</>
            },
        },
        {
            field: "Department", headerName: "แผนก", type: "string", width: 105, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.DepName}</>;
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
                return <>{params.row.StatusName}</>;
            },
        },
        { field: "NotificationDate", headerName: "เวลา", type: "date", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("HH:mm") },

        {
            field: 'Name',
            headerName: 'ไฟล์',
            sortable: false,
            width: 110,
            headerAlign: 'center',
            align: 'left',
            renderCell: (params: GridRenderCellParams<any>) => {
                return (
                    <IconButton onClick={() => handleDownloadFile(params.row.FileUploadID, params.row.name)}>
                        <GetAppRoundedIcon />
                        <span style={{ fontSize: 'small' }}>{params.row.name}</span>
                    </IconButton>
                );
            },
        },


        {
            field: "...",
            align: "center",
            headerAlign: "center",
            width: 100,
            renderCell: (params: GridRenderCellParams<any>) => {
                return (
                    <Admin_Pending
                        params={params.row.ID}
                        EmployeeName={params.row.UserLname}
                        empName={empName} // ส่งค่า empName เข้าไปใน props
                    />
                );
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

                    </Box>

                    <Box sx={{ borderRadius: 20 }}>
                        <DataGrid
                            rows={reportlist}
                            getRowId={(row) => row.ID}
                            columns={columns}
                            autoHeight={true}
                            density={'comfortable'}
                            sx={{ mt: 2, backgroundColor: '#FADBD8' }}
                        />
                    </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default ProblemShow