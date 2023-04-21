import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate , Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { ListItem, ListItemButton, ListItemIcon, IconButton, Divider, List, Drawer } from "@mui/material"; 
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReportIcon from '@mui/icons-material/Report';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MenuIcon from '@mui/icons-material/Menu';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import FlakyIcon from '@mui/icons-material/Flaky';
export default function DrawerBar({ role, drawerWidth, handleDrawerClose, open, theme}: any) {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),

        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));
    const Listitemlink = () => {
        var menu: any[] = [];
        // if (role === "employee") {
        //     menu = [
        //         { name: "กรอกข้อมูล", 
        //         icon: <ReportIcon />, 
        //         link: "/reportProblemCreate",
        //     },
                
        //         { name: "ข้อมูล",     
        //         icon: <FormatListNumberedIcon />,  
        //         link: "/reportProblem"},

        //     ]
        // } else if (role === "admin") {
        //     menu = [
                
        //         { name: "ข้อมูลรอตรวจสอบ", 
        //         icon: <ErrorOutlineIcon />, 
        //         link: "/adminReportProblem"
        //     },

        //         { name: "ทำการแก้ไข",     
        //         icon: <ChecklistIcon />, 
        //         link: "/adminReportComplete/:id"},

        //     ]
        // } 
        const menuemployee = [
            { name: "กรอกข้อมูล", icon: <ReportIcon />, path: "/reportProblemCreate" },
            { name: "ข้อมูล", icon: <FormatListNumberedIcon />, path: "/reportProblem" },
            { name: "ใช้งานได้", icon: <ChecklistRtlIcon />, path: "/reportProblem" },
          ]
          const menuadmin = [
            { name: "ข้อมูลรอตรวจสอบ", icon: <ErrorOutlineIcon />, path: "/adminReportProblem" },
            { name: "ทำการแก้ไข", icon: <FlakyIcon />, path: "/adminReportComplete/:id" },
            { name: "เสร็จสิ้น", icon: <CheckCircleOutlineIcon />, path: "/adminReportComplete/:id" },
          ]
        
          var menu: any[];
          switch (role) {
            case "employee":
              menu = menuemployee;
              break;
              case "admin":
              menu = menuadmin;
              break;
            
            default:
              menu = [];
              break;
          }
          
        const navigator = useNavigate();
        return (
            menu.map((data, index) => (
                <ListItem key={data.text} disablePadding>
                    <ListItemButton onClick={()=>{navigator(data.path)}}>
                        <ListItemIcon>
                            {data.icon}
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            ))
        )
    }
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <MenuIcon  /> : <MenuIcon  />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {Listitemlink()}
                </List>
            </Drawer>
    )
}