import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Request, Response } from 'express';
import { uniq } from 'lodash';
import { readFile } from 'fs/promises';
import Place from '../models/place';
import apiService from './api';
import { KEY_GOOGLE_MAPS } from '../settings';
import quickSort from '../helpers/quickSort';
import bubbleSort from '../helpers/bubbleSort';
import axios from 'axios';

export type MulterExpressFile = Express.Multer.File & Express.MulterS3.File;
class PlaceService {
  async list(req: Request, res: Response) {
    const places = await Place.find();

    if (!places?.length) return res.json({ message: 'Nenhum local foi identificado em nossa base.'})

    places.map((place) => ({...places, items: quickSort(place.items)}));

    return res.json(places ?? []);
  }

  async details(req: Request, res: Response) {
    const id = req.params.id;
    const place = await Place.findById(id, { name: 1, location: 1, items: 1 }).lean();

    if (!place) return res.json({ message: 'Esse local não existe em nossa base.'})

    const placeDetails = place;
    const items = bubbleSort(placeDetails.items);

    return res.json({ ...placeDetails, items } ?? []);  }

  async save(req: Request, res: Response, placePicture: MulterExpressFile) {
    const placePath = placePicture.location ? placePicture.location : placePicture.path;
    const { latitude, longitude } = req.body;

    // const validationSchema = yup.object().shape({
    //   location: yup.object({
    //     latitude: yup.number(),
    //     longitude: yup.number()
    //   })
    // })

    // const validation = await validationSchema.validate(req.body);

    if(!placePicture) return res.json({ status: 400, message: 'Envie uma foto!'});
    const teste = Buffer.from(placePath);
    // console.log({ teste, placePicture, teste2 });

    const [modelCocoSsd, modelMobileNet] = await Promise.all([
      cocoSsd.load(),
      mobilenet.load()
    ]);

    let imageBuffer: Buffer

    if (placePicture.location) {
      const response = await axios({ url: placePath })
      imageBuffer= Buffer.from(response.data, 'base64');
    } else {
      imageBuffer = await readFile(placePath);
    }

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

    if (!nameLocation) return res.status(400).json({ message: 'Não foi possível identificar em qual local da faculdade você está.'});

    let place = await Place.findOneAndUpdate(
      { name: nameLocation },
      { $set: { location }, $addToSet: { items: { $each: filteredPredictions }}}
    );

    if (!place) place = await Place.create({ name: nameLocation, location, items: filteredPredictions});

    return res.json({ place, placePicture});
  }
}

const placeService = new PlaceService();
export default placeService;
