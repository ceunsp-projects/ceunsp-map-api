import mongoose, { Schema } from 'mongoose';

interface IItemModel {
  item: string
}

export const ItemSchema = new Schema({
  item: {
    type: String,
  }
});

const Item = mongoose.model<IItemModel>('item', ItemSchema);
export default Item;
