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
function AdminReportEnd() {
    const [reportlistRcom, setReportlist] = useState<ReportProblem3Interface[]>([])
    const [filterDate, setFilterDate] = useState("");
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

                return response.blob().then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", filename);
                    link.innerHTML = filename;
                    document.body.appendChild(link);
                    link.click();
                });
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
    }, []);
    // const handleExportExcel = async () => {
    //     // สร้าง workbook ใหม่
    //     const workbook = new ExcelJS.Workbook();

    //     // สร้าง worksheet ใหม่
    //     const worksheet = workbook.addWorksheet('รายการแจ้งปัญหาSoftware');

    //     // กำหนดหัวตาราง
    //     const headerRow = worksheet.addRow([
    //         'ID', 'ผู้รายงาน', 'แผนก', 'หัวข้อ', 'รายละเอียด', 'สถานะ', 'เวลา'
    //     ]);

    //     // กำหนดสไตล์สำหรับหัวตาราง
    //     headerRow.eachCell((cell) => {
    //         cell.fill = {
    //             type: 'pattern',
    //             pattern: 'solid',
    //             fgColor: { argb: 'FFC00000' }, // สีแดง
    //         };
    //         cell.font = {
    //             bold: true,
    //             color: { argb: 'FFFFFFFF' }, // สีขาว
    //         };
    //     });

    //     // เพิ่มข้อมูลลงในแต่ละแถวของตาราง
    //     reportlistRcom.forEach((row) => {
    //         worksheet.addRow([
    //             moment(row.NotificationDate).format('DDMMYY') + '|' + row.id,
    //             row.Employee?.Name,
    //             row.Department.DepartmentName,
    //             row.Heading,
    //             row.Description,
    //             row.Status.StatusName,
    //             moment(row.NotificationDate).format('HH:mm')
    //         ]);
    //     });

    //     // กำหนดขนาดคอลัมน์ให้พอดีกับข้อมูล
    //     worksheet.columns.forEach((column) => {
    //         column.width = Math.max(10, column.width || 0);
    //     });

    //     // สร้างไฟล์ Excel
    //     const buffer = await workbook.xlsx.writeBuffer();

    //     // ดาวน์โหลดไฟล์ Excel
    //     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'admin_report_end.xlsx'; // ชื่อไฟล์ที่จะดาวน์โหลด
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     window.URL.revokeObjectURL(url);
    // };

    //     <Box>
    // <Button
    //     variant="contained"
    //     color="primary"
    //     sx={{ borderRadius: 20, '&:hover': { color: '#065D95', backgroundColor: '#e3f2fd' } }}
    //     startIcon={<GetAppRoundedIcon />}
    //     onClick={handleExportExcel}
    //   >
    //     Export Excel
    //   </Button>
    // </Box>

    async function handleExportExcel() {
        // สร้าง workbook ใหม่
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Worksheet');

        // เพิ่มหัวข้อตาราง
        worksheet.columns = [
            { header: 'ID', key: 'ID', width: 10 },
            { header: 'ชื่อ', key: 'Employee', width: 20 },
            { header: 'แผนก', key: 'Department', width: 20 },
            { header: 'หัวข้อ', key: 'heading', width: 20 },
            { header: 'แผนก', key: 'description', width: 20 },
            { header: 'สถานะ', key: 'Status', width: 15 },
            { header: 'ไฟล์', key: 'NotificationDate', width: 20 }
        ];

        // เพิ่มข้อมูลลงในตาราง
        reportlistRcom.forEach(row => {
            const { id, Employee, DepartmentName, Heading, Description, Status, NotificationDate } = row;
            worksheet.addRow({
              id,
              Employee: Employee,
              Department: DepartmentName,
              heading: Heading,
              description: Description,
              Status: Status?.StatusName,
              NotificationDate: moment(NotificationDate).format("HH:mm")
            });
          });

        // สร้างไฟล์ Excel
        workbook.xlsx.writeBuffer()
            .then(buffer => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'my-workbook.xlsx';
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
            field: 'Download',
            headerName: 'ไฟล์',
            sortable: false,
            width: 110,
            headerAlign: 'center',
            align: 'center',
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
                    <button onClick={handleExportExcel}>Export to Excel</button>
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
export default AdminReportEnd