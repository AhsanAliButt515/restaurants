import axios from 'axios';



export const BASE_URL = process.env.BASE_URL || 'https://react-native-challenge-api.tailor-hub.com/api';



const api = axios.create({

  baseURL: BASE_URL,

});



export default api;