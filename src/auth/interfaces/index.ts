export interface IPayload {
  userId: string;
  candidateId?: string;
  recruiterId?: string;
  personId?: string;
  companyId?: string;
  email: string;
  roles: string[];
  permissions: string[];
}
