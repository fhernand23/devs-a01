export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  university: string;
  occupation?: string;
  country?: string;  
  password: string;
  role: string;
  deleteDate: Date;
}
