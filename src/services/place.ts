import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Request, Response } from 'express';
import { uniq } from 'lodash';
import { readFile } from 'fs/promises';
import Place from '../models/place';
import apiService from './api';
import { KEY_GOOGLE_MAPS } from '../settings';
import bubbleSort from '../helpers/bubbleSort';
import fetch from 'node-fetch';
import selectionSort from '../helpers/selectionSort';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { isValidObjectId } from 'mongoose';

export type MulterExpressFile = Express.Multer.File & Express.MulterS3.File;
class PlaceService {
  async list(req: Request, res: Response) {
    const places = await Place.find({}, { name: 1, pictures: 1, location: 1 });

    if (!places?.length) return res.status(400).json({ message: 'Nenhum local foi identificado em nossa base.'})

    const sortedPlaces = selectionSort(places, (item) => item.name);

    return res.json(sortedPlaces ?? []);
  }

  async details(req: Request, res: Response) {
    const id = req?.params?.id ?? null;
    const isValidId = isValidObjectId(id);

    if (!id || !isValidId) return res.status(400).json({ message: 'É necessário informar qual local deseja ver os detalhes.' });

    const place = await Place.findById(id, { name: 1, location: 1, items: 1 }).lean();

    if (!place) return res.status(400).json({ message: 'Esse local não existe em nossa base.'})

    const items = bubbleSort(place.items);

    return res.json({ ...place, items } ?? []);
  }

  async save(req: Request, res: Response, placePicture: MulterExpressFile) {
    if (!placePicture?.location) return res.status(500).json({ message: 'Não foi possível salvar a foto!'});

    const placePath = !!placePicture?.location ? placePicture.location : placePicture.path;
    const { latitude, longitude } = req.body;

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
        const location = result?.geometry?.location;

        if (!location) return res.status(400).json({ message: 'Identificamos que você não está na CEUNSP.'});

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

    if(!placePicture) return res.status(400).json({ message: 'Envie uma foto!'});
    if(!nameLocation || !location) return res.status(400).json({ message: 'Identificamos que você não está na CEUNSP.'});

    const [modelCocoSsd, modelMobileNet] = await Promise.all([
      cocoSsd.load(),
      mobilenet.load()
    ]);

    let imageBuffer: any;

    if (placePicture?.location) {
      const response = await fetch(placePath);
      imageBuffer = await response.arrayBuffer();
    } else {
      imageBuffer = await readFile(placePath);
    }

    const imgTensor = tf.node.decodeImage(new Uint8Array(imageBuffer), 3);
    const cocoSsdPrediction = await modelCocoSsd.detect(imgTensor);
    const mobileNetPrediction = await modelMobileNet.classify(imgTensor);

    const predictions = [...cocoSsdPrediction, ...mobileNetPrediction];

    const translate = new Translate({ key: KEY_GOOGLE_MAPS });

    const newPredictions = await predictions.reduce(async (previousPromise: Promise<string[]>, item: {className?: string; class?: string}) => {
      const acc = await previousPromise;

      const name = item?.class ? item.class : item?.className ?? ''
      const nameSplited = name.split(',');
      const hasMoreThanOne = nameSplited.length > 1;

      if (hasMoreThanOne) nameSplited.map(async (x: string) => {
        const translatedName = await translate.translate(x?.trim(), 'pt-br');
        acc.push(translatedName[0]?.toLocaleLowerCase());
        return x;
      });

      const translatedName = await translate.translate(hasMoreThanOne ? nameSplited[0] : name, 'pt-br');
      acc.push(translatedName[0]?.toLocaleLowerCase());

      return acc;
    }, Promise.resolve([]));

    const filteredPredictions = uniq(newPredictions);

    if (!nameLocation) return res.status(400).json({ message: 'Não foi possível identificar em qual local da faculdade você está.'});

    let place = await Place.findOneAndUpdate(
      { name: nameLocation },
      {
        $set: { location },
        $addToSet: { items: { $each: filteredPredictions }, pictures: { $each: [placePath] }},
      }
    );

    if (!place) place = await Place.create({
      name: nameLocation,
      location,
      items: filteredPredictions,
      pictures: [placePath]
    });

    return res.json({ place, placePicture});
  }
}

const placeService = new PlaceService();
export default placeService;
