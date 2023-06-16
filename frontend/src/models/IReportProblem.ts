import { DepartmentInterface } from "./IDepartment"
import { FileUploadInterface } from "./IFileUpload"
import { StatusInterface } from "./IStatus"
import { UserAuthenInterface, UserInterface } from "./IUser"
export interface ReportProblemInterface {
    ID: number,
    Heading: string,
    Description: string,
    NotificationDate: Date | null,
    PendingDate: Date | null, //ค่าเวลาตรวจงาน
    CompleteDate: Date | null, //ค่าเวลาทำงาน
    EndDate: Date | null, //ค่าเวลาเสร็จงาน

    UserSerial: number,
    UserAuthen: UserAuthenInterface,
  
    AdminID: number,
    Admin: UserAuthenInterface,

    StID: number,
    Status: StatusInterface

    DepID: number,
    Department: DepartmentInterface

    FileUploadID: number,
    FileUpload: FileUploadInterface,
}
export interface ReportPrInterface {

    ID: number,
    Heading: string,
    Description: string,
    NotificationDate: Date | null,
    PendingDate: Date | null, //ค่าเวลาตรวจงาน
    CompleteDate: Date | null, //ค่าเวลาทำงาน
    EndDate: Date | null, //ค่าเวลาเสร็จงาน

    UserSerial: number,
    UserName: string,
    UserLname: string,
    AdminID: number,

    StID: number,
    StatusName: string,

    DepID: number,
    DepName: string,

    FileUploadID: number,
    Name: string,
    Size: number,
    Type: string,
  

}
export interface ReportProblem1Interface {
    id?: number;
    EmpEmail: string;
    AdminEmail: string;
    EmployeeName?: number;
    NotificationDate?: Date | null;
    PendingDate: Date | null, //ค่าเวลาตรวจงาน
    CompleteDate: Date | null, //ค่าเวลาทำงาน
    EndDate: Date | null, //ค่าเวลาเสร็จงาน
    Heading?: string;
    Description?: string;
    Status?: string;
    DepartmentName?: number;
    name: File;
    FileUploadID: number,
    FileUpload: FileUploadInterface,
}
export interface ReportProblem2Interface {
    ID: number,
    Heading: string,
    Description: string,
    NotificationDate: Date | null,
    PendingDate: Date | null, //ค่าเวลาตรวจงาน
    CompleteDate: Date | null, //ค่าเวลาทำงาน
    EndDate: Date | null, //ค่าเวลาเสร็จงาน

    UserSerial: number,
    UserName: string,
    UserLname: string,
    AdminID: number,

    StID: number,
    StatusName: string,

    DepID: number,
    DepName: string,

    FileUploadID: number,
    Name: string,
    Size: number,
    Type: string,
}
export interface ReportProblem3Interface {
    ID: number;
    id: number;
    EmpEmail: string;
    AdminEmail: string;
    EmployeeName?: number;
    NotificationDate?: Date | null;
    PendingDate: Date | null, //ค่าเวลาตรวจงาน
    CompleteDate: Date | null, //ค่าเวลาทำงาน
    EndDate: Date | null, //ค่าเวลาเสร็จงาน
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
