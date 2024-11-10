import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
      // Connect to the database
      await connectToDatabase();
  
      const { id } = params;
  
      // Validate if ID is present
      if (!id) {
        return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
      }
  
      // Find the job by ID
      const job = await Job.findById(id);
  
      // Handle case where job is not found
      if (!job) {
        return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
      }
  
      // Return job details
      return NextResponse.json(job);
  
    } catch (error) {
      // Log the error and return an appropriate response
      console.error('Error retrieving job by ID:', error);
      return NextResponse.json({ error: 'An internal server error occurred while retrieving the job. Please try again later.' }, { status: 500 });
    }
  }