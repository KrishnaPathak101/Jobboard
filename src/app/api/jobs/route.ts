import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';

// Function to handle POST requests for creating a new job


export async function POST(request:Request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body as JSON
    const {
      title,
      description,
      organizationName,
      location,
      jobType,
      salary,
      requirements,
      benefits,
      poster,
    } = await request.json();

    // Validate required fields
    if (!title || !description || !organizationName) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, or organization name.' },
        { status: 400 }
      );
    }

    // Create a new job instance with the parsed data
    const newJob = new Job({
      jobTitle: title,
      jobDescription: description,
      location,
      jobType,
      salary,
      organization: {
        name: organizationName,
      },
      requirements,
      benefits,
      poster: {
        name: poster.name,
        email: poster.email,
      },
    });

    // Save the job to the database
    await newJob.save();

    // Return successful response with job data
    return NextResponse.json({newJob});

  } catch (error) {
    // Log the error and return an appropriate response
    console.error('Error processing POST request:', error);
    return NextResponse.json(
      { error: 'An error occurred while posting the job. Please try again later.' },
      { status: 500 }
    );
  }
}

// Function to handle GET requests for fetching a job by ID

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
