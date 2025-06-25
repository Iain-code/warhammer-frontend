import React from "react";
import FactionForm from "./FactionForm";
import ModelForm from "./ModelForm";
import Toggle from "../Models/Toggle";
import { useState } from 'react'

const Home = () => {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <FactionForm visibility={setShowForm}/>
      <Toggle showForm={showForm}>
        <ModelForm />
      </Toggle>
    </div>
  );
};

export default Home;
