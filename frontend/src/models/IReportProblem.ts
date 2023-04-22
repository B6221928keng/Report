import { DepartmentInterface } from "./IDepartment"
import { StatusInterface } from "./IStatus"
import { UserInterface } from "./IUser"
import  {FileUploadtInterface} from "./IFileUpload"

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

    FileUploadID: number,
    FileUpload: FileUploadtInterface

}