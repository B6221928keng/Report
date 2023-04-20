import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import axios from 'axios';
import PhotoIcon from '@mui/icons-material/Photo';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ReportProblemInterface } from "../models/IReportProblem";

function ReportProblemComplete() {
    const [reportProblem, setReportProblem] = React.useState<ReportProblemInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");
    const [currentImage, setCurrentImage] = React.useState<File>();
    const [previewImage, setPreviewImage] = React.useState<string>("");
    const [progress, setProgress] = React.useState<number>(0);
    const [message, setMessage] = React.useState<string>("");
    const [image, setImage] = useState<File | null>(null);
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
                    setReportProblem(res.data);
                }
            });
    };

































    
}
export default ReportProblemComplete;