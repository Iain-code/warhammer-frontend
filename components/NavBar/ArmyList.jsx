import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import modelService from '../../requests/models'
import UserContext from "../../contexts/userContext"
import RosterContext from "../../contexts/rosterContext"

const ArmyList = ({ setSelectedUnits }) => {

  const queryClient = useQueryClient()
  const [toggle, setToggle] = useState(false)
  const [, rosterDispatch] = useContext(RosterContext)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [army, setArmy] = useState(null)

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
      queryClient.invalidateQueries({ queryKey: ['armyList'] })
    },
    onError: (error) => console.error('failed to delete army', error)
  })

  if (!userId) return <div>Loading user…</div>
  if (isLoading) return <div>Loading armies…</div>
  if (error) return <div>Failed to load armies</div>

  const selectArmy = (army) => {
    setSelectedUnits(army.army_list)
    const cost = Object.values(army.army_list)
      .filter(armyList => armyList.length > 0)
      .map(unit => unit.reduce((total, unit) => {
        return total + (unit.unitPoints.cost2 || unit.unitPoints.cost)
      }, 0))
  
    rosterDispatch({
      type: 'set',
      payload: cost
    })
  }

  const deleteArmy = (armyId) => {
    setArmy(armyId)
    setConfirmDeletion(true)
  }

  const handleDeleteArmy = () => {
    setConfirmDeletion(false)
    deleteArmyMutation.mutate(army)
  }

  return (
    <div className="text-white text-center">
      <h6 className="text-center text-xl">Army Lists</h6>
      <button
        onClick={() => setToggle(!toggle)}
        className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
      >Open/Close</button>
      {data && toggle &&
        <div>
          {data.map(list => 
            <div key={list.id}>
              List name: {list.name}
              <br />
              Faction: {list.faction}
              <br />
              <button 
                className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
                onClick={() => selectArmy(list)}
              >Select</button>
              <button
                onClick={() => deleteArmy(list.id)}
                className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
              >Delete</button>
            </div>
          )}
        </div>}
      <div>
        {confirmDeletion &&
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 text-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <p className="mb-6 text-white">Confirm army list deletion</p>
            <button
              onClick={() => army && handleDeleteArmy()}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Confirm</button>
            <button
              onClick={() => setConfirmDeletion(false)}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Cancel</button>
          </div>
        </div>
        }
      </div>
    </div>
  )
}


ArmyList.propTypes = {
  setSelectedUnits: PropTypes.func,
}

export default ArmyList