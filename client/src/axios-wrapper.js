import axios from 'axios'

/* eslint-disable no-console */
export const HTTP = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true, // gestion cookies coté server
  headers: {
    'Content-Type': 'application/json'
  }
})

HTTP.interceptors.response.use(function(response){
  return response;
}, function (error) {
  //TODO
  // console.log(vm.$message,error.response);
  // Error
  /* eslint-disable no-console */
  if (error.response) {
    if (error.response.errmsg){
      console.log('Error', error.data.errmsg);
    }
    if (error.response.status === 401) {
      console.log('unauthorized, logging out ... TODO');
    }
} else if (error.request) {
    console.log(error.request);
} 
  console.log('Error non moniturer',error);
  return Promise.reject(error.response);
});