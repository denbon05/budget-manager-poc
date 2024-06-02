const DEFAULT_DELAY = 4;

export interface IQueueItem {
  fn: () => void | Promise<void>;
  timeoutId: NodeJS.Timeout;
}

export type EnqueueOpts = {
  delayInSeconds?: number;
};

class DelayedQueue {
  private queue: IQueueItem[] = [];

  enqueue = (
    fn: IQueueItem['fn'],
    { delayInSeconds = DEFAULT_DELAY }: EnqueueOpts = {},
  ) => {
    const timeoutId = setTimeout(() => {
      this.execute(timeoutId);
    }, delayInSeconds * 1000);
    const item: IQueueItem = {
      fn,
      timeoutId, // unique value
    };
    this.queue.push(item);

    return timeoutId;
  };

  dequeueLast = () => {
    this.queue.pop();
  };

  private execute = async (id: NodeJS.Timeout) => {
    const idx = this.queue.findIndex(({ timeoutId }) => id === timeoutId);
    if (idx !== -1) {
      // remove item from queue
      const [item] = this.queue.splice(idx, 1);
      await item.fn();
    }
  };

  abort = (id: IQueueItem['timeoutId']) => {
    const idx = this.queue.findIndex(({ timeoutId }) => timeoutId === id);
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
