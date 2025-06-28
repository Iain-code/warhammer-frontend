import React from "react"
import { useContext } from "react"
import UserContext from "../../userContext"
import './armybuilder.css'

const ArmyBuilder = () => {
  const [user, userDispatch] = useContext(UserContext)

  if (!user) {
    return <div className="builderError">Please login to use the army builder</div>
  }

  return (
    <div className="armyBuilder">
      <h4>
        Army Builder
      </h4>
    </div>
  )
}

export default ArmyBuilder