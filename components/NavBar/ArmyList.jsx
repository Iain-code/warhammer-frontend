import React, { useContext } from "react"
import PropTypes from "prop-types"
import { useQuery } from "@tanstack/react-query"
import modelService from '../../requests/models'
import UserContext from "../../contexts/userContext"

const ArmyList = () => {

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

  console.log(data)

  return (
    <div>
      {data && 
        <div>
          Army List
          {data.map(list => 
            <div key={list.id}>
              {list.name}
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