import React, { useState } from 'react'
import Select from 'react-select'
import modelService from '../../requests/models'
import './admin.css'
import factionList from '../FactionForm/FactionList'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@tanstack/react-query'

const Admin = ({ user }) => {
  const [models, setModels] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [updatedModel, setUpdatedModel] = useState(null)
  const [wargear, setWargear] = useState(null)
  const [selectedWargear, setSelectedWargear] = useState(null)
  const [updatedWargear, setUpdatedWargear] = useState(null)
  const [editing, setEditing] = useState(false)
  const [faction, setFaction] = useState(null)
  const [modelPoints1, setModelPoints1] = useState(null)
  const [modelPoints2, setModelPoints2] = useState(null)
  const [updatedPoints1, setUpdatedPoints1] = useState(null)
  const [updatedPoints2, setUpdatedPoints2] = useState(null)

  const points = useQuery({
    queryKey: ['pointsForAdmin', faction],
    queryFn: () => sortUnitsAndFetchData(),
    enabled: !!models,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const sortUnitsAndFetchData = async () => {
    const IDs = models.map(unit => unit.datasheet_id)
    const response = await modelService.getPointsForID(IDs)
    return response
  }

  const getModelsMutation = useMutation({
    mutationFn: async () => await modelService.getModelsForFaction(faction),
    onSuccess: (response) => {
      setModels(response)
    },
    onError: (error) => {
      console.error('failed to fetch models:', error)
    }
  })

  const getWargearMutation = useMutation({
    mutationFn: async (id) => await modelService.getWargear(id),
    onSuccess: (response) => setWargear(response),
    onError: (error) => {
      console.error('failed to fetch wargear:', error)
    }
  })

  const updateModelMutation = useMutation({
    mutationFn: async ({ user, updatedModel }) => await modelService.updateModel(user, updatedModel),
    onSuccess: (response) => setSelectedModel(response),
    onError: (error) => {
      console.error('failed to update model:', error)
    }
  })

  const updateWargearMutation = useMutation({
    mutationFn: async ({ user, updatedWargear }) => await modelService.updateWargear(user, updatedWargear),
    onSuccess: (response) => setSelectedWargear(response),
    onError: (error) => {
      console.error('failed to update wargear:', error)
    }
  })

  const handleModelChoice = (model) => {
    setSelectedWargear(null)
    setSelectedModel(model)
    if (points.data && model) {
      const foundUnits = points.data.filter(points => points.datasheet_id === model.datasheet_id)
      setModelPoints1(foundUnits[0])
      if (foundUnits[1]) {
        setModelPoints2(foundUnits[1])
      }
    }
    getWargearMutation.mutate(model.datasheet_id)
  }

  const handleFieldChange = (field, value) => {
    if (updatedModel) {
      setUpdatedModel({ ...updatedModel, [field]: value })
    } else {
      setUpdatedModel({ ...selectedModel, [field]: value })
    }
  }

  const handlePointsChange1 = (value) => {
    if (updatedPoints1) {
      setUpdatedPoints1({ ...updatedPoints1, cost: value })
    } else {
      setUpdatedPoints1({ ...modelPoints1, cost: value })
    }
  }

  const handlePointsChange2 = (value) => {
    if (updatedPoints2) {
      setUpdatedPoints2({ ...updatedPoints2, cost: value })
    } else {
      setUpdatedPoints2({ ...modelPoints2, cost: value })
    }
  }

  const handleWargearChange = (field, value) => {
    if (updatedWargear) {
      setUpdatedWargear({ ...updatedWargear, [field]: value })
    } else {
      setUpdatedWargear({ ...selectedWargear, [field]: value })
    }
  }

  const handleSaveUpdate = () => {
    if (!editing) {
      window.alert("edit something before saving")
      return
    }
    updateModelMutation.mutate({ user, updatedModel })
    setEditing(false)
    setUpdatedModel(null)
  }

  const handleUpdateWargear = () => {
    if (!editing) {
      window.alert("edit something before saving")
      return
    }
    updateWargearMutation.mutate({ user, updatedWargear })
    setEditing(false)
    setUpdatedWargear(null)
  }

  const handleCancel = () => {
    setUpdatedModel(null)
    setUpdatedWargear(null)
    setEditing(false)
  }

  if (!user || user.isAdmin === false) {
    return null
  }

  const getmodels = (option) => {
    setModels(null)
    setSelectedModel(null)
    setUpdatedModel(null)
    setWargear(null)
    setSelectedWargear(null)
    setUpdatedWargear(null)
    setEditing(false)
    setFaction(option)
    if (option) getModelsMutation.mutate()
  }

  console.log('modelPoints1:', modelPoints1)
  console.log('modelPoints2:', modelPoints2)

  return (
    <div>
      <div className='flex flex-col mx-auto justify-center pt-[100px] text-center w-full md:w-1/2'>
        <Select
          className="bg-neutral-800"
          placeholder="Select a faction"
          options={factionList}
          isSearchable
          onChange={(option) => getmodels(option.value)}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: '#1b1b1b',
              borderColor: 'transparent',
              boxShadow: 'none',
              minHeight: '2.5rem',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#1b1b1b',
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              backgroundColor: isSelected
                ? '#374151'
                : isFocused
                  ? '#1f2937'
                  : '#1b1b1b',
              color: 'white',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'white',
            }),
            placeholder: (base) => ({
              ...base,
              color: '#9ca3af',
            }),
          }}
        />
        <Select 
          placeholder="Select a model"
          options={models ?? []}
          isSearchable
          value={selectedModel}
          onChange={(model) => handleModelChoice(model)}
          getOptionLabel={(option) => (option.name)}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: '#1b1b1b',
              borderColor: 'transparent',
              boxShadow: 'none',
              minHeight: '2.5rem',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#1b1b1b',
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              backgroundColor: isSelected
                ? '#374151'
                : isFocused
                  ? '#1f2937'
                  : '#1b1b1b',
              color: 'white',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'white',
            }),
            placeholder: (base) => ({
              ...base,
              color: '#9ca3af', 
            }),
          }}
        />
        <Select
          placeholder="Select Wargear"
          options={wargear ?? []}
          value={selectedWargear}
          isSearchable
          onChange={(option) => setSelectedWargear(option)}
          getOptionLabel={(option) => (option.name)}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: '#1b1b1b',
              borderColor: 'transparent',
              boxShadow: 'none',
              minHeight: '2.5rem',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#1b1b1b',
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              backgroundColor: isSelected
                ? '#374151'
                : isFocused
                  ? '#1f2937'
                  : '#1b1b1b',
              color: 'white',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'white',
            }),
            placeholder: (base) => ({
              ...base,
              color: '#9ca3af',
            }),
          }}
        />
      </div>
      <div className='flex justify-center'>
        <button 
          onClick={() => setEditing(!editing)}
          className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
        >Edit</button>
        <button 
          onClick={handleCancel}
          className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"  
        >Cancel</button>
        <br />
        <button 
          onClick={handleSaveUpdate}
          className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
        >Save Model Update</button>
      </div>
      <div className='modelTables'>
        {selectedModel &&
        <div>
          <table className="table-auto min-w-full text-sm">
            <caption>Existing Models Stats</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>M</th>
                <th>T</th>
                <th>W</th>
                <th>Sv</th>
                <th>Inv</th>
                <th>Ld</th>
                <th>OC</th>
                <th>Cost 1</th>
                <th>Cost 2</th>
              </tr>   
            </thead>
            <tbody>
              <tr className='hover:bg-neutral-600'>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24 '>{ editing ?
                  <input
                    type="text"
                    value={updatedModel && updatedModel.name != null ? updatedModel.name : (selectedModel.name ?? '')}
                    onChange={(e) => handleFieldChange( 'name', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.name }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing ?
                  <input
                    type="text"
                    value={updatedModel?.M ?? selectedModel?.M ?? ''}
                    onChange={(e) => handleFieldChange( 'M', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.M }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing ?
                  <input
                    type="text"
                    value={updatedModel?.T ?? selectedModel?.T ?? ''}
                    onChange={(e) => handleFieldChange( 'T', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.T }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing ?
                  <input
                    type="text"
                    value={updatedModel?.W ?? selectedModel?.W ?? ''}
                    onChange={(e) => handleFieldChange( 'W', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.W }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing ?
                  <input
                    type="text"
                    value={updatedModel?.Sv ?? selectedModel?.Sv ?? ''}
                    onChange={(e) => handleFieldChange( 'Sv', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.Sv }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing ?
                  <input
                    type="text"
                    value={updatedModel?.inv_sv ?? selectedModel?.inv_sv ?? ''}
                    onChange={(e) => handleFieldChange( 'inv_sv', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.inv_sv }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing ?
                  <input
                    type="text"
                    value={updatedModel?.Ld ?? selectedModel?.Ld ?? ''}
                    onChange={(e) => handleFieldChange( 'Ld', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.Ld }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing ?
                  <input
                    type="text"
                    value={updatedModel?.OC ?? selectedModel?.OC ?? ''}
                    onChange={(e) => handleFieldChange( 'OC', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.OC }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing && modelPoints1 ?
                  <input
                    type="text"
                    value={updatedPoints1?.cost ?? modelPoints1?.cost ?? ''}
                    onChange={(e) => handlePointsChange1( e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : modelPoints1?.cost}
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing && modelPoints2 ?
                  <input
                    type="text"
                    value={updatedPoints2?.cost ?? modelPoints2?.cost ?? ''}
                    onChange={(e) => handlePointsChange2( e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : modelPoints2?.cost }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        }
        {selectedWargear &&
        <div>
          <button 
            onClick={handleUpdateWargear}
            className="flex mx-auto justify-center text-sm bg-orange-500 hover:bg-orange-600 
            text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
          >Save Wargear Update</button>
          <table className='attackTable'>
            <caption className='caption'>Wargear Profile</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Range</th>
                <th>BS/WS</th>
                <th>Attacks</th>
                <th>Strength</th>
                <th>AP</th>
                <th>Damage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.name ?? selectedWargear.name) ?? ''}
                    onChange={(e) => handleWargearChange('name', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.name}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.type ?? selectedWargear.type) ?? ''}
                    onChange={(e) => handleWargearChange('type', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.type}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.range ?? selectedWargear.range) ?? ''}
                    onChange={(e) => handleWargearChange('range', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.range}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.BS_WS ?? selectedWargear.BS_WS) ?? ''}
                    onChange={(e) => handleWargearChange('BS_WS', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.BS_WS}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.attacks ?? selectedWargear.attacks) ?? ''}
                    onChange={(e) => handleWargearChange('attacks', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.attacks}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.strength ?? selectedWargear.strength) ?? ''}
                    onChange={(e) => handleWargearChange('strength', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.strength}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.AP ?? selectedWargear.AP) ?? '0'}
                    onChange={(e) => handleWargearChange('AP', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.AP}
                </td>
                <td>{editing ?
                  <input
                    type='text'
                    value={(updatedWargear?.damage ?? selectedWargear.damage) ?? ''}
                    onChange={(e) => handleWargearChange('damage', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.damage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        }
      </div>
    </div>
  )
}

Admin.propTypes = {
  user: PropTypes.object
}

export default Admin