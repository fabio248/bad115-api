import { faker } from '@faker-js/faker';
import { CandidateFilterByRangeDateDto } from '../dtos/request/candidate-filter-by-range-date.dto';
import { JobAplicationEnum } from '../../job-application/enums/job-aplication.enum';

export interface CandidateFilterByRangeDateMockData {
  email: string;
  userId: string;
  personId: string;
  candidateId: string;
  jobAppId: string;
  jobPosId: string;
  firstName: string;
  lastName: string;
  jobPosName: string;
  startDate: Date;
  endDate: Date;
  mockUser: any;
  mockCandidate: any;
  mockDto: CandidateFilterByRangeDateDto;
}

export const generateMockData = (): CandidateFilterByRangeDateMockData => {
  const email = faker.internet.email();
  const userId = faker.string.uuid();
  const personId = faker.string.uuid();
  const candidateId = faker.string.uuid();
  const jobAppId = faker.string.uuid();
  const jobPosId = faker.string.uuid();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const jobPosName = faker.person.jobTitle();
  const startDate = faker.date.between({
    from: '2025-01-01T00:00:00.000Z',
    to: '2025-01-10T00:00:00.000Z',
  });
  const endDate = faker.date.between({
    from: '2025-01-11T00:00:00.000Z',
    to: '2025-01-31T00:00:00.000Z',
  });

  const mockUser = {
    id: userId,
    email,
    person: {
      id: personId,
      candidateId,
    },
  };

  const mockCandidate = {
    id: candidateId,
    person: {
      id: personId,
      firstName,
      lastName,
    },
    jobApplications: [
      {
        id: jobAppId,
        status: JobAplicationEnum.En_proceso,
        createdAt: startDate,
        jobPosition: {
          id: jobPosId,
          name: jobPosName,
        },
      },
    ],
  };

  const mockDto: CandidateFilterByRangeDateDto = {
    email,
    startDate,
    endDate,
  };

  return {
    email,
    userId,
    personId,
    candidateId,
    jobAppId,
    jobPosId,
    firstName,
    lastName,
    jobPosName,
    startDate,
    endDate,
    mockUser,
    mockCandidate,
    mockDto,
  };
};

export const generateUserWithoutCandidate = (
  email: string,
  userId: string,
  personId: string,
) => ({
  id: userId,
  email,
  person: {
    id: personId,
    candidateId: null,
  },
});

export const generateDtoWithStartDate = (email: string) => {
  const startDate = faker.date.between({
    from: '2025-01-01T00:00:00.000Z',
    to: '2025-01-10T00:00:00.000Z',
  });

  return {
    email,
    startDate,
  } as CandidateFilterByRangeDateDto;
};

export const generateDtoWithEndDate = (email: string) => {
  const endDate = faker.date.between({
    from: '2025-01-11T00:00:00.000Z',
    to: '2025-01-31T00:00:00.000Z',
  });

  return {
    email,
    endDate,
  } as CandidateFilterByRangeDateDto;
};

export const generateDtoWithoutDates = (email: string) =>
  ({
    email,
  }) as CandidateFilterByRangeDateDto;
