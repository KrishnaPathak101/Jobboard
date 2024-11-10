'use client';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  const { isSignedIn } = useUser();

  const handleJobPostClick = (e) => {
    if (!isSignedIn) {
      e.preventDefault();  // Prevent navigation
      alert('Please sign up or log in to post a job');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link className="text-2xl font-bold" href="/">Job Board</Link>
        <nav className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Link href="/new-listing" onClick={ e => handleJobPostClick(e)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Post a job
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
