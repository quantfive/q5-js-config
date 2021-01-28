/**
* Module define all API paths
* author: @patr -- patrick@quantfive.org
*/
import cookie from 'cookie-cutter';

/**
 * getApiRoot() Returns the base URL for api to connect to.  If  API_ROOT
 * is provided as an env var, it will take precedence.
 * @return {string} The hostname of the backend server
 */
function getApiRoot({PRODUCTION_SITE, STAGING_SITE, LOCALHOST}) {
  if (process.env.REACT_APP_API_ROOT) {
    return process.env.REACT_APP_API_ROOT;
  } else if (process.env.REACT_APP_ENV === "staging") {
    return "https://" + STAGING_SITE + "/api/";
  } else if (process.env.NODE_ENV === "production") {
    return "https://" + PRODUCTION_SITE + "/api/";
  } else {
    return "http://" + LOCALHOST + "/api/";
  }
}

async function setupRequestHeaders(noContentType, TOKEN, useCookies) {
  let token = '';

  if (process.browser) {
    token = window.localStorage[TOKEN]
  }

  if (useCookies && !process.browser) {
    token = cookie.get(TOKEN);
  }

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

export const API = ({useCookies, authTokenName}) => {
  return (
    {
      // HTTP Configurations
      GET_CONFIG: (token=null) => {
        let headers;
        headers = setupRequestHeaders(false, authTokenName, useCookies);
        return ({
          method: 'GET',
          headers: headers,
        });
      },
      GET_CONFIG_WITH_BODY: (data) => {
        let headers;
        headers = setupRequestHeaders(false, authTokenName, useCookies);
        return ({
          method: 'GET',
          body: JSON.stringify(data),
          headers: headers,
        });
      },
      POST_FILE_CONFIG: (data) => {
        // authorization token
        var headers = setupRequestHeaders(true, authTokenName, useCookies);
        return ({
          method: 'post',
          body: data,
          headers: headers,
        });
      },
      POST_CONFIG: (data) => {
        // authorization token
        var headers = setupRequestHeaders(false, authTokenName, useCookies);
        return ({
          method: 'post',
          body: JSON.stringify(data),
          headers: headers,
        });
      },
      PUT_CONFIG: (data) => {
        // authorization token
        var headers = setupRequestHeaders(false, authTokenName, useCookies);
        return ({
          method: 'put',
          body: JSON.stringify(data),
          headers: headers,
        });
      },
      PATCH_CONFIG: (data) => {
        // authorization token
        var headers = setupRequestHeaders(false, authTokenName, useCookies);
        return ({
          method: 'patch',
          body: JSON.stringify(data),
          headers: headers,
        });
      },
      DELETE_CONFIG: () => {
        // authorization token
        var headers = setupRequestHeaders(null, authTokenName, useCookies);
        return ({
          method: 'delete',
          headers: headers,
        });
      }
    }
  )
}

/***
 * Creates the API file
 */
const createAPI = ({routes, authTokenName, apiRoot, frontendUrl, extraRoutes, useCookies}) => {
  // const PRODUCTION_SITE = getProdSite();
  const TOKEN = authTokenName;
  const BASE_URL = getApiRoot({
    PRODUCTION_SITE: apiRoot.production, 
    STAGING_SITE: apiRoot.staging, 
    LOCALHOST: apiRoot.dev
  });
  
  let curApi = API({tokenName: TOKEN, useCookies});
  let curRoutes = routes(BASE_URL);
  let api = {...curApi, ...curRoutes};
  if (extraRoutes) {
    let curExtraRoutes = extraRoutes(BASE_URL);
    api = {...api, ...curExtraRoutes};
  }

  return api;
}

export default createAPI;
