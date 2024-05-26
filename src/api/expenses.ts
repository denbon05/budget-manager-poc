import Axios from 'axios';

const axios = Axios.create({ baseURL: import.meta.url });

export const addExpense = async () => {
  const url = new URL('expenses', import.meta.url).toString();
  console.log('URL', url);
  // await axios.post('expenses', { hello: 'world' });
  const res = await fetch(url, {
    body: 'Hello man!',
    method: 'post',
  });
  console.log('res', await res.text());
};
