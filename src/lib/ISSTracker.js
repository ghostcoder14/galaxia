import axios from 'axios';

const API_KEY = "ovQtHry5RPTUZ98ebIwaZ5ZKAWjIdAcntQa6gRGd";
const NASA_API_URL = `https://api.nasa.gov/iss-now/v1/?api_key=${API_KEY}`;
const ASTRONAUTS_API = "http://api.open-notify.org/astros.json";

export const getIssLocation = async () => {
  const response = await axios.get(NASA_API_URL);
  return response.data;
};

export const getAstronauts = async () => {
  const response = await axios.get(ASTRONAUTS_API);
  return response.data.people;
};

