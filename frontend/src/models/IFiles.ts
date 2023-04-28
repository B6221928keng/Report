export interface Report {
    id: number;
    name: string;
    date: string;
    files: string[]; // array of file paths
}