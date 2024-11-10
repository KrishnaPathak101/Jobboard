'use client'
import React, { useEffect, useState } from 'react'

// Define the types for the job data to add clarity
interface JobData {
  title: string;
  description: string;
  organizationId: string;
  location?: string;
  postedDate?: string;
  requirements?: string[];
  benefits?: string[];
}

interface JobDetailPageProps {
  params: { id: string };
}

const JobDetailPage: React.FC<JobDetailPageProps> = ({ params }) => {
  const [job, setJob] = useState<JobData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = params;
        if (!id) throw new Error("Job ID is undefined");

        setLoading(true);

        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError('An error occurred while fetching job data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>{job.title}</h1>
      <p style={{ fontStyle: 'italic', color: '#666' }}>Posted by Organization ID: {job.organizationId}</p>
      
      {/* Job Location and Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span><strong>Location:</strong> {job.location || 'Not specified'}</span>
        <span><strong>Posted Date:</strong> {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Not available'}</span>
      </div>

      {/* Job Description */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Description</h2>
        <p>{job.description}</p>
      </div>

      {/* Job Requirements */}
      {job.requirements?.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Requirements</h2>
          <ul>
            {job.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Job Benefits */}
      {job.benefits?.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Benefits</h2>
          <ul>
            {job.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default JobDetailPage;
