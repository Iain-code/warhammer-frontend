import axios from "axios"
import userService from './users'

const baseUrl = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

const updateAbilities = async (ability, user) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const response = await axios.put(`${baseUrl}/admins/abilities/${ability.ability_id}`, ability, config)
  return response.data
}

const deleteUnit = async (Id, user) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }
  const response = await axios.delete(`${baseUrl}/admins/models/${Id}`, config)
  return response.data
} 

const updateEnhancement = async (user, enhancement) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const response = await axios.put(`${baseUrl}/admins/enhancements/${enhancement.id}`, enhancement, config)
  return response.data
}

const deleteEnhancement = async (user, Id) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const response = await axios.delete(`${baseUrl}/admins/enhancements/${Id.id}`, config)
  return response.data
}

const deleteAbility = async (user, ability) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }
  
  const response = await axios.delete(`${baseUrl}/admins/abilities/${ability.ability_id}`, config)
  return response.data
}

const addNewEnhancement = async (user, enhancement) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const response = await axios.put(`${baseUrl}/admins/enhancements`, enhancement, config)
  return response.data
}

const addNewModel = async (user, model) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const response = axios.post(`${baseUrl}/admins/models`, model, config)
  return response.data
}

const addNewAbility = async (user, ability) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }
  console.log('ability', ability)
  const response = axios.post(`${baseUrl}/admins/abilities`, ability, config)
  return response.data
}

const addNewPoints = async (user, obj) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const response = await axios.post(`${baseUrl}/admins/points/${obj.datasheet_id}`, obj, config)
  return response.data
}

const addNewKeywordToModel = async (user, updatedKeyword, selectedModel) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const response = await axios.post(`${baseUrl}/admins/keywords/${selectedModel.datasheet_id}`, {keyword: updatedKeyword}, config)
  return response.data
}

const deleteKeyword = async (user, keyword, datasheet_id) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  console.log('keyword', keyword)
  console.log('ID', datasheet_id)
  
  const response = await axios.delete(`${baseUrl}/admins/keywords/${datasheet_id}/${keyword}`, config)
  return response.data
}

export default {
  updateAbilities,
  deleteUnit,
  updateEnhancement,
  deleteEnhancement,
  deleteAbility,
  addNewEnhancement,
  addNewModel,
  addNewAbility,
  addNewPoints,
  addNewKeywordToModel,
  deleteKeyword
}