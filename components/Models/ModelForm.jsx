import React, { useEffect } from 'react'
import { useContext } from 'react'
import Select from 'react-select';
import AttackerContext from '../../attackerContext';
import DefenderContext from '../../defenderContext';
import ModelContext from '../../modelContext'
import ModelWargear from '../ModelWargear'


const ModelForm = () => {
  const [attacker, attackerDispatch] = useContext(AttackerContext)
  const [defender, defenderDispatch] = useContext(DefenderContext)
  const [model, modelDispatch] = useContext(ModelContext)

  const handleAttackerModel = (modelObject) => {
    modelDispatch({
      type: 'attacker',
      payload: modelObject
    })
  }

  const handleDefenderModel = (modelObject) => {
    modelDispatch({
      type: 'defender',
      payload: modelObject
    })
  }

  const reset = () => {
    attackerDispatch({
      type: 'remove',
      payload: null
    })
    defenderDispatch({
      type: 'remove',
      payload: null
    })
    modelDispatch({
      type: 'remove'
    })
  }

  useEffect(() => {
    console.log('model:', model)
  }, [model])

  return (
    <div>
      <div className='modelForm'>
        <Select
          className='modelForm-select'
          options={attacker}
          onChange={(model) => handleAttackerModel(model)}
          placeholder="Select an attacker..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
          maxMenuHeight={200} 
        />
        <form onSubmit={reset}>
          <button className='reset' type='submit'>Reset</button>
        </form>
        <Select
          className='modelForm-select'
          options={defender}
          onChange={(model) => handleDefenderModel(model)}
          placeholder="Select a defender..."
          isSearchable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.datasheet_id}
          maxMenuHeight={200} 
        />
      </div>
      <div>
        {model && model.attack && model.defence && <ModelWargear /> }
      </div>
    </div>
  )
}

export default ModelForm