import axios from 'axios';
import env from 'react-dotenv';

const uri = env.API_HOST + ":" +
  env.API_PORT +
  env.API_PATH;

const api = axios.create({
  baseURL: uri,
});

export default api;
