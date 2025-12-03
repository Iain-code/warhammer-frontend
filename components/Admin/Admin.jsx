import React, { useState } from 'react'
import Select from 'react-select'
import modelService from '../../requests/models'
import updateService from '../../requests/updates'
import './admin.css'
import factionList from '../FactionForm/FactionList'
import PropTypes from 'prop-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const Admin = ({ user }) => {
  const [selectedModel, setSelectedModel] = useState(null)
  const [updatedModel, setUpdatedModel] = useState(null)
  const [selectedWargear, setSelectedWargear] = useState(null)
  const [updatedWargear, setUpdatedWargear] = useState(null)
  const [editing, setEditing] = useState(false)
  const [faction, setFaction] = useState(null)
  const [modelPoints1, setModelPoints1] = useState(null)
  const [modelPoints2, setModelPoints2] = useState(null)
  const [updatedPoints1, setUpdatedPoints1] = useState(null)
  const [updatedPoints2, setUpdatedPoints2] = useState(null)
  const [abilityState, setAbilityState] = useState([])
  const [updatedEnhancement, setUpdatedEnhancement] = useState([])
  const [newModelPoints, setNewModelPoints] = useState(null)
  const [updatedKeyword, setUpdatedKeyword] = useState(null)
  const [newAbility, setNewAbility] = useState({
    ability_id: 0,
    datasheet_id: 0,
    description: '',
    line: 0,
    model: '',
    name: ''
  })
  const [newEnhancement, setNewEnhancement] = useState({
    name: '',
    description: '',
    cost: 0,
    detachment: '',
    faction_id: faction
  })
  const [newModel, setNewModel] = useState({
    name: '',
    M: '',
    T: '',
    W: 0,
    Sv: '',
    inv_sv: '',
    Ld: '',
    OC: 0,
    faction_id: '',
  })
  const queryClient = useQueryClient()

  const points = useQuery({
    queryKey: ['adminPoints', faction],
    queryFn: () => sortUnitsAndFetchData(),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false
  })
  
  const keywords = useQuery({
    queryKey: ['adminKeywords', selectedModel?.datasheet_id],
    queryFn: () => modelService.getKeywordsForModel(selectedModel.datasheet_id),
    enabled: !!selectedModel,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const abilities = useQuery({
    queryKey: ['adminAbilities', selectedModel?.datasheet_id],
    queryFn: () => modelService.getAbilitiesForModel(selectedModel.datasheet_id),
    enabled: !!selectedModel,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const wargearQuery = useQuery({
    queryKey: ['adminWargear', selectedModel?.datasheet_id],
    queryFn: () => modelService.getWargear(selectedModel.datasheet_id),
    enabled: !!selectedModel,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const sortUnitsAndFetchData = async () => {
    const IDs = getModels?.data.map(unit => unit.datasheet_id)
    const response = await modelService.getPointsForID(IDs)
    return response
  }

  const getModels = useQuery({
    queryKey: ['adminModels', faction],
    queryFn: () => modelService.getModelsForFaction(faction),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const getEnhancements = useQuery({
    queryKey: ['adminEnhance', faction],
    queryFn: () => modelService.getEnhancementsForFaction(faction),
    enabled: !!faction,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const addNewKeywordToModelMutation = useMutation({ 
    mutationFn: () => updateService.addNewKeywordToModel(user, updatedKeyword, selectedModel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'adminKeywords', selectedModel?.datasheet_id ]})
    },
    onError: (error) => {
      console.error('failed to update keywords', error)
    }
  })

  const deleteKeywordMutation = useMutation({
    mutationFn: ({ word, datasheet_id }) => updateService.deleteKeyword( user, word, datasheet_id ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'adminKeywords', selectedModel?.datasheet_id ]})
    },
    onError: (error) => {
      console.error('failed to delete keywords', error)
    }
  })

  const deleteEnhancementMutation = useMutation({
    mutationFn: ({ user, enhancement }) => updateService.deleteEnhancement(user, enhancement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'adminEnhance', faction ]})
    },
    onError: (error) => {
      console.error('failed to update enhancements', error)
    }
  })

  const updateEnhancementMutation = useMutation({
    mutationFn: ({ user, enhancement }) => updateService.updateEnhancement(user, enhancement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'adminEnhance', faction ]})
    },
    onError: (error) => {
      console.error('failed to update enhancements', error)
    }
  })

  const updateModelMutation = useMutation({
    mutationFn: ({ user, updatedModel }) => modelService.updateModel(user, updatedModel),
    onSuccess: (response) => setSelectedModel(response),
    onError: (error) => {
      console.error('failed to update model:', error)
    }
  })

  const updateWargearMutation = useMutation({
    mutationFn: ({ user, updatedWargear }) => modelService.updateWargear(user, updatedWargear),
    onSuccess: (response) => {
      setSelectedWargear(response)
      queryClient.invalidateQueries({ queryKey: ['adminWargear', selectedModel?.datasheet_id] })
    },
    onError: (error) => {
      console.error('failed to update wargear:', error)
    }
  })

  const deleteModelMutation = useMutation({
    mutationFn: (Id) => updateService.deleteUnit(Id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ 'adminModels', faction ]})
    },
    onError: (error) => {
      console.error('failed to delete model:', error)
    }
  })

  const updatePointsMutation = useMutation({
    mutationFn: ({ updatedPoints, user}) => modelService.updatePoints(updatedPoints, user),
    onSuccess: (response) => {
      if (response.line === 1) {
        setModelPoints1(response)
        setEditing(false)
        setUpdatedPoints1(null)
      } else {
        setModelPoints2(response)
        setEditing(false)
        setUpdatedPoints2(null)
      }
      queryClient.invalidateQueries({ queryKey: ['adminPoints', faction] })
    },
    onError: (error) => {
      console.error('failed to update points cost:', error)
    }
  })

  const deleteAbilityMutation = useMutation({
    mutationFn: ({ user, ability }) => updateService.deleteAbility(user, ability),
    onSuccess: () => {
      window.alert('ability has been deleted')
      return queryClient.invalidateQueries({ queryKey: ['adminAbilities', selectedModel?.datasheet_id] })
    },
    onError: (error) => {
      console.error(`failed to delete ability:`, error)
    }
  })

  const updateAbilityMutation = useMutation({
    mutationFn: (ability) => updateService.updateAbilities(ability, user),
    onSuccess: (response) => {
      setEditing(false)
      queryClient.invalidateQueries({ queryKey: ['AbilitiesForAdmin', selectedModel] });
      setAbilityState( abilityState.map(state => {
        if (state.name === response[0]) {
          return { ...state, name: response[0], description: response[1] }
        }
      },
      ))
      queryClient.invalidateQueries({ queryKey: ['adminAbilities', selectedModel?.datasheet_id] })
      window.alert(`${response[0]} successfully updated`)
    },
    onError: (error) => {
      console.error(`failed to update ability`, error)
    }
  })

  const addNewAbilityMutation = useMutation({
    mutationFn: (newAbility) => updateService.addNewAbility(user, newAbility),
    onSuccess: () => {
      window.alert('new ability successfully added')
      return queryClient.invalidateQueries({ queryKey: ['adminAbilities', selectedModel?.datasheet_id] })
    },
    onError: (error) => console.error('failed to add new ability', error)
  })
  
  const newEnhancementMutation = useMutation({
    mutationFn: () => updateService.addNewEnhancement(user, newEnhancement),
    onSuccess: () => window.alert(`new enchancement added`),
    onError: (error) => console.error('failed to add new enhancement', error)
  })

  const addNewModelMutation = useMutation({
    mutationFn: () => updateService.addNewModel(user, newModel),
    onSuccess: () => {
      window.alert(`new model added`)
      return queryClient.invalidateQueries({ queryKey: ['adminModels', faction] })
    },
    onError: (error) => console.error('failed to add new model', error)
  })

  const addNewPointsMutation = useMutation({
    mutationFn: () => updateService.addNewPoints(user, newModelPoints),
    onSuccess: () => {
      window.alert('new points cost added')
      return queryClient.invalidateQueries({ queryKey: ['adminPoints', faction] })
    },
    onError: (error) => console.error('failed to update points', error)
  })

  const handleModelChoice = (model) => {
    setSelectedWargear(null)
    setModelPoints1(null)
    setModelPoints2(null)
    setUpdatedPoints1(null)
    setUpdatedPoints2(null)
    setSelectedModel(model)
    setAbilityState([])

    if (model) {
      const foundUnits = points.data.filter(p => p.datasheet_id === model.datasheet_id)
      const line1 = foundUnits.find(u => u.line === 1) || null
      const line2 = foundUnits.find(u => u.line === 2) || null
      setModelPoints1(line1);
      setModelPoints2(line2);
    }
  }

  const cleanDescription = (description) => {
    if (!description) return ''

    return description.replace(/<[^>]*>/g, '').toUpperCase()
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

  const handleSavePoints = () => {

    if (updatedPoints1) {
      const pointsWithCostInt = { ...updatedPoints1, cost: parseInt(updatedPoints1.cost) }
      updatePointsMutation.mutate({ updatedPoints: pointsWithCostInt, user: user })
    }
    if (updatedPoints2) {
      const pointsWithCostInt = { ...updatedPoints2, cost: parseInt(updatedPoints2.cost) }
      updatePointsMutation.mutate({ updatedPoints: pointsWithCostInt, user: user })
    }
  }

  const handleCancel = () => {
    setUpdatedModel(null)
    setUpdatedWargear(null)
    setEditing(false)
    setUpdatedPoints2(null)
    setUpdatedPoints1(null)
    setAbilityState([])
  }

  const getmodels = (option) => {
    setSelectedModel(null)
    setUpdatedModel(null)
    setSelectedWargear(null)
    setUpdatedWargear(null)
    setEditing(false)
    setFaction(option)
  }

  const handleDescriptionChange = (name, description, line, datasheet_id, ability_id) => {
    setAbilityState(prev => {
      const exists = prev?.some(item => item.name === name)
      if (exists) {
        return prev.map(item => item.name === name ? { name: name, description: description, line: line, datasheet_id: datasheet_id, ability_id: ability_id } : item)
      }
      return  [ ...prev, { name: name, description: description, line: line, datasheet_id: datasheet_id, ability_id: ability_id }]
    }
    )
  }

  const saveAbility = () => {
    if (abilityState) {
      for (const ability of abilityState) {
        updateAbilityMutation.mutate(ability)
      }
    }

    if (newAbility.name !== '' || newAbility.description !== '') {
      addNewAbilityMutation.mutate(newAbility)
    }
    setNewAbility({
      ability_id: 0,
      datasheet_id: 0,
      description: '',
      line: 0,
      model: '',
      name: ''
    })
  }

  const handleKeywordChange = () => {
  }

  const deleteUnit = async () => {
    const ok = window.confirm(
      `Delete "${selectedModel.name}"? This action cannot be undone.`
    )

    if (!ok) return

    deleteModelMutation.mutate(selectedModel.datasheet_id)
  }

  const enhancementCostChange = (enhancement, value) => {

    setUpdatedEnhancement(prev => {
      const exists = prev.some(item => item.id === enhancement.id)
      if (exists) {
        return prev.map(item => item.id === enhancement.id ? { ...item, cost: Number(value)} : item)
      }
      return [ ...prev, { ...enhancement, cost: Number(value) }]
    })
  }

  const enhancementDescriptionChange = (enhancement, description) => {
    setUpdatedEnhancement(prev => {
      const exists = prev.some(item => item.id === enhancement.id)
      if (exists) {
        return prev.map(item => item.id === enhancement.id ? { ...item, description: description } : item)
      }
      return [ ...prev, { ...enhancement, description: description }]
    })
  }

  const saveEnhanceChanges = (id) => {
    const enhancement = updatedEnhancement.find(item => item.id === id)
    updateEnhancementMutation.mutate({ user, enhancement })
  }

  const deleteEnhancement = (id) => {
    const confirm = window.confirm('Confirm to delete enhancement')
    if (!confirm) return
    
    const enhancement = getEnhancements.data.find(e => e.id === id)
    deleteEnhancementMutation.mutate({ user, enhancement })
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

  const deleteAbility = (ability) => {
    const confirm = window.confirm(`Confirm deletition of ${ability.Name}`)
    if (!confirm) return
    
    deleteAbilityMutation.mutate({ user, ability })
    setAbilityState(null)
    setEditing(false)
  }

  const handleNewEnhancement = (field, value) => {
    if (field === 'cost') {
      value = parseInt(value)
    }
    setNewEnhancement({
      ...newEnhancement, [field]: value, faction_id: faction
    })
  }

  const addNewEnhancement = () => {
    if (newEnhancement.name && newEnhancement.cost && newEnhancement.description && newEnhancement.detachment) {
      newEnhancementMutation.mutate()
    } else {
      window.alert('please fill in all fields before saving enhancement')
      return
    }
  }

  const handleAddNewModel = (field, value) => {
    setNewModel({ ...newModel, [field]: value, faction_id: faction })
  }

  const addNewModel = () => {
    if (newModel.name != '' && newModel.T != 0 && newModel.W != 0 && 
      newModel.M != 0 && newModel.sv != 0 && newModel.Ld != 0) {
      addNewModelMutation.mutate()
      return
    }
    window.alert('please complete all fields to add a new model')
  }

  const handleNewAbility = (field, value) => {
    setNewAbility({ ...newAbility, [field]: value, datasheet_id: selectedModel.datasheet_id })
  }

  const handleAddNewModelPoints = (field, value) => {
    setNewModelPoints({ ...newModelPoints, [field]: value, datasheet_id: selectedModel.datasheet_id })
  }

  const addNewPoints = () => {
    if (!newModelPoints?.cost || !newModelPoints?.description) {
      window.alert('Add new points cost and description before saving')
    }

    if (!newModelPoints?.cost2 || !newModelPoints?.description2) {
      console.log('newModelPoints', newModelPoints)
      addNewPointsMutation.mutate()
    }
  }

  if (!user || user.isAdmin === false) {
    return null
  }

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
          options={(getModels.data ?? []).slice().sort((a, b) => 
            a.name.localeCompare(b.name)
          )}
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
          options={(wargearQuery.data ?? []).slice().sort((a, b) => 
            a.name.localeCompare(b.name)
          )}
          value={selectedWargear}
          isSearchable
          onChange={(option) => setSelectedWargear(option)}
          getOptionLabel={(option) => (`${option.name} - ${option.type}`)}
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
      <div className='flex flex-col text-center'>
        <div>
          <button 
            onClick={() => setEditing(!editing)}
            className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
          >Edit</button>
        </div>
        <div>
          <button 
            onClick={handleCancel}
            className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"  
          >Cancel Editing</button>
        </div>
        {(updatedPoints1 || updatedPoints2) &&
          <div>
            <button 
              onClick={handleSavePoints}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Save Points Update</button>
          </div>
        }
      </div>
      <div className='modelTables'>
        {selectedModel &&
        <div>
          <table className="table-fixed w-full text-sm">
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
                <th>Cost - Description</th>
                <th>Cost 2 - Description 2</th>
              </tr>   
            </thead>
            <tbody>
              <tr className='hover:bg-neutral-600'>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>{ editing ?
                  <input
                    type="text"
                    value={updatedModel && updatedModel.name != null ? updatedModel.name : (selectedModel.name ?? '')}
                    onChange={(e) => handleFieldChange( 'name', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedModel.name }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedModel?.M ?? selectedModel?.M ?? ''}
                      onChange={(e) => handleFieldChange( 'M', e.target.value)}
                      className='text-center bg-neutral-800'
                    /> : selectedModel.M }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedModel?.T ?? selectedModel?.T ?? ''}
                      onChange={(e) => handleFieldChange( 'T', e.target.value)}
                      className='text-center bg-neutral-800'
                    /> : selectedModel.T }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedModel?.W ?? selectedModel?.W ?? ''}
                      onChange={(e) => handleFieldChange( 'W', Number(e.target.value))}
                      className='text-center bg-neutral-800'
                    /> : selectedModel.W }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedModel?.Sv ?? selectedModel?.Sv ?? ''}
                      onChange={(e) => handleFieldChange( 'Sv', e.target.value)}
                      className='text-center bg-neutral-800'
                    /> : selectedModel.Sv }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedModel?.inv_sv ?? selectedModel?.inv_sv ?? ''}
                      onChange={(e) => handleFieldChange( 'inv_sv', e.target.value)}
                      className='text-center bg-neutral-800'
                    /> : selectedModel.inv_sv }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedModel?.Ld ?? selectedModel?.Ld ?? ''}
                      onChange={(e) => handleFieldChange( 'Ld', e.target.value)}
                      className='text-center bg-neutral-800'
                    /> : selectedModel.Ld }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedModel?.OC ?? selectedModel?.OC ?? ''}
                      onChange={(e) => handleFieldChange( 'OC', Number(e.target.value))}
                      className='text-center bg-neutral-800'
                    /> : selectedModel.OC }
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedPoints1?.cost ?? modelPoints1?.cost ?? '-'}
                      onChange={(e) => handlePointsChange1( e.target.value)}
                      className='text-center bg-neutral-800'
                    /> : `${modelPoints1?.description ?? '-'} - ${modelPoints1?.cost ?? '-'}`}
                </td>
                <td className='text-center bg-neutral-700 w-12 sm:w-16 md:w-20 lg:w-24'>
                  { editing ?
                    <input
                      type="text"
                      value={updatedPoints2?.cost ?? modelPoints2?.cost ?? '-'}
                      onChange={(e) => handlePointsChange2( e.target.value)}
                      className='text-center bg-neutral-800'
                    /> : `${modelPoints2?.description ?? ''} - ${modelPoints2?.cost ?? ''}` }
                </td>
              </tr>
            </tbody>
          </table>
          <div className='flex justify-center'>
            <button
              onClick={handleSaveUpdate}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Save Model Update</button>
          </div>
        </div>
        }
        {selectedWargear &&
        <div>
          <table className="table-fixed w-full text-sm">
            <caption className='caption'>Wargear Profile</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Range</th>
                <th>Attacks</th>
                <th>BS/WS</th>
                <th>Strength</th>
                <th>AP</th>
                <th>Damage</th>
                <th>Keywords</th>
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
                    value={(updatedWargear?.attacks ?? selectedWargear.attacks) ?? ''}
                    onChange={(e) => handleWargearChange('attacks', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : selectedWargear.attacks}
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
                <td>{editing ?
                  <input
                    type='text'
                    value={cleanDescription((updatedWargear?.description ?? selectedWargear.description) ?? '')}
                    onChange={(e) => handleWargearChange('description', e.target.value)}
                    className='text-center bg-neutral-800'
                  /> : cleanDescription(selectedWargear.description)}
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button 
              onClick={() => handleUpdateWargear()}
              className="flex mx-auto justify-center text-sm bg-orange-500 hover:bg-orange-600 
            text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2"
            >Save Wargear Update</button>
          </div>
        </div>
        }
        {selectedModel &&
        <div className='flex flex-col mx-auto'>
          <div className='border my-8 w-1/2 mx-auto'></div>
          <h1 className='mx-auto'>Add New Keyword</h1>
          <div className='flex flex-col mx-auto w-1/2 my-4'>
            <input
              type="text"
              value={updatedKeyword ?? ''}
              className='text-center text-black'
              onChange={(e) => setUpdatedKeyword(e.target.value)}
            />
          </div>
          <div className='mx-auto'>
            <button
              onClick={() => addNewKeywordToModelMutation.mutate()}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                          overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                          group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                          focus:ring-pink-200"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Confirm New Keyword</span>
            </button>
          </div>

        </div>
        }
        {keywords.data && (
          <ul className="flex flex-wrap gap-4 justify-center py-4">
            {keywords.data.keyword.map(word => {
              if (word !== '') {
                return (
                  !editing ? <li key={word}>{word}</li> :
                    <div className='text-black flex flex-col' key={word}>
                      <input
                        type='text'
                        value={word}
                        className='text-center'
                        onChange={(event) => handleKeywordChange(event.target.value)}
                      />
                      <button
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                          overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                          group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                          focus:ring-pink-200 my-4"
                        onClick={() => deleteKeywordMutation.mutate({ word, datasheet_id: selectedModel.datasheet_id })}
                      >
                        <span className="relative px-5 py-2.5 w-full transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Delete Keyword</span>
                      </button>
                    </div>
                )
              }
            })}
          </ul>
        )}
        {selectedModel &&
        <div className='flex flex-col justify-center items-center my-4'>
          <div className='border my-12 w-1/2 mx-auto'></div>
          <h1 className='text-lg font-semibold underline'>Abilities</h1>
          <div className='flex w-full flex-col justify-center'>
            <h1 className='flex justify-center mb-4'>Add New Ability</h1>
            <input 
              type='text'
              value={newAbility.name}
              className='w-1/2 mx-auto bg-neutral-600 text-center mb-2'
              placeholder='new ability name'
              onChange={(e) => handleNewAbility('name', e.target.value)}
            />
            <textarea 
              value={newAbility.description}
              onChange={(e) => handleNewAbility('description', e.target.value)}
              placeholder='add new ability description'
              className='flex justify-center mx-auto border border-gray-300 rounded-lg bg-neutral-600 p-2 
                        w-3/4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg'
            />
          </div>
        </div>
        }
        {abilities.data && (
          <div className='text-center'>
            <ul>
              {abilities.data.map(ability => {
                const abilityDes = abilityState?.find(item => ability.name === item.name)?.description ?? ability.description ?? ''
                const cleanedDes = cleanDescription(abilityDes)

                return (
                  <li key={ability.ability_id} className='py-2'>
                    <h2 className='text-2xl underline text-white text-semibold my-2'>{ability.name}</h2>
                    <button 
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                        overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                        group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                        focus:ring-pink-200"
                      onClick={() => deleteAbility(ability)}
                    >
                      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Delete Ability</span>
                    </button>
                    {editing ?
                      <div className='text-white'>
                        <textarea 
                          value={cleanedDes}
                          onChange={(e) => handleDescriptionChange(ability.name, e.target.value, ability.line, selectedModel.datasheet_id, ability.ability_id)}
                          className='border border-gray-300 rounded-lg bg-neutral-600 p-2 
                          w-3/4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg'
                        />
                      </div> : 
                      <p className='mb-4 w-5/6 mx-auto text-lg'>{cleanDescription(ability.description)}</p>
                    }
                  </li>
                )})
              }
            </ul>
          </div>
        )}
        {(abilityState?.length > 0 || newAbility?.name !== '') &&
          <div>
            <button
              onClick={saveAbility}
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded border border-orange-600 m-2
            justify-center flex mx-auto"
            >Save Ability Changes</button>
          </div>
        }
      </div>
      {selectedModel &&
        <div className='flex justify-center my-5'>
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                focus:ring-pink-200 dark:focus:ring-pink-800"
            onClick={() => deleteUnit()}
          ><span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            DELETE SELECTED MODEL</span></button>
        </div>
      }
      {faction &&
      <div className='flex flex-col items-center mb-8'>
        <div className='border-t w-1/2 my-6'></div>
        <h1 className='text-white text-2xl my-4'>Add a New Model</h1>
        <div className='flex flex-row w-full justify-center gap-4'>
          <button 
            onClick={addNewModel}
            className="w-1/6 border border-white relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                  overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                  group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                  focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Add new Model
            </span>
          </button>
          <button 
            onClick={addNewPoints}
            className="w-1/6 border border-white relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                  overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                  group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                  focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Add new points
            </span>
          </button>
        </div>
        <div className='flex flex-col my-8'>
          <div>
            <table className="table-fixed w-full text-sm text-black bg-neutral-600 border border-collapse rounded-xl">
              <thead>
                <tr className='text-white'>
                  <th>Name</th>
                  <th>M</th>
                  <th>T</th>
                  <th>W</th>
                  <th>Sv</th>
                  <th>Inv</th>
                  <th>Ld</th>
                  <th>OC</th>
                  <th>Cost</th>
                  <th>Description</th>
                  <th>Cost2</th>
                  <th>Description2</th>
                  <th>Cost3</th>
                  <th>Description3</th>
                </tr>
              </thead>
              <tbody>
                <tr className='font-semibold'>
                  <td>
                    <input 
                      type='text' 
                      value={newModel?.name ?? ''}
                      onChange={(e) => handleAddNewModel('name', e.target.value)}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModel?.M ?? ''}
                      onChange={(e) => handleAddNewModel('M', e.target.value)}
                      className='text-center bg-neutral-400'
                      placeholder='0'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModel?.T ?? ''}
                      onChange={(e) => handleAddNewModel('T', e.target.value)}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModel?.W ?? ''}
                      onChange={(e) => handleAddNewModel('W', e.target.value === 0 ? 0 : Number(e.target.value))}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModel?.Sv ?? ''}
                      onChange={(e) => handleAddNewModel('Sv', e.target.value)}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModel?.inv_sv ?? ''}
                      onChange={(e) => handleAddNewModel('inv_sv', e.target.value)}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModel?.Ld ?? ''}
                      onChange={(e) => handleAddNewModel('Ld', e.target.value)}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModel?.OC ?? ''}
                      onChange={(e) => handleAddNewModel('OC', e.target.value === 0 ? 0 : Number(e.target.value))}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModelPoints?.cost ?? ''}
                      onChange={(e) => handleAddNewModelPoints('cost', e.target.value === 0 ? 0 : Number(e.target.value))}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='text' 
                      value={newModelPoints?.description ?? ''}
                      onChange={(e) => handleAddNewModelPoints('description', e.target.value)}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModelPoints?.cost2 ?? ''}
                      onChange={(e) => handleAddNewModelPoints('cost2', e.target.value === 0 ? 0 : Number(e.target.value))}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='text' 
                      value={newModelPoints?.description2 ?? ''}
                      onChange={(e) => handleAddNewModelPoints('description2', e.target.value)}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='number' 
                      value={newModelPoints?.cost3 ?? ''}
                      onChange={(e) => handleAddNewModelPoints('cost3', e.target.value === 0 ? 0 : Number(e.target.value))}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                  <td>
                    <input 
                      type='text' 
                      value={newModelPoints?.description3 ?? ''}
                      onChange={(e) => handleAddNewModelPoints('description3', e.target.value)}
                      className='text-center bg-neutral-400'
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='border mt-12 w-1/2 mx-auto'></div>
          </div>
        </div>
      </div>
      }
      {getEnhancements.data &&
      <div className='flex flex-col justify-center text-center'>
        <h1 className='text-2xl text-white my-2'>Enhancements</h1>
        <table className='table-fixed w-full border-collapse border border-gray-400 rounded-xl'>

          <thead>
            <tr className='bg-neutral-700 text-white'>
              <th className='border border-gry-400'>Name</th>
              <th className='border border-gray-400'>Points Cost</th>
              <th className='border border-gray-400'>Description</th>
              <th className='border border-gray-400'>Detachment</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <input 
                  type="text"
                  onChange={(e) => handleNewEnhancement('name', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="number"
                  onChange={(e) => handleNewEnhancement('cost', e.target.value)}
                />
              </td>
              <td>
                <textarea 
                  onChange={(e) => handleNewEnhancement('description', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text"
                  onChange={(e) => handleNewEnhancement('detachment', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className=''>
                <button
                  onClick={() => addNewEnhancement()}
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                      overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                      group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                      focus:ring-pink-200 dark:focus:ring-pink-800 my-3"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Add New Enhancement
                  </span>
                </button>
              </td>
            </tr>
            {getEnhancements.data.sort((a, b) => a.name.localeCompare(b.name)).map(item =>
              <tr key={item.id} className='bg-neutral-700 text-white border border-gray-400'>
                <td className='border border-gray-400'>
                  {item.name}
                  <div>
                    <button 
                      onClick={() => saveEnhanceChanges(item.id)}
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                      overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                      group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                      focus:ring-pink-200 dark:focus:ring-pink-800 my-3"
                    >
                      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Save Enhancement Changes
                      </span>
                    </button> 
                  </div>
                </td>

                {editing ? 
                  <td><input
                    type='text'
                    value={updatedEnhancement?.find(e => e.id === item.id)?.cost ?? item.cost ?? ''}
                    onChange={(e) => enhancementCostChange(item, Number(e.target.value))}
                    className="w-full bg-neutral-800 text-white px-2 py-1 border border-gray-500 rounded"
                  /></td> :
                  <td className='border border-gray-400'>{item.cost}</td>
                }
                {editing ?
                  <td><textarea
                    value={cleanDescription(updatedEnhancement?.find(e => e.id === item.id)?.description ?? item.description ?? '')}
                    onChange={(e) => enhancementDescriptionChange(item, e.target.value)}
                    className="w-full bg-neutral-800 text-white px-2 py-1 border border-gray-500 rounded min-w-[400px] min-h-[200px]"                  
                  /></td> :
                  <td>{cleanDescription(item.description)}</td>
                }
                <td>
                  {item.detachment}
                  <div className='m-2 p-2'>
                    <button 
                      onClick={() => deleteEnhancement(item.id)}
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
                      overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400
                      group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none 
                      focus:ring-pink-200 dark:focus:ring-pink-800 my-3"
                    >
                      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Delete Enhancement
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      }
    </div>
  )
}

Admin.propTypes = {
  user: PropTypes.object
}

export default Admin