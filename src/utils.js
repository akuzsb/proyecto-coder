import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// export const MONGO_URI=`mongodb+srv://as:${process.env.MONGO_PASS}@cluster-as.9xjc9xq.mongodb.net/ecommerce`
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';


export default __dirname;