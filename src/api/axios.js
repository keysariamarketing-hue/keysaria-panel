import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const SHIP_ROCKET_URL = import.meta.env.VITE_SHIP_ROCKET_URL;

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const axiosShipRocket = axios.create({
  baseURL: SHIP_ROCKET_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
