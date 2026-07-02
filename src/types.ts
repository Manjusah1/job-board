export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship'

export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  remote: boolean
  type: JobType
  experience: ExperienceLevel
  salaryMin: number
  salaryMax: number
  tags: string[]
  description: string
  postedAt: string
  featured?: boolean
}

export type SortBy = 'Newest' | 'Salary' | 'Match'
