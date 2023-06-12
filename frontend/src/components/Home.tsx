import img from './image/logo.jpg';
import { Container, IconButton, Typography } from '@mui/material';
import home from './image/Home.jpg';
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { ReportProblem3Interface, ReportProblemInterface } from '../models/IReportProblem';
import moment from 'moment';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import './Home.css'; // นำเข้าไฟล์ CSS
import { ListAdminReportProblem4 } from '../service/Servics';
import { EmployeeInterface } from '../models/IEmployee';
import Admin_Pending from './Admin/Admin_Pending';
function Home() {
  const [reportListData, setReportListData] = useState<ReportProblemInterface[]>([]);
  const [reportlistRcom, setReportlist] = useState<ReportProblem3Interface[]>([])
  const [emp, setEmp] = React.useState<EmployeeInterface>();
  const [admin, setadmin] = React.useState<EmployeeInterface>();
  const [statusChangedBy, setStatusChangedBy] = useState<number | null>(null);
  const [empName, setEmpName] = useState("");
  useEffect(() => {
    getReportProblem();
    getreportListAdminEnd();
    getEmployee();
    getAdmin();
  }, []);

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
          // Sort the reportListData array based on ID in descending order
          const sortedData = res.data.sort((a: ReportProblem3Interface, b: ReportProblem3Interface) => b.ID - a.ID);
          // Get only the first 5 items
          const latestData = sortedData.slice(0, 5);
          setReportListData(latestData);
        }
      });
  };

  const getreportListAdminEnd = async () => {
    let res = await ListAdminReportProblem4();
    if (res.data) {
      const sortedData = res.data.sort(
        (a: ReportProblemInterface, b: ReportProblemInterface) => b.ID - a.ID
      );
      const latestData = sortedData.slice(0, 5);
      setReportlist(latestData);

      // Find the user who changed the status
      const changedBy = latestData.find(
        (report: ReportProblemInterface) =>
          report.Status.StatusName !== "End" &&
          report.Status.StatusName !== "Send request"
      );
      if (changedBy) {
        setStatusChangedBy(changedBy.EmployeeID);
      }
    }
  };
  function getEmployee() {
    const UserID = localStorage.getItem("uid");
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
          setEmpName(res.data.EmployeeName); // เก็บชื่อพนักงานในตัวแปร empName
        } else {
          console.log("else");
        }
      });
  }
  function getAdmin() {
    const UserID = localStorage.getItem("uid");
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
          setadmin(res.data);
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

  return (

    <div>

      <Container className="container" maxWidth="md">
        <h1 className="Thasadith" style={{ textAlign: "center", color: "DarkBlue" }}>ระบบแจ้งปัญหาการใช้งาน Software</h1>
        <Typography component="h1" variant="h5">
          {/* <img
            style={{
              width: "40%", // ปรับขนาดของรูปให้เต็มของพื้นที่ของ Container
              display: "block", // ให้รูปแสดงเป็นบล็อก (block element) เพื่อให้สามารถกำหนดขนาดและตำแหน่งได้
              margin: "0 auto", // จัดให้รูปแสดงตรงกลาง
            }}
            className="img"
            src={home}
            alt="Logo"
          /> */}
        </Typography>
      </Container>
      {localStorage.getItem("role") === "employee" && (

        <TableContainer component={Paper} elevation={6}
          sx={{
            padding: 1,
            borderRadius: 0,
          }}>
          <Table className="custom-table" align="center" style={{ boxShadow: "10px 10px 10px rgba(10, 10, 10, 0.15)", borderRadius: "20px", backgroundColor: "#f4f4f4", width: "90%", height: "90px" }}> {/* เพิ่มคลาส CSS */}
            <TableHead>
              <TableRow className="table-divider">
                <TableCell align="center" width="15">ID</TableCell>
                <TableCell align="center" width="15">หัวข้อ</TableCell>
                <TableCell align="center" width="15">รายละเอียด</TableCell>
                <TableCell align="center" width="15">เวลา</TableCell>
                <TableCell align="center" width="15">ดาวน์โหลด</TableCell>
                <TableCell align="center" width="15">สถานะ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportListData.map((report) => (
                report.Status.StatusName !== "End" && (
                  <TableRow key={report.ID}>
                    <TableCell align="center" width="15"> {moment(report.NotificationDate).format('DDMMYY')}|{report.ID}</TableCell>
                    <TableCell align="center" width="15">{report.Heading}</TableCell>
                    <TableCell align="center" width="15">{report.Description}</TableCell>
                    <TableCell align="center" width="15">  {moment(report.NotificationDate).format('HH:mm')}</TableCell>
                    <TableCell align="center" width="15">
                      <IconButton onClick={() => handleDownloadFile(report.ID, report.FileUpload.name)}>
                        <GetAppRoundedIcon />
                      </IconButton>
                      {report.FileUpload.name}
                    </TableCell>
                    <TableCell align="center" width="15">
                      <span
                        style={{
                          color: report.Status.StatusName === "Send request" ? "red" : report.Status.StatusName === "Pending" ? "orange" : "green",
                        }}
                      >
                        {report.Status.StatusName}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {localStorage.getItem("role") === "admin" && (
        <TableContainer component={Paper}>
          <Table className="custom-table1" align="center" style={{ boxShadow: "10px 10px 10px rgba(10, 5, 10, 0.15)", borderRadius: "20px", backgroundColor: "#f4f4f4", width: "90%", height: "90px" }}>
            <TableHead style={{ borderRadius: "20px" }}>
              <TableRow className="table-divider">
                <TableCell align="center" width="15">ID</TableCell>
                <TableCell align="center" width="15">ชื่อ</TableCell>
                <TableCell align="center" width="15">หัวข้อ</TableCell>
                <TableCell align="center" width="15">รายละเอียด</TableCell>
                <TableCell align="center" width="15">เวลา</TableCell>
                <TableCell align="center" width="15">ดาวน์โหลด</TableCell>
                <TableCell align="center" width="15">สถานะ</TableCell>
                <TableCell align="center" width="15">IT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportListData.map((report) => (
                report.Status.StatusName !== "End" && (
                  <TableRow key={report.ID}>
                    <TableCell align="center" width="15"> {moment(report.NotificationDate).format('DDMMYY')}|{report.ID}</TableCell>
                    <TableCell align="center" width="15">{report.Employee.EmployeeName}</TableCell>
                    <TableCell align="center" width="15">{report.Heading}</TableCell>
                    <TableCell align="center" width="15">{report.Description}</TableCell>
                    <TableCell align="center" width="15">  {moment(report.NotificationDate).format('HH:mm')}</TableCell>
                    <TableCell align="center" width="15">
                      <IconButton onClick={() => handleDownloadFile(report.ID, report.FileUpload.name)}>
                        <GetAppRoundedIcon />
                      </IconButton>
                      {report.FileUpload.name}
                    </TableCell>
                    <TableCell align="center" width="15">
                      <span
                        style={{
                          color: report.Status.StatusName === "Send request" ? "red" : report.Status.StatusName === "Pending" ? "orange" : "green",
                        }}
                      >
                        {report.Status.StatusName === "Send request" ? "Send request" : report.Status.StatusName}
                      </span>
                    </TableCell>
                    <TableCell align="center" width="15">
                      {report.Status.StatusName === "Send request" ? (
                        "ยังไม่มีการตรวจสอบ"
                      ) : (
                        <span>
                          {report.Status.StatusName === "Pending" &&
                            (report.Admin.EmployeeName)}
                          {report.Status.StatusName === "Complete" &&
                            (report.Admin.EmployeeName)}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </div>


  );
}

export default Home;
