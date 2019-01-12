/**
* Module define all API paths
* author: @patr -- patrick@quantfive.org
*/
import { Constants } from 'expo';

import { ENV } from './rn-constants';
import { AsyncStorage } from "react-native";

/**
 * getProdSite() Returns the backend to connect to.  If
 * PRODUCTION_SITE is provided as an env var, it will take precedence.
 * I.E. https://...
 * @params string production -- the production hostname
 * @params string staging -- the staging hostname
 * @params string dev -- the dev hostname
 * @return {string} The hostname of the backend server
 */
function getProdSite(production, staging, dev) {
  if (ENV === 'production') {
    return production;
  } else if (ENV === 'staging') {
    return staging
  } else {
   return dev;
  }
}

/**
 * getApiRoot() Returns the base URL to connect to.  If  API_ROOT
 * is provided as an env var, it will take precedence.
 * I.E. https://.../api/
 * @params string production -- the production hostname
 * @params string staging -- the staging hostname
 * @params string dev -- the dev hostname
 * @return {string} The hostname of the backend server
 */
function getApiRoot(production, staging, dev) {
  if (ENV === 'production') {
    return production;
  } else if (ENV === 'staging') {
    return staging;
  } else if (ENV === 'dev') {
    if (Constants.platform.android) {
      return 'http://10.0.3.2:8000/api/';
    }
    return dev;
  }
}

/**
 * getBaseFrontendURL() Returns the base frontend URL.  If REACT_APP_FRONTEND_URL is provided as
 * an env var, it will take precedence.
 * I.E. https://.../
 * @params string production -- the production hostname
 * @params string staging -- the staging hostname
 * @params string dev -- the dev hostname
 * @return {string} The URL of the base frontend
 */
function getBaseFrontendURL(production, staging, dev) {
  if (ENV === 'production') {
    return production;
  } else if (ENV === 'staging') {
    return staging;
  } else {
    if (Constants.platform.android) {
      return 'http://10.0.3.2:3000';
    }
      return dev;
    }
}

async function setupRequestHeaders(noContentType, TOKEN) {
  const token = await AsyncStorage.getItem(TOKEN);

  var headers = {
    'Content-Type': 'application/json',
  }

  if (noContentType) {
    headers = {};
  }

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  return headers;
}

export const API = (TOKEN) => {
  // HTTP Configurations
  GET_CONFIG: async (token=null) => {
    let headers;
    headers = await setupRequestHeaders(false, TOKEN);
    return ({
      method: 'GET',
      headers: headers,
    });
  },
  GET_CONFIG_WITH_BODY: async (data) => {
    let headers;
    headers = await setupRequestHeaders(false, TOKEN);
    return ({
      method: 'GET',
      body: JSON.stringify(data),
      headers: headers,
    });
  },
  POST_FILE_CONFIG: async (data) => {
    // authorization token
    var headers = await setupRequestHeaders(true, TOKEN);
    return ({
      method: 'post',
      body: data,
      headers: headers,
    });
  },
  POST_CONFIG: async (data) => {
    // authorization token
    var headers = await setupRequestHeaders(false, TOKEN);
    return ({
      method: 'post',
      body: JSON.stringify(data),
      headers: headers,
    });
  },
  PUT_CONFIG: async (data) => {
    // authorization token
    var headers = await setupRequestHeaders(false, TOKEN);
    return ({
      method: 'put',
      body: JSON.stringify(data),
      headers: headers,
    });
  },
  PATCH_CONFIG: async (data) => {
    // authorization token
    var headers = await setupRequestHeaders(false, TOKEN);
    return ({
      method: 'patch',
      body: JSON.stringify(data),
      headers: headers,
    });
  },
  DELETE_CONFIG: async () => {
    // authorization token
    var headers = await setupRequestHeaders(null, TOKEN);
    return ({
      method: 'delete',
      headers: headers,
    });
  }
}

/***
 * Creates the API file
 */
const createAPI = ({routes, authTokenName, apiRoot, frontendUrl}) => {
  // const PRODUCTION_SITE = getProdSite();
  const TOKEN = authTokenName;
  const BASE_URL = getApiRoot(apiRoot.production, apiRoot.staging, apiRoot.dev);
  const BASE_FRONTEND_URL = getBaseFrontendURL(frontendUrl.production, frontendUrl.staging, frontendUrl.dev);

  let curApi = API(TOKEN);
  let curRoutes = routes(BASE_URL, BASE_FRONTEND_URL);
  let api = {...curApi, ...curRoutes};

  return api;
}

export default createAPI;
