import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate } from "react-router-dom";
import { ListItem, ListItemButton, ListItemIcon, IconButton, Divider, List, Drawer } from "@mui/material"; 
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReportIcon from '@mui/icons-material/Report';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ChecklistIcon from '@mui/icons-material/Checklist';
import MenuIcon from '@mui/icons-material/Menu';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
export default function DrawerBar({ role, drawerWidth, handleDrawerClose, open, theme}: any) {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),

        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));
    const Listitemlink = () => {
        var menu: any[] = [
            {"text": "รายงาน", "icon": <ReportIcon />, "link": "/reportProblemCreate"},
        ];
        if (role === "employee") {
            menu = [
                {"text": "รายงาน", "icon": <ReportIcon />, "link": "/reportProblemCreate"},
                { "icon": <FormatListNumberedIcon />,Name: "ข้อมูล",  "link": "/reportProblem"},
            ]
        } else if (role === "admin") {
            menu = [
                
                { "text": "ข้อมูลรอตรวจสอบ", "icon": <ErrorOutlineIcon />, "link": "/adminReportProblem"},
                { "text": "ทำการแก้ไข", "icon": <ChecklistIcon />, "link": "/adminReportComplete/:id"},

            ]
        } 
        const navigator = useNavigate();
        return (
            menu.map((data, index) => (
                <ListItem key={data.text} disablePadding>
                    <ListItemButton onClick={()=>{navigator(data.link)}}>
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