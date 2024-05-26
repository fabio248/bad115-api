export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CvDataTemplate {
  profilePicture: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  technicalSkills: { name: string; category: string }[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
  recognitions: string[];
  languageSkills: { language: string; level: string }[];
  participations: string[];
}
