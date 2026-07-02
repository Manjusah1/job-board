import { jobs } from '../data/jobs'
import type { Job } from '../types'

const NETWORK_DELAY_MS = 550

export async function fetchJobs(): Promise<Job[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(jobs)
    }, NETWORK_DELAY_MS)
  })
}

export function calculateMatchScore(job: Job, candidateSkills: string[]): number {
  if (candidateSkills.length === 0) {
    return 50
  }

  const normalizedCandidate = candidateSkills.map((skill) => skill.toLowerCase())
  const matched = job.tags.filter((tag) =>
    normalizedCandidate.includes(tag.toLowerCase()),
  ).length

  const ratio = matched / Math.max(job.tags.length, 1)
  return Math.min(99, Math.max(35, Math.round(ratio * 100)))
}
