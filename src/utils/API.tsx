import axios from 'axios';

const API_PATH = 'http://xxxxxxxx/api';
export const API = axios.create({
  baseURL: API_PATH, // Set the base URL for your API
  timeout: 2000, // Set the request timeout in milliseconds
  headers: {
    'Content-Type': 'multipart/form-data', // Set the content type for requests
    // Authorization: 'Bearer <token>', // Add any default headers, such as authentication tokens
  },
});
