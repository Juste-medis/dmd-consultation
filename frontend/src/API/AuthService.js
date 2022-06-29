/* eslint-disable no-unused-vars */
import axios from 'axios';
import Neter from '../Ressources/Neter';
const baseUrl = Neter.uri1;
const AuthFetcher = {
  GetSurfToken: async function (setdada) {
    let res = await fetch(baseUrl + '/auth/users/get/formvalidation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  },
  AuthSignin: async function (setdada) {
    let res = await fetch(baseUrl + '/auth/users/authenticate', {
      method: 'POST',
      body: setdada,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return await res.json();
  },
  AuthSignup: async function (setdada) {
    let res = await fetch(baseUrl + '/auth/users/register', {
      method: 'post',
      body: JSON.stringify(setdada),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  },
  AuthSignupCandidate: async function (option) {
    let url = baseUrl + '/auth/users/register';
    return await axios.request({
      baseURL: url,
      method: 'POST',
      responseType: 'json',
      data: option,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  AuthSignupCompany: async function (option) {
    let url = baseUrl + '/auth/users/register/company';
    return await axios.request({
      baseURL: url,
      method: 'POST',
      responseType: 'json',
      data: option,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  CheckAuth: async function (setdada, tk) {
    let url = baseUrl + '/auth/users/current/' + setdada;
    let res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: tk,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return await res.json();
  },
  GetUserUnity: async function (setdada, body) {
    let url = baseUrl + '/auth/users/public/unity/getuser/' + setdada;
    let res = await fetch(url, {
      method: 'get',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return await res.json();
  },
  UpdateData: async function (setdada, umeta) {
    let url = baseUrl + '/auth/users/update';
    url += umeta ? '?umeta=' + umeta : '';
    let res = await fetch(url, {
      method: 'post',
      body: setdada,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return await res.json();
  },
  ChangePassPassu: async function (user_pass) {
    let res = await fetch(baseUrl + '/auth/users/changepass/recorvery', {
      method: 'post',
      body: user_pass,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return await res.json();
  },
  UpdateUserPhoto: async function (option) {
    let url = baseUrl + '/auth/users/blober/photo';
    return await axios.request({
      baseURL: url,
      withCredentials: true,
      method: 'POST',
      responseType: 'json',
      data: option,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  Signout: async function () {
    let url = baseUrl + '/auth/users/signout';
    return await axios.request({
      baseURL: url,
      withCredentials: true,
      method: 'POST',
      responseType: 'json'
    });
  }
};

export default AuthFetcher;
