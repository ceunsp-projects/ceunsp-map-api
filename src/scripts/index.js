const cocoSsd = require('@tensorflow-models/coco-ssd');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const mobilenet = require('@tensorflow-models/mobilenet');

// Load the Coco SSD model and image.
Promise.all([
  cocoSsd.load(),
  mobilenet.load(),
  fs.readFile('./tmp/ed.jpeg')])
.then(async ([modelCocoSsd, modelMobileNet, imageBuffer]) => {

  const imgTensor = tf.node.decodeImage(new Uint8Array(imageBuffer), 3);
  const cocoSsdPrediction = await modelCocoSsd.detect(imgTensor);
  const mobileNetPrediction = await modelMobileNet.classify(imgTensor);

  const predictions = [...cocoSsdPrediction, ...mobileNetPrediction];

  return predictions.reduce((acc, item) => {
    const name = item?.class ? item.class : item.className
    const nameSplited = name.split(',');
    const hasMoreThanOne = nameSplited.length > 1;

    if (hasMoreThanOne) nameSplited.map(x => {
      acc.push({ name: x?.trim()});
      return x;
    });

    acc.push({
      name: hasMoreThanOne ? nameSplited[0] : name
    });

    return acc;
  }, []).filter(a => !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true)) // .filter remove os repetidos
})
.then((predictions) => {
  console.log('Previsões', JSON.stringify(predictions, null, 2));
});
