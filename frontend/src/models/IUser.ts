import { DepartmentInterface } from "./IDepartment";
export interface UserAuthenInterface {
    UserSerial: number,
    UserName: string,
    Password: string,
    UserPermission: number,
    DepID: number,
    Department: DepartmentInterface,
}
export interface UserInterface {
    UserNo: number,
    UserLname: string,
    UserAuthenId: number,
    UserAuthen: UserAuthenInterface,
}
export interface User1Interface {
    UserSerial: number;
    UserName: string;
    UserLname: string;
    DepName: string;
    DepMail: string;
    ManagerMail: string;  
}