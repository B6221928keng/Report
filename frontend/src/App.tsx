import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from '@mui/system';
import Home from './components/Home';
import Signin from './components/Sigin';

import DrawerBar from './components/DrawerBar';
import { createTheme, CssBaseline, styled, ThemeProvider } from '@mui/material';


import ReportProblemCreate from './components/Employee/ReportProblemCreate';
import ReportProblemComplete from './components/Employee/ReportProblemComplete';
import ReportProblemUpdate from './components/Employee/ReportProblemUpdate';
import AdminReportProblem from './components/Admin/AdminReportProblem';
import AdminReportComplete from './components/Admin/AdminReportComplete';
import Admin_Pending from './components/Admin/Admin_Pending';
import AdminReportEnd from './components/Admin/AdminReportEnd';
import ProblemShow from './components/Admin/AdminReportPm';
import Admin_Complete from './components/Admin/Admin_Complete';
import ReportProblemdata from './components/Employee/ReportProblemdata';
import CreateAdmin from './components/CreateAdmin';

const drawerWidth = 240;

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: "#C0C0C0",
      },
      secondary: {
        main: "#8FCCB6"
      },
      text: {
        primary: "#1B2420",
        secondary: "#1B2420"
      }
    },

  })
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [token, setToken] = React.useState<String>("");

  const [role, setRole] = React.useState<String>("")
  const [open, setOpen] = React.useState<boolean>(false)

  useEffect(() => {
    const token: any = localStorage.getItem("token")
    const role: any = localStorage.getItem("role")
    if (token) {
      setToken(token)
      setRole(role)
    }

  }, [])

  if (!token) {
    return <Signin />
  }

  const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: Boolean; }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));


  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navbar open={open} onClick={handleDrawerOpen} />
            <DrawerBar open={open} drawerWidth={drawerWidth} handleDrawerClose={handleDrawerClose} role={role} theme={theme} />

            <Main open={open}>
              <DrawerHeader />

              <Routes>
                {role === "1" && (
                  <>

                    {/* <Route path="/" element={<Emp  />} />
                  <Route path="/form" element={<Form  />} /> */}
                    <Route path="/" element={<Home />} />
                    <Route path="/ReportProblemUpdate/:id" element={<ReportProblemUpdate />} />
                    <Route path="/reportProblemCreate" element={<ReportProblemCreate />} />
                    <Route path="/reportProblemComplete" element={<ReportProblemComplete />} />
                    <Route path="/reportProblemdata" element={<ReportProblemdata />} />

                  </>

                )}
                {role === "2" && (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/adminReportProblem" element={<AdminReportProblem />} />
                    <Route path="/adminReportPending/:id" element={<Admin_Pending />} />
                    <Route path="/adminReportComplete:id" element={<Admin_Complete />} />
                    <Route path="/adminReportComplete/:id" element={<AdminReportComplete />} />
                    <Route path="/adminReportProblems" element={<ProblemShow />} />
                    <Route path="/adminReportEnd/:id" element={<AdminReportEnd />} />

                  </>
                )}
                <Route path="/createAdmin" element={<CreateAdmin />} />
                
              </Routes>
            </Main>

          </Box>
        </div>

      </Router>

    </ThemeProvider>
  )
}

export default App;