'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';

// Define the types for the Job and Organization
interface Job {
  organizationId: string;
  title: string;
}

interface Organization {
  name: string;
  imageUrl: string;
}

interface JobRowProps {
  job: Job;
  key: string;
}

const JobRow: React.FC<JobRowProps> = ({key, job }) => {
  const [organization, setOrganization] = useState<Organization | null>(null); // State for organization
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch organization data when the component mounts or job.organizationId changes
// Added dependency on job.organizationId to refetch when it changes

  // Display loading, error or the actual data


  return (
    
    <Link href={`/jobPage/${job._id}`} className="flex gap-4 bg-white shadow-sm rounded-md p-4">
      <div className="content-center">
        {/* Fallback for missing organization image */}
        <img
          className="w-10 h-10 rounded-full"
          src={organization?.imageUrl || 'default-image.jpg'} // Fallback image
          alt="Organization Logo"
        />
      </div>
      <div className="grow">
        <div>{job.organizationId || 'Unknown Organization'}</div> {/* Display organization name */}
        <div className="font-bold">{job.title}</div>
        <div>Remote | United States</div>
      </div>
      <div className="content-end text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        2 weeks ago
      </div>
    </Link>
  );
};

export default JobRow;
