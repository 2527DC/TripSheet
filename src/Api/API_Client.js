import axios from "axios";
// import Cookies from "js-cookie";

// export const LocalClient = axios.create({
//   baseURL: "http://localhost:3000/api/",
// });


export const LocalClient = axios.create({
  baseURL: "https://api.mltcorporate.com/api",
});

// export const axiosClient = axios.create({
//   baseURL: "http://194.238.18.112:3000/api/",
// });

//  export const imageUrl = "http://localhost:3000/api/get-signature/";
export const imageUrl = "https://api.mltcorporate.com/api/get-signature/";
