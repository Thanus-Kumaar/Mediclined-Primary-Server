let response = {
  responseStatus: 200,
  responseBody: "",
};
function setResponseAsError(err) {
  response.responseStatus = 500;
  response.responseBody = { ERR: err };
  return response;
}

function setResponseAsBasRequest(message){
  response.responseStatus = 400;
  response.responseBody = { BAD_REQUEST: message };
  return response;
}

function setResponseAsOk(message) {
  response.responseStatus = 200;
  response.responseBody = { MSG: message };
  return response;
}

module.exports = {
  setResponseAsError,
  setResponseAsOk,
  setResponseAsBasRequest
};
