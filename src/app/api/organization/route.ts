import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const jobs = await Job.find({});
    console.log(jobs);
    return NextResponse.json(jobs, { status: 200 });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
