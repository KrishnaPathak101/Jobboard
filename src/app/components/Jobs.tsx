'use client'
import React, { useEffect, useState } from 'react'
import JobRow from './JobRow'
import { clerkClient } from '@clerk/clerk-sdk-node';

interface Job {
  _id: string;
  title: string;
  description: string;
  organizationId: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]) 

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/organization');
        const data: Job[] = await response.json();
        console.log(data);
        setJobs(data)

      } catch (error) {
         console.error('error fetching jobs', error)
      }
    }

    fetchJobs()
  }, [0])
  

  return (
    <div className=' bg-gray-100 p-8 rounded-xl w-full'>
        <div className="container">
            <h2 className=' font-bold text-2xl'>Recent Jobs</h2>

             <div className=' flex mt-4 flex-col gap-4'>

            {jobs.map((job) => (
              <JobRow key={job._id} job={job} />
            ))}
            
            </div>
        </div>

        </div>
  )
}

export default Jobs
