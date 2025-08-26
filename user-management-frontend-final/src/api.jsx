import axios from "axios";

const CreateAPI = axios.create({
  baseURL: import.meta.env.VITE_CREATE_API_URL,
});

const ManageAPI = axios.create({
  baseURL: import.meta.env.VITE_MANAGE_API_URL,
});

const NotificationAPI = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_API_URL,
});

export { CreateAPI, ManageAPI, NotificationAPI };

