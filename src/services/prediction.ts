import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as fs from 'fs/promises';
import { Request, Response } from 'express';
import { uniqBy } from 'lodash';

class PredictionService {
  async getPrediction(_: Request, res: Response) {
    const [modelCocoSsd, modelMobileNet, imageBuffer] = await Promise.all([
      cocoSsd.load(),
      mobilenet.load(),
      fs.readFile('./tmp/ed.jpeg')]);

      const imgTensor = tf.node.decodeImage(new Uint8Array(imageBuffer), 3);
      const cocoSsdPrediction = await modelCocoSsd.detect(imgTensor);
      const mobileNetPrediction = await modelMobileNet.classify(imgTensor);

      const predictions = [...cocoSsdPrediction, ...mobileNetPrediction];

      const newPredictions = predictions.reduce((acc: {name: string}[], item: {className?: string; class?: string}) => {
        const name = item?.class ? item.class : item?.className ?? ''
        const nameSplited = name.split(',');
        const hasMoreThanOne = nameSplited.length > 1;

        if (hasMoreThanOne) nameSplited.map((x: string) => {
          acc.push({ name: x?.trim()});
          return x;
        });

        acc.push({
          name: hasMoreThanOne ? nameSplited[0] : name
        });

        return acc;
      }, [])

      const filteredPredictions = uniqBy(newPredictions, 'name');

      return res.json({ predictions: filteredPredictions});
  }
}


const predictionService = new PredictionService();
export default predictionService;
