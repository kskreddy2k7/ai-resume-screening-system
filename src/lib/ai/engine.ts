export class AIEngine {
  private worker: Worker;
  private messageId = 0;
  private resolvers: Map<number, { resolve: Function; reject: Function }> = new Map();
  public isReady = false;

  constructor(onProgress?: (progress: any) => void) {
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    });

    this.worker.addEventListener('message', (event) => {
      const { type, id, embedding, error, progress } = event.data;

      if (type === 'progress' && onProgress) {
        onProgress(progress);
        return;
      }

      if (type === 'loaded') {
        this.isReady = true;
        const resolver = this.resolvers.get(id);
        if (resolver) {
          resolver.resolve(true);
          this.resolvers.delete(id);
        }
        return;
      }

      if (type === 'result') {
        const resolver = this.resolvers.get(id);
        if (resolver) {
          resolver.resolve(embedding);
          this.resolvers.delete(id);
        }
        return;
      }

      if (type === 'error') {
        const resolver = this.resolvers.get(id);
        if (resolver) {
          resolver.reject(new Error(error));
          this.resolvers.delete(id);
        }
      }
    });
  }

  public async loadModel(): Promise<boolean> {
    const id = this.messageId++;
    return new Promise((resolve, reject) => {
      this.resolvers.set(id, { resolve, reject });
      this.worker.postMessage({ type: 'load', id });
    });
  }

  public async getEmbeddings(textList: string[]): Promise<number[][]> {
    const id = this.messageId++;
    return new Promise((resolve, reject) => {
      this.resolvers.set(id, { resolve, reject });
      this.worker.postMessage({ type: 'embed', id, textList });
    });
  }
}

// Cosine similarity utility
export function cosineSimilarity(a: number[], b: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
