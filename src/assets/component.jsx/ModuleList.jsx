import React, { useState } from "react";
import "./ModuleList.css";

const ModuleList = () => {
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState("");

  const addModule = () => {
    if (newModuleName.trim() === "") {
      alert("Module name cannot be empty");
      return;
    }

    setModules([
      ...modules,
      { id: Date.now(), name: newModuleName, isEditing: false },
    ]);
    setNewModuleName("");
  };

  const deleteModule = (id) => {
    setModules(modules.filter((module) => module.id !== id));
  };

  const toggleEditing = (id) => {
    setModules(
      modules.map((module) =>
        module.id === id ? { ...module, isEditing: !module.isEditing } : module
      )
    );
  };

  const updateModuleName = (id, newName) => {
    setModules(
      modules.map((module) =>
        module.id === id ? { ...module, name: newName } : module
      )
    );
  };

  return (
    <div className="container">
      <h1>Course Modules</h1>
      <div className="input-container">
        <input
          type="text"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="New module name"
        />
        <button onClick={addModule}>Add Module</button>
      </div>
      <ul className="module-list">
        {modules.map((module) => (
          <li key={module.id} className="module-item">
            {module.isEditing ? (
              <input
                type="text"
                value={module.name}
                onChange={(e) => updateModuleName(module.id, e.target.value)}
              />
            ) : (
              <span>{module.name}</span>
            )}
            <button onClick={() => toggleEditing(module.id)}>
              {module.isEditing ? "Save" : "Edit"}
            </button>
            <button onClick={() => deleteModule(module.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleList;
