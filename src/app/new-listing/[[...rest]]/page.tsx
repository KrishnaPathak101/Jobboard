'use client'
import { useOrganizationList, useUser } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'

// Parameters for organization listing
export const userMembershipsParams = {
  memberships: { pageSize: 5, keepPreviousData: true },
}

interface Organization {
  id: string;
  name: string;
}

interface UserMembership {
  id: string;
  organization: Organization;
  publicUserData: { identifier: string };
  createdAt: Date;
  role: string;
}

const JobPostPage: React.FC = () => {
  const { user } = useUser()
  const { isLoaded, userMemberships, createOrganization } = useOrganizationList({
    userMemberships: userMembershipsParams,
  })

  const [organizationName, setOrganizationName] = useState<string>('')
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [jobTitle, setJobTitle] = useState<string>('')
  const [jobDescription, setJobDescription] = useState<string>('')
  const [jobLocation, setJobLocation] = useState<string>('')
  const [jobType, setJobType] = useState<string>('')
  const [salary, setSalary] = useState<string>('')
  const [isPostingJob, setIsPostingJob] = useState<boolean>(false)
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null) // Clear errors on input change
  }, [jobTitle, jobDescription, jobLocation, jobType, salary])

  // Fetch location suggestions (mock API call)
  const fetchLocationSuggestions = async (query: string) => {
    if (query.length > 1) {
      const response = await fetch(`/api/locations?query=${query}`)
      const data = await response.json()
      setLocationSuggestions(data.suggestions || [])
    } else {
      setLocationSuggestions([])
    }
  }

  const handleCreateOrganization = async () => {
    if (organizationName.trim()) {
      try {
        await createOrganization({ name: organizationName })
        setOrganizationName('')
      } catch {
        setError('Failed to create organization.')
      }
    }
  }

  const handleOrganizationClick = (organization: Organization) => {
    setSelectedOrganization(organization)
    setShowModal(true)
  }

  const handlePostJob = async () => {
    // Basic validation for required fields
    if (!jobTitle || !jobDescription || !jobLocation || !jobType || !salary) {
      setError('All fields are required.');
      return;
    }
  
    const jobData = {
      title: jobTitle,
      description: jobDescription,
      location: jobLocation,
      type: jobType,
      salary,
      organizationName: selectedOrganization?.name,
      poster: {
        name: user?.fullName || 'Anonymous',
        email: user?.emailAddresses?.[0]?.emailAddress || 'No email',
      },
    };
  
    setIsPostingJob(true);
    setError(null);  // Clear any previous error before posting
  
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        if (response.status === 400) {
          throw new Error(errorDetails.message || 'Please check the job details.');
        } else if (response.status === 404) {
          throw new Error('The server could not find the requested resource.');
        } else if (response.status === 500) {
          throw new Error('Something went wrong on the server.');
        } else {
          throw new Error(errorDetails.message || 'Unexpected error. Please try again later.');
        }
      }

      // Successful job posting
      console.log('Job posted successfully');
      setShowModal(false);
      resetJobForm();  // Reset job form upon success
    } catch (error: any) {
      // Error handling with detailed messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
      setError(errorMessage);
      alert(`Job Posting Failed: ${errorMessage}`);
    } finally {
      setIsPostingJob(false);
    }
  };

  // Helper function to reset the form fields
  const resetJobForm = () => {
    setJobTitle('');
    setJobDescription('');
    setJobLocation('');
    setJobType('');
    setSalary('');
    setError(null); // Clear any error messages
    setLocationSuggestions([]); // Clear location suggestions
  };
  if (!isLoaded) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-center bg-gray-50 p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Manage Job Postings</h1>

      {userMemberships?.data?.length === 0 ? (
        <div className="text-center text-gray-700 mb-8">
          <p>You are not part of any organization yet.</p>
          <CreateOrganizationForm
            organizationName={organizationName}
            onNameChange={setOrganizationName}
            onCreate={handleCreateOrganization}
          />
        </div>
      ) : (
        <OrganizationTable memberships={userMemberships.data} onOrganizationClick={handleOrganizationClick} />
      )}

      {/* Allow new organization creation if fewer than 5 */}
      {userMemberships?.data?.length < 5 && (
        <CreateOrganizationForm
          organizationName={organizationName}
          onNameChange={setOrganizationName}
          onCreate={handleCreateOrganization}
        />
      )}

      {/* Job Posting Modal */}
      {showModal && selectedOrganization && (
        <JobPostModal
          organizationName={selectedOrganization.name}
          jobTitle={jobTitle}
          jobDescription={jobDescription}
          jobLocation={jobLocation}
          jobType={jobType}
          salary={salary}
          locationSuggestions={locationSuggestions}
          error={error}
          onClose={() => setShowModal(false)}
          onTitleChange={setJobTitle}
          onDescriptionChange={setJobDescription}
          onLocationChange={(loc) => {
            setJobLocation(loc)
            fetchLocationSuggestions(loc)
          }}
          onTypeChange={setJobType}
          onSalaryChange={setSalary}
          onNameChange={user?.fullName || ''}
          onEmailChange={user?.emailAddresses?.[0]?.emailAddress || ''}
          onSubmit={handlePostJob}
          isSubmitting={isPostingJob}
        />
      )}
    </div>
  )
}

// Organization Table Component
const OrganizationTable: React.FC<{
  memberships: UserMembership[];
  onOrganizationClick: (organization: Organization) => void;
}> = ({ memberships, onOrganizationClick }) => (
  <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
    <table className="min-w-full bg-white">
      <thead>
        <tr className="text-left bg-gray-100">
          <th className="py-3 px-6 font-semibold text-gray-700">Organization</th>
          <th className="py-3 px-6 font-semibold text-gray-700">Role</th>
          <th className="py-3 px-6 font-semibold text-gray-700">Joined</th>
        </tr>
      </thead>
      <tbody>
        {memberships.map((membership) => (
          <tr
            key={membership.id}
            onClick={() => onOrganizationClick(membership.organization)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            <td className="py-3 px-6">{membership.organization.name}</td>
            <td className="py-3 px-6">{membership.role}</td>
            <td className="py-3 px-6">{new Date(membership.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// Modal Component for Job Posting
const JobPostModal: React.FC<{
  organizationName: string;
  jobTitle: string;
  jobDescription: string;
  jobLocation: string;
  jobType: string;
  salary: string;
  locationSuggestions: string[];
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSalaryChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  posterName: string;
  posterEmail: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}> = ({
  organizationName, jobTitle, jobDescription, jobLocation, jobType, salary,
  locationSuggestions, onClose, onTitleChange, onDescriptionChange, 
  onLocationChange, onTypeChange, onSalaryChange, onSubmit, 
  isSubmitting, error, posterName, posterEmail, onNameChange, onEmailChange
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
      <div className="overflow-y-auto flex-1 pb-6">
        <h2 className="text-2xl font-semibold mb-4">Post a Job for {organizationName}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <label className="block mb-2 text-gray-700">Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        <label className="block mb-2 text-gray-700">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        <label className="block mb-2 text-gray-700">Location</label>
        <input
          type="text"
          value={jobLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        {locationSuggestions.length > 0 && (
          <ul className="bg-white border border-gray-300 rounded-md max-h-32 overflow-y-auto mb-4">
            {locationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => onLocationChange(suggestion)}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        <label className="block mb-2 text-gray-700">Job Type</label>
        <select
          value={jobType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="">Select Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
        </select>

        <label className="block mb-2 text-gray-700">Salary Range</label>
        <input
          type="text"
          value={salary}
          onChange={(e) => onSalaryChange(e.target.value)}
          placeholder="$50000 - $70000"
          className="w-full p-2 border border-gray-300 rounded-md mb-6"
        />

        <h1 className="mt-6 text-lg font-medium text-gray-700">Job Poster Details</h1>
        <label className="block mb-2 text-gray-700">Name</label>
        <input
          type="text"
          value={posterName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        <label className="block mb-2 text-gray-700">Email Address</label>
        <input
          type="email"
          value={posterEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-6"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Job'}
        </button>
      </div>
    </div>
  </div>
)

// Form for Creating a New Organization
const CreateOrganizationForm: React.FC<{
  organizationName: string;
  onNameChange: (value: string) => void;
  onCreate: () => void;
}> = ({ organizationName, onNameChange, onCreate }) => (
  <div className="mt-6 w-full max-w-md">
    <h2 className="text-lg font-medium text-gray-700 mb-2">Create a New Organization</h2>
    <input
      type="text"
      placeholder="Organization Name"
      value={organizationName}
      onChange={(e) => onNameChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md mb-4"
    />
    <button
      onClick={onCreate}
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Create Organization
    </button>
  </div>
)

export default JobPostPage

