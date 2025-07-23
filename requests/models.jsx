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
  console.log('model Obj Request:', modelObj)
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

export default {
  getModelsForFaction,
  getWargear,
  updateModel,
  updateWargear,
  getKeywordsForFaction,
  getPointsForID
};
