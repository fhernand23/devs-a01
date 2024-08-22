import { User } from "./user";

export interface FileHistory {
  id: number;
  sourceFile: File | string;
  version: number;
  createDate: Date;
  updateDate?: Date;
  user: User;
}
