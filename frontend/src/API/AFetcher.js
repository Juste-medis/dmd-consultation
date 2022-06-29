import Neter from '../Ressources/Neter';
import axios from 'axios';
const baseUrl = Neter.uri1;

export async function AGetMyOptions(setdada, query) {
  let url = baseUrl + '/djondoapi/royal/dashboard/casper/options/' + setdada;
  return await axios.request({
    baseURL: url,
    method: 'get',
    params: { ...(query ? { query } : {}) },
    responseType: 'json',
    withCredentials: true,
    headers: {
      Accept: 'application/json'
    }
  });
}
export async function SAGetMyOptions(setdada, query) {
  let url = baseUrl + '/djondoapi/royal/dashboard/caspero/options/' + setdada;
  return await axios.request({
    baseURL: url,
    method: 'get',
    params: { ...(query ? { query } : {}) },
    responseType: 'json',
    withCredentials: true,
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function GetConsultations(query) {
  let url = baseUrl + '/djondoapi/royal/dashboard//data/consultations';
  return await axios.request({
    baseURL: url,
    method: 'get',
    params: { ...(query ? { query } : {}) },
    responseType: 'json',
    withCredentials: true,
    headers: {
      Accept: 'application/json'
    }
  });
}
export async function UpdateUserStatus(option, action) {
  let url = baseUrl + '/auth/users/aupdate';
  return await axios.request({
    baseURL: url,
    method: 'POST',
    responseType: 'json',
    withCredentials: true,
    data: option,
    params: { action },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function UpdateUserLevel(option, action) {
  let url = baseUrl + '/auth/users/aupdate';
  return await axios.request({
    baseURL: url,
    method: 'POST',
    responseType: 'json',
    withCredentials: true,
    data: option,
    params: { action },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
