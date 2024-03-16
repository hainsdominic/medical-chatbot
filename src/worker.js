/* eslint-disable @typescript-eslint/no-explicit-any */
import { pipeline } from '@xenova/transformers';

export class MedicalPipeline {
  static task = 'text-generation';
  static model = 'medalpaca/medalpaca-7b';
  static instance = null;

  static async getInstance(progress_callback) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, {
        progress_callback,
      });
    }

    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  let med = await MedicalPipeline.getInstance((x) => {
    self.postMessage(x);
  });
  console.log(event);

  let output = await med(event.data.text, {
    inputs: event.data.text,

    callback_function: (x) => {
      self.postMessage({
        status: 'update',
        output: med.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        }),
      });
    },
  });

  self.postMessage({
    status: 'complete',
    output: output,
  });
});
