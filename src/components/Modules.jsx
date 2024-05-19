import React, { useState } from "react";
import ModuleItem from "./ModuleItem";
import { useDrop } from "react-dnd";

const Modules = ({
  modules,
  addModule,
  updateModule,
  deleteModule,
  moveModule,
  addResourceToModule,
  updateResourceInModule,
  deleteResourceFromModule,
  moveResource,
}) => {
  const [newModuleName, setNewModuleName] = useState("");

  const [, drop] = useDrop({
    accept: "MODULE",
  });

  const handleAddModule = () => {
    if (newModuleName.trim() === "") {
      alert("Module name cannot be empty");
      return;
    }
    addModule(newModuleName);
    setNewModuleName("");
  };

  return (
    <ul className="list-group mt-4" ref={drop}>
      {modules.map((module, index) => (
        <ModuleItem
          key={module.id}
          module={module}
          index={index}
          updateModule={updateModule}
          deleteModule={deleteModule}
          addResourceToModule={addResourceToModule}
          updateResourceInModule={updateResourceInModule}
          deleteResourceFromModule={deleteResourceFromModule}
          moveModule={moveModule}
          moveResource={moveResource}
        />
      ))}
      <li className="list-group-item">
        <input
          type="text"
          className="form-control"
          placeholder="Module Name"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddModule}>
          Add Module
        </button>
      </li>
    </ul>
  );
};

export default Modules;
