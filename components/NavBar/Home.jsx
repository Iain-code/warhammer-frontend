import React from "react";
import FactionForm from "../FactionForm/FactionForm";
import ModelForm from "../Models/ModelForm";
import Toggle from "../NavBar/Toggle";
import { useState } from 'react'

const Home = () => {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <FactionForm setShowForm={setShowForm}/>
      <Toggle showForm={showForm}>
        <ModelForm />
      </Toggle>
    </div>
  );
};

export default Home;
