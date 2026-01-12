export default class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;

  constructor(private requestsPerMinute: number) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.processing = true;
    const delay = 60000 / this.requestsPerMinute;

    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      if (fn) {
        const start = Date.now();
        await fn();
        const elapsed = Date.now() - start;

        if (elapsed < delay) {
          await new Promise((r) => setTimeout(r, delay - elapsed));
        }
      }
    }

    this.processing = false;
  }
}
