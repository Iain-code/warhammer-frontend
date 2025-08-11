import axios from "axios";
import userService from './users'

const baseUrl = "http://localhost:8080";

const getModelsForFaction = async (faction) => {
  const response = await axios.get(`${baseUrl}/factions`, {
    params: { faction_id: faction }
  })
  return response.data
};

const getWargear = async (id) => {
  const newID = Math.round(id)
  const response = await axios.get(`${baseUrl}/wargears`, {
    params: { datasheet_id: newID } 
  })
  return response.data
}

const updateModel = async (user, modelObj) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader },
    withCredentials: true
  }

  const response = await axios.put(`${baseUrl}/admins/models`, modelObj, config)
  console.log('updateModel Response:', response.data)
  return response.data
}

const updateWargear = async (user, wargear) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader },
    withCredentials: true
  }

  const parsedWargear = { ...wargear, AP: parseInt(wargear.AP, 10) }
  const response = await axios.put(`${baseUrl}/admins/wargears`, parsedWargear, config)
  return response.data
}

const getKeywordsForFaction = async (faction) => {
  const response = await axios.get(`${baseUrl}/keywords`, {
    params: { faction_id: faction }
  })
  return response.data
}

const getPointsForID = async (IdArr) => {
  const response = await axios.get(`${baseUrl}/points`, {
    params: { points_id: IdArr}
  })
  return response.data
}

const getEnhancements = async () => {
  const response = await axios.get(`${baseUrl}/enhancements`)
  return response.data
}

const getWargearForModels = async () => {
  const response = await axios.get(`${baseUrl}/wargears/models`)
  return response.data
}

const getAbilities = async () => {
  const response = await axios.get(`${baseUrl}/abilities`)
  return response.data
}

const saveToRoster = async (roster) => {
  console.log(roster)
  const response = await axios.post(`${baseUrl}/rosters/save`, roster)
  return response.data
}

const getAllUnits = async () => {
  const response = await axios.get(`${baseUrl}/models/all`)
  return response.data
}

const getArmies = async (userId) => {
  const response = await axios.get(`${baseUrl}/rosters/armies`, {
    params: { user_id: userId }
  })
  return response.data
}

export default {
  getModelsForFaction,
  getWargear,
  updateModel,
  updateWargear,
  getKeywordsForFaction,
  getPointsForID,
  getEnhancements,
  getWargearForModels,
  getAbilities,
  saveToRoster,
  getArmies,
  getAllUnits
};
