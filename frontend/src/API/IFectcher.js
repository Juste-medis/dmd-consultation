import Neter from '../Ressources/Neter';
import axios from 'axios';
const baseUrl = Neter.uri1;
export async function PostOffer(option) {
  let url = baseUrl + '/djondoapi/royal/offers/oadd/masqu';
  return await axios.request({
    baseURL: url,
    method: 'POST',
    responseType: 'json',
    withCredentials: true,
    data: option,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
export async function UpdateOffer(option, offerID, action, casper) {
  let url = baseUrl + '/djondoapi/royal/offers/oupdate/masqu';
  return await axios.request({
    baseURL: url,
    method: 'POST',
    responseType: 'json',
    params: { offerID, casper, action },
    withCredentials: true,
    data: option,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
export async function UpdateOfferStatus(option, id) {
  let url = baseUrl + '/djondoapi/royal/offers/oupdate/masca/' + id;
  return await axios.request({
    baseURL: url,
    method: 'POST',
    responseType: 'json',
    withCredentials: true,
    data: option,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export async function AddOption(data, option, action, setdada, force) {
  let url = baseUrl + '/djondoapi/royal/dashboard/update/option';
  return await axios.request({
    baseURL: url,
    withCredentials: true,
    method: 'POST',
    data,
    responseType: 'json',
    params: {
      id: setdada,
      option,
      action,
      force
    },
    headers: {
      Accept: 'application/json',
      'Content-Type':
        option === 'curiculum'
          ? 'multipart/form-data'
          : 'application/x-www-form-urlencoded'
    }
  });
}
export async function GetMyOptions(setdada, query, casper) {
  let url = baseUrl + '/djondoapi/royal/dashboard/company/options/' + setdada;
  return await axios.request({
    baseURL: url,
    method: 'get',
    params: { ...(casper ? { casper } : {}), ...(query ? { query } : {}) },
    responseType: 'json',
    withCredentials: true,
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function GetMyCandidateOptions(setdada) {
  let url = baseUrl + '/djondoapi/royal/dashboard/candidate/options/' + setdada;
  return await axios.request({
    baseURL: url,
    method: 'get',
    responseType: 'json',
    withCredentials: true,
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function GetDemand(level, ID) {
  let url = baseUrl + '/djondoapi/royal/dashboard/demands/getunity';
  return await axios.request({
    baseURL: url,
    method: 'get',
    responseType: 'json',
    params: { level, ID },
    withCredentials: true,
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function GetApplication(level, ID) {
  let url = baseUrl + '/djondoapi/royal/dashboard/applications/getunity';
  return await axios.request({
    baseURL: url,
    method: 'get',
    responseType: 'json',
    params: { level, ID },
    withCredentials: true,
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function CompanyGetStatistics(setdada, query) {
  let url = baseUrl + '/djondoapi/royal/dashboard/company/statistics/' + setdada;
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

export async function CandidateGetStatistics(setdada, query) {
  let url = baseUrl + '/djondoapi/royal/dashboard/candidate/statistics/' + setdada;
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
