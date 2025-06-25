import axios from "axios";

const baseUrl = "http://localhost:8080";

const getModelsForFaction = async (faction) => {
  const response = await axios.get(`${baseUrl}/factions?faction_id=${faction}`);
  return response.data;
};

const getWargear = async (id) => {
  const newID = Math.round(id)
  const response = await axios.get(`${baseUrl}/wargears?datasheet_id=${newID}`)
  return response.data
}

export default {
  getModelsForFaction,
  getWargear
};
