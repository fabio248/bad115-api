import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CalidadExerciseService } from './calidad-exercise.service';
import { PrismaService } from 'nestjs-prisma';
import { I18nService } from 'nestjs-i18n';
import { createMockContext, MockContext } from '../common/mocks/prisma.mock';
import {
  generateMockData,
  generateUserWithoutCandidate,
  generateDtoWithStartDate,
  generateDtoWithEndDate,
  generateDtoWithoutDates,
  CandidateFilterByRangeDateMockData,
} from './mocks/calidad-exercise.mock';

describe('CalidadExerciseService', () => {
  let service: CalidadExerciseService;
  let mockPrismaService: any;
  let mockI18nService: jest.Mocked<I18nService>;
  let mockContext: MockContext;

  beforeEach(async () => {
    mockContext = createMockContext();
    mockPrismaService = mockContext.prisma;
    mockI18nService = {
      t: jest.fn(),
    } as unknown as jest.Mocked<I18nService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalidadExerciseService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<CalidadExerciseService>(CalidadExerciseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('filterByRangeDate', () => {
    let mockData: CandidateFilterByRangeDateMockData;

    beforeEach(() => {
      mockData = generateMockData();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockI18nService.t
        .mockReturnValueOnce('CANDIDATE')
        .mockReturnValueOnce('Candidato no encontrado');

      await expect(service.filterByRangeDate(mockData.mockDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockData.mockDto.email },
        include: { person: true },
      });
      expect(mockI18nService.t).toHaveBeenNthCalledWith(
        1,
        'entities.CANDIDATE',
      );
      expect(mockI18nService.t).toHaveBeenNthCalledWith(
        2,
        'exception.NOT_FOUND.DEFAULT',
        { args: { entity: 'CANDIDATE' } },
      );
    });

    it('should return candidate with job applications filtered by date range', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockData.mockUser);
      mockPrismaService.candidate.findFirst.mockResolvedValue(
        mockData.mockCandidate,
      );

      const result = await service.filterByRangeDate(mockData.mockDto);

      expect(result).toEqual(mockData.mockCandidate);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockData.mockDto.email },
        include: { person: true },
      });
      expect(mockPrismaService.candidate.findFirst).toHaveBeenCalledWith({
        where: { id: mockData.mockUser.person.candidateId, deletedAt: null },
        include: {
          person: true,
          jobApplications: {
            where: {
              createdAt: {
                gte: mockData.mockDto.startDate,
                lte: mockData.mockDto.endDate,
              },
            },
            include: { jobPosition: true },
          },
        },
      });
    });

    it('should return candidate with job applications when no date range is provided', async () => {
      const dtoWithoutDates = generateDtoWithoutDates(mockData.email);
      mockPrismaService.user.findFirst.mockResolvedValue(mockData.mockUser);
      mockPrismaService.candidate.findFirst.mockResolvedValue(
        mockData.mockCandidate,
      );

      const result = await service.filterByRangeDate(dtoWithoutDates);

      expect(result).toEqual(mockData.mockCandidate);
      expect(mockPrismaService.candidate.findFirst).toHaveBeenCalledWith({
        where: { id: mockData.mockUser.person.candidateId, deletedAt: null },
        include: {
          person: true,
          jobApplications: {
            where: {
              createdAt: {
                gte: undefined,
                lte: undefined,
              },
            },
            include: { jobPosition: true },
          },
        },
      });
    });

    it('should return candidate with job applications when only startDate is provided', async () => {
      const dtoWithStartDate = generateDtoWithStartDate(mockData.email);
      mockPrismaService.user.findFirst.mockResolvedValue(mockData.mockUser);
      mockPrismaService.candidate.findFirst.mockResolvedValue(
        mockData.mockCandidate,
      );

      const result = await service.filterByRangeDate(dtoWithStartDate);

      expect(result).toEqual(mockData.mockCandidate);
      expect(mockPrismaService.candidate.findFirst).toHaveBeenCalledWith({
        where: { id: mockData.mockUser.person.candidateId, deletedAt: null },
        include: {
          person: true,
          jobApplications: {
            where: {
              createdAt: {
                gte: dtoWithStartDate.startDate,
                lte: undefined,
              },
            },
            include: { jobPosition: true },
          },
        },
      });
    });

    it('should return candidate with job applications when only endDate is provided', async () => {
      const dtoWithEndDate = generateDtoWithEndDate(mockData.email);
      mockPrismaService.user.findFirst.mockResolvedValue(mockData.mockUser);
      mockPrismaService.candidate.findFirst.mockResolvedValue(
        mockData.mockCandidate,
      );

      const result = await service.filterByRangeDate(dtoWithEndDate);

      expect(result).toEqual(mockData.mockCandidate);
      expect(mockPrismaService.candidate.findFirst).toHaveBeenCalledWith({
        where: { id: mockData.mockUser.person.candidateId, deletedAt: null },
        include: {
          person: true,
          jobApplications: {
            where: {
              createdAt: {
                gte: undefined,
                lte: dtoWithEndDate.endDate,
              },
            },
            include: { jobPosition: true },
          },
        },
      });
    });

    it('should return null when candidate is not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockData.mockUser);
      mockPrismaService.candidate.findFirst.mockResolvedValue(null);

      const result = await service.filterByRangeDate(mockData.mockDto);

      expect(result).toBeNull();
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockData.mockDto.email },
        include: { person: true },
      });
      expect(mockPrismaService.candidate.findFirst).toHaveBeenCalledWith({
        where: { id: mockData.mockUser.person.candidateId, deletedAt: null },
        include: {
          person: true,
          jobApplications: {
            where: {
              createdAt: {
                gte: mockData.mockDto.startDate,
                lte: mockData.mockDto.endDate,
              },
            },
            include: { jobPosition: true },
          },
        },
      });
    });

    it('should handle case when user exists but has no candidateId', async () => {
      const userWithoutCandidate = generateUserWithoutCandidate(
        mockData.email,
        mockData.userId,
        mockData.personId,
      );
      mockPrismaService.user.findFirst.mockResolvedValue(userWithoutCandidate);
      mockPrismaService.candidate.findFirst.mockResolvedValue(null);

      const result = await service.filterByRangeDate(mockData.mockDto);

      expect(result).toBeNull();
      expect(mockPrismaService.candidate.findFirst).toHaveBeenCalledWith({
        where: { id: null, deletedAt: null },
        include: {
          person: true,
          jobApplications: {
            where: {
              createdAt: {
                gte: mockData.mockDto.startDate,
                lte: mockData.mockDto.endDate,
              },
            },
            include: { jobPosition: true },
          },
        },
      });
    });
  });
});
