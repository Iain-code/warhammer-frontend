import axios from "axios"
import userService from './users'

const baseUrl = "http://localhost:8080";

const updateAbilities = async (ability, user) => {
  const tokenHeader = userService.setToken(user.token)
  const config = {
    headers: { Authorization: tokenHeader },
    withCredentials: true
  }

  const response = await axios.put(`${baseUrl}/admins/abilities/${ability.datasheet_id}/${ability.line}`, ability, config)
  console.log(response.data)
  return response.data
}


export default {
  updateAbilities
} 