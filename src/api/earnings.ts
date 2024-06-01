import type { EarningAltered, IEarning } from '@/types';
// import { earnings } from '@/constants';
import { axios } from './init';
import { earningsEndpoint } from '@/constants';

export const addEarning = async (earning: IEarning) => {
  const { data } = await axios.post<Required<Pick<IEarning, 'id'>>>(
    earningsEndpoint,
    earning,
  );

  return data.id;
};

export const updateEarning = async (earning: EarningAltered) => {
  await axios.patch(earningsEndpoint, earning);
  // TODO handle error statuses
};

export const fetchEarnings = async () => {
  const { data } = await axios.get<IEarning[]>(earningsEndpoint);

  return data;
};
