import { listJobs, addJob, getJob, deleteJob, updateJob } from '@/lib/job.service'
import * as fileDb from '@/lib/fileDb'

jest.mock('@/lib/fileDb')

const mockReadJobs = fileDb.readJobs as jest.MockedFunction<typeof fileDb.readJobs>
const mockWriteJobs = fileDb.writeJobs as jest.MockedFunction<typeof fileDb.writeJobs>

const makeJob = (overrides = {}) => ({
  id: 'job-1',
  company: 'Acme',
  role: 'Engineer',
  status: 'applied',
  appliedAt: '2024-01-15T00:00:00.000Z',
  isDeleted: false,
  ...overrides,
})

beforeEach(() => {
  jest.clearAllMocks()
  mockWriteJobs.mockImplementation(() => {})
})

describe('listJobs', () => {
  it('returns all jobs when no filters are given', () => {
    const jobs = [makeJob({ id: 'a' }), makeJob({ id: 'b' })]
    mockReadJobs.mockReturnValue(jobs)

    const result = listJobs()

    expect(result).toHaveLength(2)
  })

  it('filters by status', () => {
    const jobs = [makeJob({ status: 'applied' }), makeJob({ id: 'b', status: 'rejected' })]
    mockReadJobs.mockReturnValue(jobs)

    const result = listJobs('applied')

    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('applied')
  })

  it('filters by fromDate (inclusive)', () => {
    const jobs = [
      makeJob({ id: 'a', appliedAt: '2024-01-10T00:00:00.000Z' }),
      makeJob({ id: 'b', appliedAt: '2024-01-20T00:00:00.000Z' }),
    ]
    mockReadJobs.mockReturnValue(jobs)

    const result = listJobs(undefined, '2024-01-15')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('b')
  })

  it('filters by toDate (inclusive up to end of day)', () => {
    const jobs = [
      makeJob({ id: 'a', appliedAt: '2024-01-10T00:00:00.000Z' }),
      makeJob({ id: 'b', appliedAt: '2024-01-20T00:00:00.000Z' }),
    ]
    mockReadJobs.mockReturnValue(jobs)

    const result = listJobs(undefined, undefined, '2024-01-15')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('sorts by appliedAt descending', () => {
    const jobs = [
      makeJob({ id: 'old', appliedAt: '2024-01-01T00:00:00.000Z' }),
      makeJob({ id: 'new', appliedAt: '2024-06-01T00:00:00.000Z' }),
    ]
    mockReadJobs.mockReturnValue(jobs)

    const result = listJobs()

    expect(result[0].id).toBe('new')
    expect(result[1].id).toBe('old')
  })

  it('puts jobs without appliedAt at the end', () => {
    const jobs = [makeJob({ id: 'no-date', appliedAt: undefined }), makeJob({ id: 'has-date' })]
    mockReadJobs.mockReturnValue(jobs)

    const result = listJobs()

    expect(result[result.length - 1].id).toBe('no-date')
  })
})

describe('addJob', () => {
  it('assigns an id and isDeleted=false then persists', () => {
    mockReadJobs.mockReturnValue([])

    const job: any = { company: 'Acme', role: 'Engineer' }
    addJob(job)

    expect(typeof job.id).toBe('string')
    expect(job.isDeleted).toBe(false)
    expect(mockWriteJobs).toHaveBeenCalledTimes(1)
    const saved = mockWriteJobs.mock.calls[0][0]
    expect(saved).toHaveLength(1)
    expect(saved[0].company).toBe('Acme')
  })
})

describe('getJob', () => {
  it('returns the matching job', () => {
    mockReadJobs.mockReturnValue([makeJob()])

    const job = getJob('job-1')

    expect(job.id).toBe('job-1')
  })

  it('throws when the job does not exist', () => {
    mockReadJobs.mockReturnValue([])

    expect(() => getJob('missing')).toThrow('Job with ID missing not found.')
  })
})

describe('deleteJob', () => {
  it('sets isDeleted to true and persists', () => {
    mockReadJobs.mockReturnValue([makeJob()])

    deleteJob('job-1')

    const saved = mockWriteJobs.mock.calls[0][0]
    expect(saved[0].isDeleted).toBe(true)
  })

  it('throws when the job does not exist', () => {
    mockReadJobs.mockReturnValue([])

    expect(() => deleteJob('missing')).toThrow('Job with ID missing not found.')
  })
})

describe('updateJob', () => {
  it('merges updates and persists', () => {
    mockReadJobs.mockReturnValue([makeJob()])

    updateJob('job-1', { role: 'Senior Engineer', status: 'interviewing' })

    const saved = mockWriteJobs.mock.calls[0][0]
    expect(saved[0].role).toBe('Senior Engineer')
    expect(saved[0].status).toBe('interviewing')
    expect(saved[0].company).toBe('Acme')
  })

  it('throws when the job does not exist', () => {
    mockReadJobs.mockReturnValue([])

    expect(() => updateJob('missing', {})).toThrow('Job with ID missing not found.')
  })
})
