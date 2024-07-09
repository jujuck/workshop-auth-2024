import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3310",
  withCredentials: true,
});

export default instance;
