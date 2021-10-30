import axios from 'axios';

export const canvasAxios = axios.create({
  baseURL: 'https://ateneo.instructure.com/api/v1',
  headers: {
    // TODO: REMOVE THIS
    // authorization: process.env.CANVAS_TOKEN as string,
  },
});

/**
 * Create a canvasAxios instance populated with the given access token
 */
// export const getCanvasAxios =(token: string) =>  axios.create()
