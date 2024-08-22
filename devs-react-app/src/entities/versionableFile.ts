import { FileHistory } from "./fileHistory";

export interface VersionableFile {
  id: number;
  name: string;
  sourceFile: File | string;
  version?: number;
  based?: number;
  createDate: Date;
  deleteDate?: Date;
  updateDate: Date | null;
  favorite?: boolean;
  history: FileHistory[];
  description: string;
  username: string;
}
