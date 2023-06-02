import { DepartmentInterface } from "./IDepartment"
import { FileUploadInterface } from "./IFileUpload"
import { StatusInterface } from "./IStatus"
import { UserInterface } from "./IUser"
import { AdminInterface } from "./IAdmin"
export interface ReportProblemInterface {

    ID: number,
    Heading:         string,
	Description:     string,
    NotificationDate: Date | null,
    PendingDate:  Date | null, //ค่าเวลาตรวจงาน
    CompleteDate:  Date | null, //ค่าเวลาทำงาน
    EndDate:  Date | null, //ค่าเวลาเสร็จงาน
    EmployeeID: number,
    Employee: UserInterface,

    AdminID: number,
    Admin: UserInterface,

    StatusID: number,
    Status: StatusInterface

    DepartmentID: number,
	Department: DepartmentInterface

    FileUploadID: number,
    FileUpload: FileUploadInterface,

}
export interface ReportProblem1Interface {
    id?: number;
    EmpEmail: string;
    AdminEmail: string;
    EmployeeName?: number;
    NotificationDate?: Date | null;
    PendingDate:  Date | null, //ค่าเวลาตรวจงาน
    CompleteDate:  Date | null, //ค่าเวลาทำงาน
    EndDate:  Date | null, //ค่าเวลาเสร็จงาน
    Heading?: string;
    Description?: string;
    Status?: string;
    DepartmentName?: number;
    name: File;
    FileUploadID: number,
    FileUpload: FileUploadInterface,
}
export interface ReportProblem2Interface{
    id?: number;
    EmpEmail: string;
    AdminEmail: string;
    EmployeeName?: number;
	NotificationDate?:    Date | null;
    PendingDate:  Date | null, //ค่าเวลาตรวจงาน
    CompleteDate:  Date | null, //ค่าเวลาทำงาน
    EndDate:  Date | null, //ค่าเวลาเสร็จงาน
    Heading?: string;
    Description?: string;
    Status?: string;
    DepartmentName?: number;
    
    FileUploadID: number,
    FileUpload: FileUploadInterface,
}
export interface ReportProblem3Interface{
    ID: number;
    id: number;
    EmpEmail: string;
    AdminEmail: string;
    EmployeeName?: number;
	NotificationDate?:    Date | null;
    PendingDate:  Date | null, //ค่าเวลาตรวจงาน
    CompleteDate:  Date | null, //ค่าเวลาทำงาน
    EndDate:  Date | null, //ค่าเวลาเสร็จงาน
    Heading?: string;
    Description?: string;
    
    DepartmentName?: number;
    EmployeeID: number,
    Employee: UserInterface,

    StatusID: number,
    Status: StatusInterface

    DepartmentID: number,
	Department: DepartmentInterface

    FileUploadID: number,
    FileUpload: FileUploadInterface,
}
