import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import modelService from '../../requests/models'
import UserContext from "../../contexts/userContext"

const ArmyList = ({ setSelectedUnits }) => {

  const queryClient = useQueryClient()
  const models = queryClient.getQueryData(['models'])
  const [selectedArmy, setSelectedArmy] = useState(null)
  const [toggle, setToggle] = useState(false)

  const user = useContext(UserContext)
  const userId = user?.[0]?.id
  
  const {data, isLoading, error} = useQuery({
    queryKey: ['armyList'],
    queryFn: async () => await modelService.getArmies(userId),
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const deleteArmyMutation = useMutation({
    mutationFn: async (armyId) => await modelService.deleteArmy(armyId),
    onSuccess: () => {
      showMessage('army deleted')
      queryClient.invalidateQueries({ queryKey: ['armyList'] })
    },
    onError: (error) => console.error('failed to delete army', error)
  })

  const showMessage = (msg) => {
    window.confirm(msg)
  }

  if (!userId) return <div>Loading user…</div>
  if (isLoading) return <div>Loading armies…</div>
  if (error) return <div>Failed to load armies</div>

  const selectArmy = (army) => {
    console.log('army:', army)
    const filtered = Object.values(army.army_list).map(armylistUnit => models.find(modelsUnit => modelsUnit.datasheet_id === armylistUnit ))
    console.log('filtered:', filtered)
  }

  const deleteArmy = (armyId) => {
    deleteArmyMutation.mutate(armyId)
  }

  return (
    <div className="text-white">
      <h6>Army List</h6>
      <button
        onClick={() => setToggle(!toggle)}
        className="border mx-3 my-1 p-1"
      >Open/Close</button>
      {data && toggle &&
        <div>
          {data.map(list => 
            <div key={list.id}>
              {list.name}
              <button 
                className="border mx-3 my-1 p-1"
                onClick={() => selectArmy(list)}
              >Select</button>
              <button
                onClick={() => deleteArmy(list.id)}
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