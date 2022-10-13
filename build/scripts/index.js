var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cocoSsd = require('@tensorflow-models/coco-ssd');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const mobilenet = require('@tensorflow-models/mobilenet');
// Load the Coco SSD model and image.
Promise.all([
    cocoSsd.load(),
    mobilenet.load(),
    fs.readFile('./tmp/ed.jpeg')
])
    .then(([modelCocoSsd, modelMobileNet, imageBuffer]) => __awaiter(this, void 0, void 0, function* () {
    const imgTensor = tf.node.decodeImage(new Uint8Array(imageBuffer), 3);
    const cocoSsdPrediction = yield modelCocoSsd.detect(imgTensor);
    const mobileNetPrediction = yield modelMobileNet.classify(imgTensor);
    const predictions = [...cocoSsdPrediction, ...mobileNetPrediction];
    return predictions.reduce((acc, item) => {
        const name = (item === null || item === void 0 ? void 0 : item.class) ? item.class : item.className;
        const nameSplited = name.split(',');
        const hasMoreThanOne = nameSplited.length > 1;
        if (hasMoreThanOne)
            nameSplited.map(x => {
                acc.push({ name: x === null || x === void 0 ? void 0 : x.trim() });
                return x;
            });
        acc.push({
            name: hasMoreThanOne ? nameSplited[0] : name
        });
        return acc;
    }, []).filter(a => !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true)); // .filter remove os repetidos
}))
    .then((predictions) => {
    console.log('Previsões', JSON.stringify(predictions, null, 2));
});
