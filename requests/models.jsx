import axios from "axios"
import userService from './users'


const baseUrl = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

const getModelsForFaction = async (faction) => {
  const response = await axios.get(`${baseUrl}/models/factions/${faction}`)
  return response.data
};

const getWargear = async (id) => {
  const response = await axios.get(`${baseUrl}/wargears/${id}`)
  return response.data
}

const updateModel = async (user, modelObj) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }
  console.log(modelObj)
  const response = await axios.put(`${baseUrl}/admins/models`, modelObj, config)
  return response.data
}

const updateWargear = async (user, wargear) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const parsedWargear = { ...wargear, AP: parseInt(wargear.AP, 10) }
  const response = await axios.put(`${baseUrl}/admins/wargears`, parsedWargear, config)
  return response.data
}

const getKeywordsForFaction = async (faction) => {
  const response = await axios.get(`${baseUrl}/keywords/${faction}`)
  return response.data
}

const getKeywordsForModel = async (modelId) => {
  const response = await axios.get(`${baseUrl}/keywords/${modelId}`)
  return response.data
}

const getPointsForID = async (IdArr) => {
  const response = await axios.get(`${baseUrl}/points/${IdArr.join(",")}`)
  return response.data
}

const getEnhancements = async () => {
  const response = await axios.get(`${baseUrl}/enhancements`)
  return response.data
}

const getEnhancementsForFaction = async (faction) => {
  const response = await axios.get(`${baseUrl}/enhancements/${faction}`)
  return response.data
}

const getWargearForModels = async () => {
  const response = await axios.get(`${baseUrl}/wargears`)
  return response.data
}

const getAbilities = async () => {
  const response = await axios.get(`${baseUrl}/abilities`)
  return response.data
}

const getAbilitiesForModel = async (modelId) => {
  const response = await axios.get(`${baseUrl}/abilities/${modelId}`)
  return response.data
}

const saveToRoster = async (roster) => {
  const response = await axios.post(`${baseUrl}/users/rosters`, roster)
  return response.data
}

const getAllUnits = async () => {
  const response = await axios.get(`${baseUrl}/models`)
  return response.data
}

const getArmies = async (userId) => {
  const response = await axios.get(`${baseUrl}/users/rosters/${userId}`)
  return response.data
}

const deleteArmy = async (armyId) => {
  const response = await axios.delete(`${baseUrl}/users/rosters/${armyId}`)
  return response.data
}

const updatePoints = async (obj, user) => {
  console.log('obj', obj)
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader }
  }

  const response = await axios.put(`${baseUrl}/admins/points/${obj.id}/${obj.line}`, obj, config)
  return response.data
}

export default {
  getModelsForFaction,
  getWargear,
  updateModel,
  updateWargear,
  getKeywordsForFaction,
  getKeywordsForModel,
  getAbilitiesForModel,
  getPointsForID,
  getEnhancements,
  getWargearForModels,
  getAbilities,
  saveToRoster,
  getArmies,
  getAllUnits,
  deleteArmy,
  updatePoints,
  getEnhancementsForFaction
};
