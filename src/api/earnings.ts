import { earningsEndpoint } from '@/constants';
import type { EarningAltered, IEarning } from '@/types';
import { apiProxied } from './init';

export const addEarning = async (earning: IEarning) => {
  const { data } = await apiProxied.post<Required<Pick<IEarning, 'id'>>>(
    earningsEndpoint,
    earning,
  );

  return data.id;
};

export const updateEarning = async (earning: EarningAltered) => {
  await apiProxied.patch(earningsEndpoint, earning);
  // TODO handle error statuses
};

export const fetchEarnings = async () => {
  const { data } = await apiProxied.get<IEarning[]>(earningsEndpoint);

  return data;
};

export const deleteEarning = async (parm: Pick<EarningAltered, 'id'>) => {
  await apiProxied.delete(earningsEndpoint, { data: parm });
};
