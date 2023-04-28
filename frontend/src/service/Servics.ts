import { ReportProblemInterface } from "../models/IReportProblem";
import http from "../http-common";
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

async function UpdateReportproblem(data: Partial<ReportProblemInterface>) {
   
  const requestOptions = {
      method: "PATCH",
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  }

  let res = await fetch(`${apiUrl}/reportProblems`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        return res
      })
  return res
}

export {
  
  reportProblem,
  ListLeaveType,
  GetReportproblemByID,
  UpdateReportproblem,
  ListAdminReportProblem,
}
