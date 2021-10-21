import axios from 'axios';

export const canvasAxios = axios.create({
  baseURL: 'https://ateneo.instructure.com/api/v1',
  headers: {
    // TODO: REMOVE THIS
    authorization: process.env.CANVAS_TOKEN as string,
  },
});
