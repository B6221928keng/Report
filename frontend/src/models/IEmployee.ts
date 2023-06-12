import { DepartmentInterface } from "./IDepartment";
import { UserInterface } from "./IUser";

export interface EmployeeInterface {
    ID: number,
    EmployeeName: string,
    Email: string,
    EmployeeID: number;
    UserID: number,
    User: UserInterface,

    DepartmentID: number,
    Department: DepartmentInterface,

}