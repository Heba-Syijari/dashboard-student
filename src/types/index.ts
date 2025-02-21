export type TableRows = {
  id: string;
  city: string;
  grade: string;
  gradeId: string;
  phone: string;
  gender: string;
  genderId: string;
  country: string;
  remarks: string;
  lastName: string;
  firstName: string;
  birthDate: string;
};

export type Student = {
  id: string;
  city: string;
  grade: Grade;
  phone: string;
  gender: Gender;
  country: string;
  remarks: string;
  lastName: string;
  firstName: string;
  birthDate: string;
};

export type Gender = {
  id: string;
  translations: Translation[];
};

export type Grade = {
  id: string;
  translations: Translation[];
};

type Translation = {
  name: string;
  cultureCode: 0 | 1;
};

export type AddStudentEvent = {
  city: string;
  grade: string;
  phone: string;
  gender: string;
  country: string;
  remarks?: string;
  lastName: string;
  firstName: string;
  birthDate: string;
};

export type EditStudentEvent = {
  id: string;
  city: string;
  grade: string;
  phone: string;
  gender: string;
  country: string;
  remarks?: string;
  lastName: string;
  firstName: string;
  birthDate: string;
};
export type UserData = {
  userName: string;
  token: string;
};
