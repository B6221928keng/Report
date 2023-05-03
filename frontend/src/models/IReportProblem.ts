import { DepartmentInterface } from "./IDepartment"
import { StatusInterface } from "./IStatus"
import { UserInterface } from "./IUser"

// import  {FileUploadtInterface} from "./IFiles"

export interface ReportProblemInterface {

    ID: number,
    Heading:         string,
	Description:     string,
    NotificationDate: Date | null,
    
    EmployeeID: number,
    Employee: UserInterface,

    StatusID: number,
    Status: StatusInterface

    DepartmentID: number,
	Department: DepartmentInterface

    // FileUploadID: number,
    // FileUpload: FileUploadtInterface

}
export interface ReportProblem1Interface{
    id?: number;
    EmployeeName?: number;
	NotificationDate?:    Date | null;
    Heading?: string;
    Description?: string;
    Status?: string;
    DepartmentName?: number;
}
export interface ReportProblem2Interface{
    id?: number;
    EmployeeName?: number;
	NotificationDate?:    Date | null;
    Heading?: string;
    Description?: string;
    Status?: string;
    DepartmentName?: number;
}
export interface ReportProblem3Interface{
    id?: number;
    EmployeeName?: number;
	NotificationDate?:    Date | null;
    Heading?: string;
    Description?: string;
    Status?: string;
    DepartmentName?: number;
}