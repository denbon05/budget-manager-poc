import { indexedDB } from '@/indexedDB';
import { CreatedEarning, NewEarning } from '@/schemas/earning';
import type { EarningAltered, IEarning } from '@/types';
import { readRequestBody } from '../utils';

const defaultHeaders = { 'Content-Type': 'application/json' };

export const createEarning = async (event: FetchEvent) => {
  const earning = await readRequestBody<IEarning>(event.request);
  const validatedEarning: IEarning = NewEarning.parse(earning);
  console.log('createEarning validated', validatedEarning);
  console.log('createEarning earning', earning);
  const id = await indexedDB.earnings.add(earning!);

  return new Response(JSON.stringify({ id }), {
    headers: defaultHeaders,
  });
};

export const updateEarning = async (event: FetchEvent) => {
  const earning = await readRequestBody<EarningAltered>(event.request);
  const isUpdated = await indexedDB.earnings.update(earning.id, earning);
  if (!isUpdated) console.warn('[SW] earning is not updated', earning);
  return new Response();
};

export const fetchEarnings = async () => {
  const earnings = (await indexedDB.earnings.toArray()).map(
    (earning: IEarning) => CreatedEarning.parse(earning),
  );
  console.log('fetched earnings', earnings);
  return new Response(JSON.stringify(earnings), {
    headers: defaultHeaders,
  });
};

export const deleteEarning = async (event: FetchEvent) => {
  const earning = await readRequestBody<EarningAltered>(event.request);
  await indexedDB.earnings.delete(earning.id);
  return new Response();
};
