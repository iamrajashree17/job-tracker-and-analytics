import { listJobs, addJob, getJob, deleteJob, updateJob } from '@/lib/job.service'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    job: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

const mockFindMany = prisma.job.findMany as jest.MockedFunction<typeof prisma.job.findMany>
const mockFindUnique = prisma.job.findUnique as jest.MockedFunction<typeof prisma.job.findUnique>
const mockCreate = prisma.job.create as jest.MockedFunction<typeof prisma.job.create>
const mockUpdate = prisma.job.update as jest.MockedFunction<typeof prisma.job.update>

const makeJob = (overrides = {}) => ({
  id: 'job-1',
  company: 'Acme',
  role: 'Engineer',
  status: 'applied',
  appliedAt: new Date('2024-01-15T00:00:00.000Z'),
  jobUrl: null,
  notes: null,
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-1',
  ...overrides,
})

beforeEach(() => jest.clearAllMocks())

describe('listJobs', () => {
  it('returns jobs for the given user', async () => {
    const jobs = [makeJob({ id: 'a' }), makeJob({ id: 'b' })]
    mockFindMany.mockResolvedValue(jobs as any)

    const result = await listJobs('user-1')

    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ userId: 'user-1', isDeleted: false }),
    }))
    expect(result).toHaveLength(2)
  })

  it('passes status filter to prisma', async () => {
    mockFindMany.mockResolvedValue([makeJob()] as any)

    await listJobs('user-1', 'applied')

    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ status: 'applied' }),
    }))
  })

  it('passes date range filters to prisma', async () => {
    mockFindMany.mockResolvedValue([] as any)

    await listJobs('user-1', undefined, '2024-01-15', '2024-01-20')

    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ appliedAt: expect.any(Object) }),
    }))
  })
})

describe('addJob', () => {
  it('calls prisma.job.create with correct data', async () => {
    mockCreate.mockResolvedValue(makeJob() as any)

    await addJob('user-1', { company: 'Acme', role: 'Engineer', status: 'applied' })

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ company: 'Acme', userId: 'user-1' }),
    }))
  })
})

describe('getJob', () => {
  it('returns the matching job for the owner', async () => {
    mockFindUnique.mockResolvedValue(makeJob() as any)

    const job = await getJob('job-1', 'user-1')

    expect(job.id).toBe('job-1')
  })

  it('throws when job does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)

    await expect(getJob('missing', 'user-1')).rejects.toThrow('Job not found.')
  })

  it('throws when job belongs to a different user', async () => {
    mockFindUnique.mockResolvedValue(makeJob({ userId: 'user-1' }) as any)

    await expect(getJob('job-1', 'other-user')).rejects.toThrow('Job not found.')
  })
})

describe('deleteJob', () => {
  it('sets isDeleted to true via prisma update', async () => {
    mockFindUnique.mockResolvedValue(makeJob() as any)
    mockUpdate.mockResolvedValue(makeJob({ isDeleted: true }) as any)

    await deleteJob('job-1', 'user-1')

    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'job-1' },
      data: { isDeleted: true },
    }))
  })

  it('throws when job does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)

    await expect(deleteJob('missing', 'user-1')).rejects.toThrow('Job not found.')
  })
})

describe('updateJob', () => {
  it('merges updates via prisma update', async () => {
    mockFindUnique.mockResolvedValue(makeJob() as any)
    mockUpdate.mockResolvedValue(makeJob({ role: 'Senior Engineer' }) as any)

    await updateJob('job-1', 'user-1', { role: 'Senior Engineer', status: 'interview' })

    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'job-1' },
      data: expect.objectContaining({ role: 'Senior Engineer', status: 'interview' }),
    }))
  })

  it('throws when job does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)

    await expect(updateJob('missing', 'user-1', {})).rejects.toThrow('Job not found.')
  })
})
