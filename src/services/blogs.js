import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const updateLikes = async (newObject) => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject);
  return response.data;
};

const deleteBlog = async (object) => {
  const config = { headers: { authorization: token } };
  await axios.delete(`${baseUrl}/${object.id}`, config);
};

const create = async (newObject) => {
  const config = {
    headers: { authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

export default { getAll, setToken, create, updateLikes, deleteBlog };
