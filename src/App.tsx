import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { calculateMatchScore, fetchJobs } from './services/jobService'
import type { Job, SortBy } from './types'

const CANDIDATE_SKILLS = [
  'React',
  'TypeScript',
  'Design Systems',
  'Testing',
]

function readLocalStorageArray(key: string): string[] {
  const value = window.localStorage.getItem(key)
  if (!value) {
    return []
  }

  try {
    return JSON.parse(value) as string[]
  } catch {
    return []
  }
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All')
  const [jobType, setJobType] = useState('All')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [minimumSalary, setMinimumSalary] = useState(0)
  const [sortBy, setSortBy] = useState<SortBy>('Newest')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const [savedJobs, setSavedJobs] = useState<string[]>(() =>
    readLocalStorageArray('savedJobs'),
  )
  const [appliedJobs, setAppliedJobs] = useState<string[]>(() =>
    readLocalStorageArray('appliedJobs'),
  )
  const [visibleCount, setVisibleCount] = useState(9)

  useEffect(() => {
    let isMounted = true

    fetchJobs()
      .then((result) => {
        if (!isMounted) {
          return
        }

        setJobs(result)
        setLoadError(null)
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setLoadError('Failed to load jobs. Please refresh and try again.')
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const locations = useMemo(() => {
    return ['All', ...new Set(jobs.map((item) => item.location))]
  }, [jobs])

  const types = useMemo(() => {
    return ['All', ...new Set(jobs.map((item) => item.type))]
  }, [jobs])

  const skills = useMemo(() => {
    return [...new Set(jobs.flatMap((item) => item.tags))].sort((a, b) =>
      a.localeCompare(b),
    )
  }, [jobs])

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const result = jobs
      .filter((item) => {
        if (location !== 'All' && item.location !== location) {
          return false
        }

        if (jobType !== 'All' && item.type !== jobType) {
          return false
        }

        if (remoteOnly && !item.remote) {
          return false
        }

        if (minimumSalary > item.salaryMax) {
          return false
        }

        if (selectedSkills.length > 0) {
          const includesAnySkill = selectedSkills.some((skill) =>
            item.tags.includes(skill),
          )

          if (!includesAnySkill) {
            return false
          }
        }

        if (!normalizedQuery) {
          return true
        }

        return [item.title, item.company, item.location, ...item.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      })
      .map((item) => ({
        ...item,
        matchScore: calculateMatchScore(item, CANDIDATE_SKILLS),
      }))

    if (sortBy === 'Salary') {
      result.sort((a, b) => b.salaryMax - a.salaryMax)
    }

    if (sortBy === 'Match') {
      result.sort((a, b) => b.matchScore - a.matchScore)
    }

    if (sortBy === 'Newest') {
      result.sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      )
    }

    return result
  }, [
    jobs,
    query,
    location,
    jobType,
    remoteOnly,
    minimumSalary,
    selectedSkills,
    sortBy,
  ])

  const visibleJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount)
  }, [filteredJobs, visibleCount])

  function formatSalary(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function toggleSavedJob(jobId: string): void {
    setSavedJobs((previous) => {
      const next = previous.includes(jobId)
        ? previous.filter((id) => id !== jobId)
        : [...previous, jobId]

      window.localStorage.setItem('savedJobs', JSON.stringify(next))
      return next
    })
  }

  function toggleAppliedJob(jobId: string): void {
    setAppliedJobs((previous) => {
      const next = previous.includes(jobId)
        ? previous.filter((id) => id !== jobId)
        : [...previous, jobId]

      window.localStorage.setItem('appliedJobs', JSON.stringify(next))
      return next
    })
  }

  function toggleSkill(skill: string): void {
    setSelectedSkills((previous) => {
      return previous.includes(skill)
        ? previous.filter((item) => item !== skill)
        : [...previous, skill]
    })
    setVisibleCount(9)
  }

  function clearFilters(): void {
    setQuery('')
    setLocation('All')
    setJobType('All')
    setRemoteOnly(false)
    setMinimumSalary(0)
    setSortBy('Newest')
    setSelectedSkills([])
    setVisibleCount(9)
  }

  function onFiltersChanged(): void {
    setVisibleCount(9)
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <p className="eyebrow">Career Radar</p>
        <h1>Find your next role with signal, not noise.</h1>
        <p className="hero-copy">
          Discover curated frontend and product roles, ranked by skill match and
          filtered in seconds.
        </p>
        <div className="hero-stats">
          <article>
            <h2>{jobs.length}</h2>
            <p>Total jobs</p>
          </article>
          <article>
            <h2>{savedJobs.length}</h2>
            <p>Saved</p>
          </article>
          <article>
            <h2>{appliedJobs.length}</h2>
            <p>Applied</p>
          </article>
        </div>
      </header>

      <section className="filters" aria-label="Job filters">
        <div className="field query-field">
          <label htmlFor="query">Search</label>
          <input
            id="query"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              onFiltersChanged()
            }}
            placeholder="React, Design Systems, Bengaluru"
          />
        </div>

        <div className="field compact-field">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value)
              onFiltersChanged()
            }}
          >
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field compact-field">
          <label htmlFor="job-type">Type</label>
          <select
            id="job-type"
            value={jobType}
            onChange={(event) => {
              setJobType(event.target.value)
              onFiltersChanged()
            }}
          >
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field compact-field">
          <label htmlFor="sort-by">Sort by</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value as SortBy)
            }}
          >
            <option value="Newest">Newest</option>
            <option value="Salary">Top salary</option>
            <option value="Match">Best match</option>
          </select>
        </div>

        <div className="field salary-field">
          <label htmlFor="salary">Minimum salary: {formatSalary(minimumSalary)}</label>
          <input
            id="salary"
            type="range"
            min={0}
            max={5000000}
            step={100000}
            value={minimumSalary}
            onChange={(event) => {
              setMinimumSalary(Number(event.target.value))
              onFiltersChanged()
            }}
          />
        </div>

        <label className="checkbox-field" htmlFor="remote-only">
          <input
            id="remote-only"
            type="checkbox"
            checked={remoteOnly}
            onChange={(event) => {
              setRemoteOnly(event.target.checked)
              onFiltersChanged()
            }}
          />
          Remote only
        </label>

        <button type="button" className="clear-btn" onClick={clearFilters}>
          Clear filters
        </button>
      </section>

      <section className="skills" aria-label="Skill chips">
        <p>Filter by skills:</p>
        <div className="skill-list">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              className={selectedSkills.includes(skill) ? 'skill active' : 'skill'}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </section>

      <section className="results-meta" aria-live="polite">
        <p>
          Showing <strong>{visibleJobs.length}</strong> of{' '}
          <strong>{filteredJobs.length}</strong> matched jobs.
        </p>
        <p>
          Candidate profile: <span>{CANDIDATE_SKILLS.join(' • ')}</span>
        </p>
      </section>

      {isLoading && <p className="message">Loading jobs...</p>}
      {loadError && <p className="message error">{loadError}</p>}

      {!isLoading && !loadError && (
        <section className="jobs" aria-label="Job listings">
          {visibleJobs.length === 0 ? (
            <article className="empty-state">
              <h3>No jobs match your filters.</h3>
              <p>Try reducing filters or clearing skill chips.</p>
            </article>
          ) : (
            visibleJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id)
              const isApplied = appliedJobs.includes(job.id)

              return (
                <article
                  className={job.featured ? 'job-card featured' : 'job-card'}
                  key={job.id}
                >
                  <div className="job-top">
                    <p className="company">{job.company}</p>
                    <span className="match">{job.matchScore}% AI match</span>
                  </div>
                  <h3>{job.title}</h3>
                  <p className="meta">
                    {job.location} • {job.type} • {job.experience}
                  </p>
                  <p className="salary">
                    {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                  </p>
                  <p className="description">{job.description}</p>

                  <div className="tags">
                    {job.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="actions">
                    <button type="button" onClick={() => toggleSavedJob(job.id)}>
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button
                      type="button"
                      className={isApplied ? 'applied' : 'apply'}
                      onClick={() => toggleAppliedJob(job.id)}
                    >
                      {isApplied ? 'Applied' : 'Quick apply'}
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </section>
      )}

      {!isLoading && visibleJobs.length < filteredJobs.length && (
        <div className="load-more-wrap">
          <button
            type="button"
            className="load-more"
            onClick={() => setVisibleCount((previous) => previous + 6)}
          >
            Load more jobs
          </button>
        </div>
      )}
    </div>
  )
}

export default App
