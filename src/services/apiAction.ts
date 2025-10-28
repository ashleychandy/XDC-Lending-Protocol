import { doFetch } from "./fetcher";

export default {
  addData: (data: object) => doFetch(`/api/add`, "POST", data),
  getData: () => doFetch(`https://jsonplaceholder.typicode.com/posts`, "GET"),
  updateData: (data: object) => doFetch(`/api/update`, "PUT", data),
  deleteData: (id: string) => doFetch(`/api/delete/${id}`, "DELETE"),
};
