import { DepartmentInterface } from "./IDepartment";
import { UserInterface } from "./IUser";

export interface AdminInterface {

    ID: number,
    AdminName: string,
    Email: string,
    
    UserID: number,
    User: UserInterface,

    DepartmentID: number,
    Department: DepartmentInterface,

}