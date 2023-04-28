import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box, Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarColumnsButton ,GridToolbarFilterButton} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { ReportProblem1Interface,ReportProblemInterface } from '../models/IReportProblem';
import { ListAdminReportProblem } from '../service/Servics';
import Admin_Pending from './Admin_Pending';
import moment from 'moment';

function ProblemShow(){

    const [reportlist, setreportlist] = useState<ReportProblem1Interface[]>([])
    const getReportList = async (id: any) => {
        try {
          const res = await ListAdminReportProblem(id);
          if (res.data) {
            setreportlist(res.data);
          }
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
        // getReportList();
    }, []);
    
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const columns: GridColDef[] = [
        { field: "Empname", headerName: "ผู้รายงาน",type:"string", width: 120, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Empname}</>},
        },
        { field: "Department", headerName: "แผนก",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.TypeName}</>;
          },},
        { field: "Heading", headerName: "หัวข้อ",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Heading}</>;
          }, },  
          { field: "Description", headerName: "รายละเอียด",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Description}</>;
          }, }, 
          { field: "Status", headerName: "สถานะ",type:"string", width: 150, headerAlign: "center", align: "center", renderCell: (params: GridRenderCellParams<any>) => {
            return <>{params.row.Status}</>;
          }, }, 
        { field: "NotiDate", headerName: "เวลา/วันที่",type:"date", width: 250, headerAlign: "center", align: "center", valueFormatter: (params) => moment(params?.value).format("MM/DD/YYYY hh:mm A")},
      
          {
            field: "Pending",
            align: "center",
            headerAlign: "center",
            width: 85,
            renderCell: (params: GridRenderCellParams<any>) => {
                <EditIcon />
              return <Admin_Pending params={params.row.ID} />;
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
                
                <Box sx={{ borderRadius: 20 }}>
                    <DataGrid
                        rows={reportlist}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        autoHeight={true}
                        density={'comfortable'}
                        slots={{toolbar: GridToolbarColumnsButton}}
                        sx={{ mt: 2, backgroundColor: '##FADBD8' }}
                    />
                </Box>
                </Paper>
            </Container>
        </div>
    )
}
export default ProblemShow