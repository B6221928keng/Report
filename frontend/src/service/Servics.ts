import { ReportProblemInterface, ReportProblemInterfaceT } from "../models/IReportProblem";

const apiUrl = "http://localhost:8080";
async function reportProblem() {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/reportProblems`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      }
    });

  return res;
}
async function ListLeaveType() {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/leavetypes`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      }
    });

  return res;
}
async function GetReportproblemByID(id: any) {

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/reportProblem/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });

  return res;
}

async function ListAdminReportProblem(id:any) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/adminReportProblem/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
}
async function ListAdminReportProblem1() {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/reportProblemstatus1`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
}
async function ListAdminReportProblem2() {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/reportProblemstatus2`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
}
async function ListAdminReportProblem3() {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/reportProblemstatus3`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
}
async function ListAdminReportProblem4() {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/reportProblemstatus4`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res) {
        return res;
      } 
    });

  return res;
}
async function UpdateReportproblem(data: Partial<ReportProblemInterface>) {
   
  const requestOptions = {
      method: "PATCH",
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  }

  let res = await fetch(`${apiUrl}/reportProblem`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        return res
      })
  return res
}
async function UpdateReportproblemC(data: Partial<ReportProblemInterface>) {
   
  const requestOptions = {
      method: "PATCH",
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  }

  let res = await fetch(`${apiUrl}/reportProblemc`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        return res
      })
  return res
}
async function UpdateReportproblemE(data: Partial<ReportProblemInterface>) {
   
  const requestOptions = {
      method: "PATCH",
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  }

  let res = await fetch(`${apiUrl}/reportProblemEnd`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        return res
      })
  return res
}
export {
  UpdateReportproblemE,
  UpdateReportproblemC,
  reportProblem,
  ListLeaveType,
  GetReportproblemByID,
  UpdateReportproblem,
  ListAdminReportProblem,
  ListAdminReportProblem1,
  ListAdminReportProblem2,
  ListAdminReportProblem3,
  ListAdminReportProblem4,
}
