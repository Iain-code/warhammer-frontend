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
    rosterDispatch({
      type: 'set',
      payload: 0
    })
    setSelectedUnits(army.army_list)
    const cost = Object.values(army.army_list)
      .filter(armyList => armyList.length > 0)
      .map(unit => unit.reduce((total, unit) => {
        return total += (unit.unitPoints.cost2 || unit.unitPoints.cost)
      }, 0))
  
    rosterDispatch({
      type: 'set',
      payload: Number(cost)
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
      {data && data.length > 0 ?
        <div>
          <button
            onClick={() => setToggle(!toggle)}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
              overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
               group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
               focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Open/Close</span></button> 
        </div> : 
        <div><p>No army lists saved</p></div>
      }
      {data && toggle &&
        <div>
          {data.map(list => 
            <div key={list.id}>
              <p>List name: {list.name}</p>
              <p>Faction: {list.faction}</p>
              <button 
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white focus:ring-4 focus:outline-none 
                focus:ring-pink-200 dark:focus:ring-pink-800"
                onClick={() => selectArmy(list)}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Select</span></button>
              <button
                onClick={() => deleteArmy(list.id)}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white focus:ring-4 focus:outline-none 
                focus:ring-pink-200 dark:focus:ring-pink-800"
              ><span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Delete</span></button>
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
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                focus:ring-pink-200 dark:focus:ring-pink-800"
            ><span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Confirm</span></button>
            <button
              onClick={() => setConfirmDeletion(false)}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                focus:ring-pink-200 dark:focus:ring-pink-800"
            ><span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Cancel</span></button>
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