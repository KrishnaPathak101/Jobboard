'use client';

import { useOrganizationList, useUser } from '@clerk/nextjs';

export const userMembershipsParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export const JoinedOrganizations = () => {
  const { user } = useUser();
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: userMembershipsParams,
  });

  if (!isLoaded) {
    return <>Loading...</>;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 text-gray-700">Joined Organizations</h1>
      <table className="min-w-full bg-white shadow-md border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-200">Identifier</th>
            <th className="py-2 px-4 border-b border-gray-200">Organization</th>
            <th className="py-2 px-4 border-b border-gray-200">Joined</th>
            <th className="py-2 px-4 border-b border-gray-200">Role</th>
          </tr>
        </thead>
        <tbody>
          {userMemberships?.data?.map((mem) => (
            <tr key={mem.id} className="text-center border-b border-gray-200">
              <td className="py-2 px-4">{mem.publicUserData.identifier}</td>
              <td className="py-2 px-4">{mem.organization.name}</td>
              <td className="py-2 px-4">{mem.createdAt.toLocaleDateString()}</td>
              <td className="py-2 px-4">{mem.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          disabled={!userMemberships?.hasPreviousPage || userMemberships?.isFetching}
          onClick={() => userMemberships?.fetchPrevious?.()}
          className={`px-4 py-2 rounded-md ${
            !userMemberships?.hasPreviousPage || userMemberships?.isFetching
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>

        <button
          disabled={!userMemberships?.hasNextPage || userMemberships?.isFetching}
          onClick={() => userMemberships?.fetchNext?.()}
          className={`px-4 py-2 rounded-md ${
            !userMemberships?.hasNextPage || userMemberships?.isFetching
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
};
