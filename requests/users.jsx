import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE

const setToken = (tokenStr) => {
  const newToken = `Bearer ${tokenStr}`
  return newToken
}

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials, {withCredentials: true})
  return response.data
}

const createUser = async (credentials) => {
  const response = await axios.post(`${baseUrl}/users`, credentials)
  return response.data
}

const refresh = async (token) => {
  const tokenHeader = setToken(token)
  const config = {
    headers: { Authorization: tokenHeader },
    withCredentials: true
  }
  const response = await axios.post(`${baseUrl}/refresh`, null, config)
  return response.data
}

export default {
  login,
  createUser,
  refresh,
  setToken
}