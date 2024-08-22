import { Tag } from "./tag";
import { VersionableFile } from "./versionableFile";

export interface Model extends VersionableFile {
  tags: Tag[];
  favorite?: boolean;
}
