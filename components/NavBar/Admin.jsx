import React, { useState } from 'react'
import Select from 'react-select'
import modelService from '../../requests/models'
import './admin.css'
import factionList from '../FactionForm/FactionList'
import PropTypes from 'prop-types'
import { useMutation } from '@tanstack/react-query'

const Admin = ({ user }) => {
  const [models, setModels] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [updatedModel, setUpdatedModel] = useState(null)
  const [wargear, setWargear] = useState(null)
  const [selectedWargear, setSelectedWargear] = useState(null)
  const [updatedWargear, setUpdatedWargear] = useState(null)
  const [editing, setEditing] = useState(false)

  const getModelsMutation = useMutation({
    mutationFn: async (faction) => await modelService.getModelsForFaction(faction),
    onSuccess: (response) => setModels(response),
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
    setSelectedModel(model)
    getWargearMutation.mutate(model.datasheet_id)
  }

  const handleFieldChange = (field, value) => {
    if (updatedModel) {
      setUpdatedModel({ ...updatedModel, [field]: value })
    } else {
      setUpdatedModel({ ...selectedModel, [field]: value })
    }
  }

  const handleWargearChange = (field, value) => {
    if (updatedWargear) {
      setUpdatedWargear({ ...updatedWargear, [field]: value })
    } else {
      setUpdatedWargear({ ...selectedWargear, [field]: value })
    }
    console.log('updated wargear', updatedWargear)
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

  return (
    <div>
      <div className='adminAuth'>
        <Select
          className="adminSelect"
          placeholder="Select a faction"
          options={factionList}
          isSearchable
          onChange={(option) => getModelsMutation.mutate(option.value)}
        />
        <Select 
          placeholder="Select a model"
          options={models}
          isSearchable
          onChange={(model) => handleModelChoice(model)}
          getOptionLabel={(option) => (option.name)}
        />
        <Select
          placeholder="Select Wargear"
          options={wargear}
          isSearchable
          onChange={(option) => setSelectedWargear(option)}
          getOptionLabel={(option) => (option.name)}
        />
      </div>
      <div>
        <button onClick={() => setEditing(!editing)}>Edit</button>
        <button onClick={handleCancel}>Cancel</button>
        <br />
        <button onClick={handleSaveUpdate}>Save Model Update</button>
      </div>
      <div className='modelTables'>
        {selectedModel &&
      <table>
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
          </tr>   
        </thead>
        <tbody>
          <tr>
            <td>{ editing ?
              <input
                type="text"
                value={updatedModel ? updatedModel.name : selectedModel.name}
                onChange={(e) => handleFieldChange( 'name', e.target.value)}
              /> : selectedModel.name }
            </td>
            <td>{ editing ?
              <input
                type="text"
                value={updatedModel ? updatedModel.M : selectedModel.M}
                onChange={(e) => handleFieldChange( 'M', e.target.value)}
              /> : selectedModel.M }
            </td>
            <td>{ editing ?
              <input
                type="text"
                value={updatedModel ? updatedModel.T : selectedModel.T}
                onChange={(e) => handleFieldChange( 'T', e.target.value)}
              /> : selectedModel.T }
            </td>
            <td>{ editing ?
              <input
                type="text"
                value={updatedModel ? updatedModel.W : selectedModel.W}
                onChange={(e) => handleFieldChange( 'W', e.target.value)}
              /> : selectedModel.W }
            </td>
            <td>{ editing ?
              <input
                type="text"
                value={updatedModel ? updatedModel.Sv : selectedModel.Sv}
                onChange={(e) => handleFieldChange( 'Sv', e.target.value)}
              /> : selectedModel.Sv }
            </td>
            <td>{ editing ?
              <input
                type="text"
                value={updatedModel ? updatedModel.inv_sv : selectedModel.inv_sv}
                onChange={(e) => handleFieldChange( 'inv_sv', e.target.value)}
              /> : selectedModel.inv_sv }
            </td>
            <td>{ editing ?
              <input
                type="text"
                value={updatedModel ? updatedModel.Ld : selectedModel.Ld}
                onChange={(e) => handleFieldChange( 'Ld', e.target.value)}
              /> : selectedModel.Ld }
            </td>
            <td>{ editing ?
              <input
                type="text"
                value={updatedModel ? updatedModel.OC : selectedModel.OC}
                onChange={(e) => handleFieldChange( 'OC', e.target.value)}
              /> : selectedModel.OC }
            </td>
          </tr>
        </tbody>
      </table>
        }
        {console.log('selected wargear:', selectedWargear)}
        {selectedWargear &&
        <div>
          <button onClick={handleUpdateWargear}>Save Wargear Update</button>
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
                  /> : selectedWargear.name}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.type ?? selectedWargear.type) ?? ''}
                    onChange={(e) => handleWargearChange('type', e.target.value)}
                  /> : selectedWargear.type}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.range ?? selectedWargear.range) ?? ''}
                    onChange={(e) => handleWargearChange('range', e.target.value)}
                  /> : selectedWargear.range}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.BS_WS ?? selectedWargear.BS_WS) ?? ''}
                    onChange={(e) => handleWargearChange('BS_WS', e.target.value)}
                  /> : selectedWargear.BS_WS}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.attacks ?? selectedWargear.attacks) ?? ''}
                    onChange={(e) => handleWargearChange('attacks', e.target.value)}
                  /> : selectedWargear.attacks}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.strength ?? selectedWargear.strength) ?? ''}
                    onChange={(e) => handleWargearChange('strength', e.target.value)}
                  /> : selectedWargear.strength}
                </td>
                <td>{editing ? 
                  <input 
                    type='text' 
                    value={(updatedWargear?.AP ?? selectedWargear.AP) ?? '0'}
                    onChange={(e) => handleWargearChange('AP', e.target.value)}
                  /> : selectedWargear.AP}
                </td>
                <td>{editing ?
                  <input
                    type='text'
                    value={(updatedWargear?.damage ?? selectedWargear.damage) ?? ''}
                    onChange={(e) => handleWargearChange('damage', e.target.value)}
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