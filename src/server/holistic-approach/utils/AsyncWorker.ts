import type { WorkerOptions } from "node:worker_threads";
import { Worker as WorkerThread } from "node:worker_threads";

export class Worker<T> {
  private worker: WorkerThread;
  private message: Promise<T> | T;
  private error: Promise<Error> | Error;

  constructor(
    filename: string | URL,
    options?: WorkerOptions
  ) {
    this.worker = new WorkerThread(filename, options);
    this.message = new Promise<T>((resolve, reject) => {
      this.worker.on("message", (resolution: T) => {
        resolve(resolution);
        this.worker.terminate();
        this.message = resolution;
      });
    });
    this.error = new Promise<Error>((resolve, reject) => {
      this.worker.on("error", (error: Error) => {
        reject(error);
        this.worker.terminate();
        this.error = error;
      });
      this.worker.on("exit", (code) => {
        if (code !== 0) {
          const error = new Error(`Worker stopped with exit code ${code}`);
          reject(error);
          this.error = error;
        }
      });
    });
  }

  get resolution() {
    return Promise.race([
      this.message,
      this.error
    ]).then(result => {
      if (result instanceof Error)
        throw result;
  
      return result;
    });
  }
}
