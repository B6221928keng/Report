import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { ReportProblem3Interface, ReportProblemInterface } from '../../models/IReportProblem';
import { ListAdminReportProblem4 } from '../../service/Servics';
import moment from 'moment';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import Report_End from "../Employee/Report_End";
import * as ExcelJS from 'exceljs';
import { EmployeeInterface } from "../../models/IEmployee";
function AdminReportEnd() {
    const [reportlistRcom, setReportlist] = useState<ReportProblem3Interface[]>([])
    const [filterDate, setFilterDate] = useState("");
    const [empName, setEmpName] = useState("");
    const [emp, setEmp] = React.useState<EmployeeInterface>();
    const handleFilterDateChange = (event: any) => {
        const selectedDate = event.target.value;
        const formattedDate = moment(selectedDate).format('YYYY-MM');
        console.log(formattedDate);
        setFilterDate(formattedDate);
    };
    const getreportListAdminEnd = async () => {
        let res = await ListAdminReportProblem4();
        if (res.data) {
            setReportlist(res.data);
            console.log(res.data)
        }
    };
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
        console.log("Combobox_employee", res);
        if (res.data) {
            setEmp(res.data);
            setEmpName(res.data.EmployeeName); // เพิ่มบรรทัดนี้
        } else {
            console.log("else");
        }
    });
}
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
        getreportListAdminEnd()
        getEmployee()
    }, []);

    async function handleExportExcel() {
        // สร้าง workbook ใหม่
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Worksheet');

        // เพิ่มหัวข้อตาราง
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'ชื่อผู้แจ้งปัญหา', key: 'Employee', width: 20 },
            { header: 'แผนก', key: 'Department', width: 20 },
            { header: 'หัวข้อ', key: 'heading', width: 20 },
            { header: 'รายละเอียด', key: 'description', width: 20 },
            { header: 'สถานะ', key: 'Status', width: 20 },
            { header: 'ไฟล์', key: 'FileUpload', width: 25 },
            { header: 'เวลาที่แจ้งปัญหา', key: 'NotificationDate', width: 20 },
            { header: 'เวลารับแจ้งปัญหา', key: 'PendingDate', width: 20 },
            { header: 'เวลาแก้ไขเสร็จ', key: 'CompleteDate', width: 20 },
            { header: 'เสร็จสิ้นการทำงาน', key: 'EndDate', width: 20},
            { header: 'ผู้แก้ไข', key: 'emp', width: 20 }
        ];

        // เพิ่มข้อมูลลงในตาราง
        reportlistRcom.forEach(row => {
            const { ID, Employee, Department, Heading, Description, Status, FileUpload, NotificationDate, PendingDate, CompleteDate, EndDate,  } = row;
            worksheet.addRow({
                id: `${moment(NotificationDate).format('DDMMYY')}|${ID}`,
                Employee: Employee.EmployeeName,
                Department: Department.DepartmentName,
                heading: Heading,
                description: Description,
                Status: Status?.StatusName,
                FileUpload: FileUpload?.name,
                NotificationDate: moment(NotificationDate).format("HH:mm | DD.MM.YY"),
                PendingDate: moment(PendingDate).format("HH:mm | DD.MM.YY"),
                CompleteDate: moment(CompleteDate).format("HH:mm | DD.MM.YY"),
                EndDate: moment(EndDate).format("HH:mm | DD.MM.YY"),
                emp: emp?.EmployeeName
            });
        });

        // สร้างไฟล์ Excel
        workbook.xlsx.writeBuffer()
            .then(buffer => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Report software problem.xlsx';
                link.click();
                URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.log(`Error: ${error.message}`);
            });
    }

    const columns: GridColDef[] = [
        {
            field: "id", headerName: "ID", type: "number", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{moment(params.row.NotificationDate).format('DDMMYY')}|{params.row.ID}</>
            },
        },
        {
            field: "Employee", headerName: "ผู้รายงาน", type: "string", width: 105, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.Employee?.EmployeeName}</>
            },
        },
        {
            field: "Department", headerName: "แผนก", type: "string", width: 105, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
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
        { field: "EndDate", headerName: "เวลา", type: "date", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("HH:mm") },

        {
            field: 'Download',
            headerName: 'ไฟล์',
            sortable: false,
            width: 110,
            headerAlign: 'center',
            align: 'left',
            renderCell: (params: GridRenderCellParams<any>) => {
                return (
                    <IconButton onClick={() => handleDownloadFile(params.row.ID, params.row.FileUpload.name)}>
                        <GetAppRoundedIcon />
                        <span style={{ fontSize: 'small' }}>{params.row.FileUpload.name}</span>
                    </IconButton>
                );
            },
        },

        {
            field: "...",
            align: "center",
            headerAlign: "center",
            width: 120,
            renderCell: (params: GridRenderCellParams<any>) => {
                return <span style={{ color: "green" }}>เสร็จสมบูรณ์</span>;
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
                        justifyContent="space-between" // จัดเรียงปุ่มที่ต้องการให้อยู่ข้างขวา
                    >
                        <Typography
                            component="h2"
                            variant="h5"
                            color="IndianRed"
                            sx={{ fontWeight: 'bold' }}
                            gutterBottom
                        >
                            รายการแจ้งปัญหา Software
                        </Typography>
                        <Button
                            onClick={handleExportExcel} // เรียกใช้ฟังก์ชัน handleExportExcel เมื่อคลิกปุ่ม
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
                        >
                            Export to Excel
                        </Button>
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
    );
}

export default AdminReportEnd;