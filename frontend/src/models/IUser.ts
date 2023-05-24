import { DepartmentInterface } from "./IDepartment";
import { RoleInterface } from "./IRole";

export interface UserInterface {
    EmployeeName: any;

    ID: number,
    Name: string,
    UserName: string,
    Password: string,

    RoleID: number,
    Role: RoleInterface,

    DepartmentID: number,
    Department: DepartmentInterface,
}