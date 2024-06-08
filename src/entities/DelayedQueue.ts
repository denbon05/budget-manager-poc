import { UNDO_DELAY_IN_SECONDS } from '@/constants';
import { uniqueId } from 'lodash';

export interface IQueueItem {
  fn: () => void | Promise<void>;
  timeoutId: NodeJS.Timeout;
  id: string;
}

export type EnqueueOpts = {
  delayInSeconds?: number;
};

class DelayedQueue {
  private queue: IQueueItem[] = [];

  enqueue = (
    fn: IQueueItem['fn'],
    { delayInSeconds = UNDO_DELAY_IN_SECONDS }: EnqueueOpts = {},
  ) => {
    const id = uniqueId();

    const timeoutId = setTimeout(() => {
      this.execute(id);
    }, delayInSeconds * 1000);
    const item: IQueueItem = {
      fn,
      timeoutId, // unique value
      id,
    };
    this.queue.push(item);

    return id;
  };

  dequeueLast = () => this.queue.pop();

  private execute = async (id: IQueueItem['id']) => {
    // find specific idx
    const idx = this.queue.findIndex(({ id: queuedId }) => queuedId === id);
    if (idx !== -1) {
      // remove item from queue
      const [item] = this.queue.splice(idx, 1);
      // execute predefined function
      await item.fn();
    }
  };

  abort = (id: IQueueItem['id']) => {
    const idx = this.queue.findIndex(({ id: queuedId }) => queuedId === id);
    if (idx !== -1) {
      const [item] = this.queue.splice(idx, 1);
      clearTimeout(item.timeoutId);
      return true;
    }

    return false;
  };

  executeAllNow = async () => {
    const potentialPromises = this.queue.map((item) => {
      clearTimeout(item.timeoutId); // clear timeout - no need anymore
      return item.fn();
    });
    await Promise.all(potentialPromises);
  };
}

export default new DelayedQueue();
