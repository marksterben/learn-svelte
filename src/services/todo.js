import axios from "axios";

const baseUrl = "https://marksterben-todoapp.herokuapp.com";

export const getTodosService = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/todos`);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addTodoService = async (name) => {
  try {
    await axios.post(`${baseUrl}/api/todo `, { name: name });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateTodoService = async ({ id, name, completed }) => {
  try {
    await axios.put(`${baseUrl}/api/todo/${id}`, {
      name: name,
      completed: completed,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteTodoService = async ({ id }) => {
  try {
    await axios.delete(`${baseUrl}/api/todo/${id}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteAllTodoService = async () => {
  try {
    await axios.delete(
      `https://marksterben-item-list-api.herokuapp.com/api/items`
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
