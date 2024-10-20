let response = {
  responseCode: 200,
  responseBody: "",
};
function setResponseAsError(err) {
  response.responseCode = 500;
  response.responseBody = { ERR: err };
  return response;
}

function setResponseAsOk(message) {
  response.responseCode = 500;
  response.responseBody = { MSG: message };
  return response;
}

module.exports = {
  setResponseAsError,
  setResponseAsOk,
};
