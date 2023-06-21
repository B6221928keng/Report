import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarFilterButton, GridValueGetterParams } from '@mui/x-data-grid';
import { ReportPrInterface, ReportProblem2Interface, ReportProblemInterface } from '../../models/IReportProblem';
import { ListAdminReportProblem3 } from '../../service/Servics';
import moment from 'moment';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import EditIcon from '@mui/icons-material/Edit';
import './color.css';
import CheckIcon from '@mui/icons-material/Check';
import { FileUploadInterface } from "../../models/IFileUpload";
import DeleteIcon from '@mui/icons-material/Delete';
function ReportProblemdata() {
    const [reportlistdata, setReportlistdata] = useState<ReportProblemInterface[]>([])
    const [reportfile, setReportfile] = useState<FileUploadInterface[]>([])
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");
    const getReportProblem = async () => {
        const apiUrl = "http://localhost:8080/reportProblem";
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
          console.log(res.data);
          if (res.data) {
            const sortedData = res.data.sort((a: { ID: number; }, b: { ID: number; }) => b.ID - a.ID); // Sort data by ID in descending order
            setReportlistdata(sortedData);
          }
        });
    };
    // const getFileUpload = async () => {
    //     const apiUrl = "http://localhost:8080/fileUploads";
    //     const requestOptions = {
    //         method: "GET",
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },
    //     };
    //     fetch(apiUrl, requestOptions)
    //         .then((response) => response.json())
    //         .then((res) => {
    //             console.log(res.data);
    //             if (res.data) {
    //                 setReportfile(res.data);
    //             }
    //         });
    // };
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

    // const DeleteFileUpload = async (id: string | number | undefined) => {
    //     const apiUrl = "http://localhost:8080";
    //     const requestOptions = {
    //         method: "DELETE",
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },
    //     };

    //     fetch(`${apiUrl}/fileUploads/${id}`, requestOptions)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error(response.statusText);
    //             }
    //             return response.json();
    //         })
    //         .then((res) => {
    //             if (res.data) {
    //                 setSuccess(true);
    //                 console.log("ลบสำเร็จ");
    //                 setErrorMessage("");
    //             } else {
    //                 setErrorMessage(res.error);
    //                 setError(true);
    //                 console.log("ลบไม่สำเร็จ");
    //             }
    //             getFileUpload();
    //         })
    //         .catch((error) => {
    //             console.error("เกิดข้อผิดพลาดในการลบ:", error);
    //             // ดำเนินการอื่น ๆ ที่เกี่ยวข้องกับข้อผิดพลาด
    //         });
    // };
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    useEffect(() => {
        getReportProblem()
        // getFileUpload()
        setCurrentTime(new Date());
    }, []);

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            type: "number",
            width: 120,
            headerAlign: "center",
            align: "center",
            renderCell: (params: GridRenderCellParams<any>) => {
              return (
                <>
                 <b> {moment(params.row.NotificationDate).format("DDMMYY")}|
                  {params.row.ID}</b>
                </>
              );
            },
          },
        // {
        //     field: "", headerName: "ผู้รายงาน", type: "string", width: 105, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
        //         return <>{params.row.UserLname}</>
        //     },
        // },
        // {
        //     field: "Department", headerName: "แผนก", type: "string", width: 105, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
        //         return <>{params.row.DepName}</>;
        //     },
        // },
        {
            field: "Heading", headerName: "หัวข้อ", type: "string", width: 200, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.Heading}</>;
            },
        },
        {
            field: "Description", headerName: "รายละเอียด", type: "string", width: 300, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
                return <>{params.row.Description}</>;
            },
        },

        { field: "NotificationDate", headerName: "เวลา", type: "date", width: 100, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("HH:mm") },

        // {
        //     field: "NotificationDate",
        //     headerName: "เวลา",
        //     width: 100,
        //     headerAlign: "center",
        //     align: "center",
        //     valueGetter: (params: GridValueGetterParams) => {
        //       const statusName = params.row.StatusName;
        //       const notificationDate = params.row.NotificationDate;
          
        //       if (statusName === "Send request") {
        //         return moment(notificationDate).format("HH:mm");
        //       } else if (statusName === "Pending") {
        //         return "Pending";
        //       } else if (statusName === "Complete") {
        //         return "Complete";
        //       } else if (statusName === "End") {
        //         return "End";
        //       }
          
        //       return "";
        //     },
        //   },
          
        {
            field: 'Name',
            headerName: 'ไฟล์',
            sortable: false,
            width: 165,
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

        // {
        //     field: 'Delete',
        //     headerName: 'ลบ',
        //     sortable: false,
        //     width: 150,
        //     headerAlign: 'center',
        //     align: 'left',
        //     renderCell: (params: GridRenderCellParams<any>) => {
        //         return (
        //             <IconButton onClick={() => DeleteFileUpload(params.row.ID)}>
        //                 <DeleteIcon style={{ color: 'red' }} />
        //                 <span style={{ fontSize: 'small', color: 'red' }}>{params.row.FileUpload.name}</span>
        //             </IconButton>
        //         );
        //     },
        // },

        {
            field: 'ReportProblemUpdate',
            headerName: '...',
            sortable: false,
            width: 110,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: GridRenderCellParams<any>) => {
                return (
                    <Button
                        component={RouterLink}
                        to={"/ReportProblemUpdate/" + params.row.ID}
                        variant="contained"
                        color="primary"
                    >
                        แก้ไขข้อมูล
                    </Button>
                );
            },
        },

        {
            field: 'StatusName',
            headerName: 'สถานะ',
            sortable: false,
            type: "string",
            width: 110,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: GridRenderCellParams<any>) => {
                let statusColor = '';
                let statusIcon = null;

                if (params.row.StatusName === "Send request") {
                    statusColor = 'red';
                } else if (params.row.StatusName === "Pending") {
                    statusColor = 'orange';
                } else if (params.row.StatusName === "Complete") {
                    statusColor = 'green';
                } else if (params.row.StatusName === "End") {
                    statusColor = 'darkgreen';
                    statusIcon = <CheckIcon style={{ fontSize: 'small' }} />;
                }


                return (
                    <IconButton>
                        <span style={{ fontSize: 'small', color: statusColor }}>
                            {params.row.StatusName}
                            {statusIcon}
                        </span>
                    </IconButton>
                );
            },
        },

        // {
        //     field: 'StatusName',
        //     headerName: 'สถานะ',
        //     sortable: false,
        //     type: "string",
        //     width: 110,
        //     headerAlign: 'center',
        //     align: 'center',
        //     renderCell: (params: GridRenderCellParams<any>) => {
        //         let statusColor = '';
        //         let statusIcon = null;
        //         let dateToDisplay = null;
              
        //         if (params.row.StatusName === "Send request") {
        //           statusColor = 'red';
        //         } else if (params.row.StatusName === "Pending") {
        //           statusColor = 'orange';
        //           dateToDisplay = params.row.PendingDate ? moment(params.row.Pending).format("DDMMYY") : null;
        //         } else if (params.row.StatusName === "Complete") {
        //           statusColor = 'green';
        //           dateToDisplay = params.row.CompleteDate ? moment(params.row.CompleteDate).format("DDMMYY") : null;
        //         } else if (params.row.StatusName === "End") {
        //           statusColor = 'darkgreen';
        //           statusIcon = <CheckIcon style={{ fontSize: 'small' }} />;
        //           dateToDisplay = params.row.EndDate ? moment(params.row.EndDate).format("DDMMYY") : null;
        //         }
              
        //         return (
        //           <IconButton>
        //             <span style={{ fontSize: 'small', color: statusColor }}>
        //               {params.row.StatusName}
        //               {statusIcon}
        //               {dateToDisplay && ` ${dateToDisplay}`}
        //             </span>
        //           </IconButton>
        //         );
        //       },
        // },
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
                                ข้อมูลการแจ้งปัญหาSoftware
                            </Typography>
                        </Box>
                        <Box>
                            <Button
                                component={RouterLink}
                                to="/reportProblemCreate"
                                variant="contained"
                                color="error"
                            >
                                เพิ่มข้อมูลปัญหา Software
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ borderRadius: 30 }}>
                        <DataGrid
                            rows={reportlistdata}
                            getRowId={(row) => row.ID}
                            columns={columns}
                            autoHeight={true}
                            density={'comfortable'}
                            sx={{ mt: 2, backgroundColor: '#feffd9' }}
                        />
                    </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default ReportProblemdata