import { pipeline, env, Pipeline } from '@xenova/transformers';

// Disable local models to force loading from HuggingFace Hub
env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
  static task: string = 'feature-extraction';
  static model: string = 'Xenova/all-MiniLM-L6-v2';
  static instance: Promise<Pipeline> | null = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = pipeline(this.task as any, this.model, { progress_callback });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  const { id, type, text, textList } = event.data;

  if (type === 'load') {
    try {
      await PipelineSingleton.getInstance((progress: any) => {
        self.postMessage({ type: 'progress', progress });
      });
      self.postMessage({ type: 'loaded', id });
    } catch (error: any) {
      self.postMessage({ type: 'error', id, error: error.message });
    }
    return;
  }

  if (type === 'embed') {
    try {
      const extractor = await PipelineSingleton.getInstance();
      const inputs = textList ? textList : [text];
      
      // Perform feature extraction
      const output = await extractor(inputs, { pooling: 'mean', normalize: true });
      
      self.postMessage({
        type: 'result',
        id,
        embedding: output.tolist(),
      });
    } catch (error: any) {
      self.postMessage({ type: 'error', id, error: error.message });
    }
  }
});
