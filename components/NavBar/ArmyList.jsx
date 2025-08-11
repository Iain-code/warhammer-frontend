import React, { useContext } from "react"
import PropTypes from "prop-types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import modelService from '../../requests/models'
import UserContext from "../../contexts/userContext"

const ArmyList = () => {

  const queryClient = useQueryClient()
  const models = queryClient.getQueryData(['models'])
  const user = useContext(UserContext)
  const userId = user?.[0]?.id
  
  const {data, isLoading, error} = useQuery({
    queryKey: ['armyList'],
    queryFn: async () => await modelService.getArmies(userId),
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false
  })

  if (!userId) return <div>Loading user…</div>;
  if (isLoading) return <div>Loading armies…</div>;
  if (error) return <div>Failed to load armies</div>;

  const filterArmy = (army) => {
    const filtered = army.army_list.map(armylistUnit => models.find(modelsUnit => modelsUnit.datasheet_id === armylistUnit ))
    const withID = filtered.map(unit => ({ ...unit, new_id: crypto.randomUUID() }))
    console.log('withID:', withID)
  }
  
  // need to added filtering of units so if datasheet id matches i get a new list of all the datasheets i have in array and display those

  return (
    <div className="text-white">
      {data && 
        <div>
          Army List
          {data.map(list => 
            <div key={list.id}>
              {list.name}
              <button 
                className="border mx-3 my-1 p-1"
                onClick={() => filterArmy(list)}
              >Select</button>
              <button
                className="border mx-3 my-1 p-1"
              >Delete</button>
            </div>
          )}
        </div>}
    </div>
  )
}


ArmyList.propTypes = {
  armyList: PropTypes.array,
}

export default ArmyList