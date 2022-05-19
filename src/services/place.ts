import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Request, Response } from 'express';
import { uniq } from 'lodash';
import { readFile } from 'fs/promises';
import Place from '../models/place';
import apiService from './api';
import { KEY_GOOGLE_MAPS } from '../settings';

class PlaceService {
  async get(req: Request, res: Response) {
    const places = Place.find();

    return res.json(places ?? []);
  }

  async save(req: Request, res: Response) {
    const placePicture = req.file;
    const { latitude, longitude } = req.body;

    if(!placePicture) return res.json({ status: 400, message: 'Envie uma foto!'});

    const [modelCocoSsd, modelMobileNet, imageBuffer] = await Promise.all([
      cocoSsd.load(),
      mobilenet.load(),
      readFile(placePicture.path)
    ]);

    const imgTensor = tf.node.decodeImage(new Uint8Array(imageBuffer), 3);
    const cocoSsdPrediction = await modelCocoSsd.detect(imgTensor);
    const mobileNetPrediction = await modelMobileNet.classify(imgTensor);

    const predictions = [...cocoSsdPrediction, ...mobileNetPrediction];

    const newPredictions = predictions.reduce((acc: string[], item: {className?: string; class?: string}) => {
      const name = item?.class ? item.class : item?.className ?? ''
      const nameSplited = name.split(',');
      const hasMoreThanOne = nameSplited.length > 1;

      if (hasMoreThanOne) nameSplited.map((x: string) => {
        acc.push(x?.trim());
        return x;
      });

      acc.push(hasMoreThanOne ? nameSplited[0] : name);

      return acc;
    }, [])

    const filteredPredictions = uniq(newPredictions);

    const getLocation = await apiService.googleGeocoding({
      method: 'GET',
      url: 'geocode/json',
      params: {
        latlng: `${latitude},${longitude}`,
        key: KEY_GOOGLE_MAPS
      },
    });

    const result = getLocation?.results?.reduce(((acc : any, result: any) => {
      const typesModified = result.address_components?.map((x: any, index: number) => ({types: x?.types, index}));
      const existPremise = typesModified?.find((modified: any) => modified?.types?.includes('premise'));

      if (existPremise) {
        const location = result.geometry.location;
        acc.push({
          name : result.address_components[existPremise?.index]?.long_name,
          location: {
            latitude: location.lat,
            longitude: location.lng
          }
        });
      }
7
      return acc
    }), [])[0];

    const nameLocation = result?.name;
    const location = result?.location;

    let place = await Place.findOneAndUpdate(
      { name: nameLocation },
      { $set: { location }, $addToSet: { items: { $each: filteredPredictions }}}
    );

    if (!place) place = await Place.create({ name: nameLocation, location, items: filteredPredictions});

    return res.json({ place, items: filteredPredictions});
  }
}

const placeService = new PlaceService();
export default placeService;
