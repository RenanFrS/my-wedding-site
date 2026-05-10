import React from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import RSVPForm from './RSVPForm';

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;
  const payload = await getPayload({ config });

  // Buscar o RSVP group pelo token único
  const { docs } = await payload.find({
    collection: 'rsvps',
    where: {
      token: {
        equals: resolvedParams.token,
      },
    },
    depth: 1,
  });

  const group = docs[0];

  if (!group) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-background)] text-[#6d4635] text-xl">
        O link de confirmação é inválido ou expirou.
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-[var(--color-background)]">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-serif text-[#ac5b30]">Confirme sua Presença</h1>
        <p className="opacity-80 mt-2 text-lg font-serif">{group.groupName}</p>
      </div>
      <RSVPForm
        token={group.token as string}
        rsvps={
          group.members?.map((m: any) => ({
            id: m.id,
            name: m.name,
            status: m.status || 'pending',
          })) || []
        }
      />
    </main>
  );
}