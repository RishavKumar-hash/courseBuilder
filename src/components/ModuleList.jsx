import React, { useState } from "react";
import ModuleItem from "./ModuleItem";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "bootstrap/dist/css/bootstrap.min.css";

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
      { id: Date.now(), name: newModuleName, resources: [] },
    ]);
    setNewModuleName("");
  };

  const updateModule = (id, newName) => {
    setModules(
      modules.map((module) =>
        module.id === id ? { ...module, name: newName } : module
      )
    );
  };

  const deleteModule = (id) => {
    setModules(modules.filter((module) => module.id !== id));
  };

  const addResourceToModule = (moduleId, resource) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, resources: [...module.resources, resource] }
          : module
      )
    );
  };

  const updateResourceInModule = (moduleId, resourceId, newResource) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              resources: module.resources.map((resource) =>
                resource.id === resourceId ? newResource : resource
              ),
            }
          : module
      )
    );
  };

  const deleteResourceFromModule = (moduleId, resourceId) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              resources: module.resources.filter(
                (resource) => resource.id !== resourceId
              ),
            }
          : module
      )
    );
  };

  const moveModule = (dragIndex, hoverIndex) => {
    const draggedModule = modules[dragIndex];
    const updatedModules = [...modules];
    updatedModules.splice(dragIndex, 1);
    updatedModules.splice(hoverIndex, 0, draggedModule);
    setModules(updatedModules);
  };

  const moveResource = (moduleId, dragIndex, hoverIndex) => {
    const module = modules.find((m) => m.id === moduleId);
    const draggedResource = module.resources[dragIndex];
    const updatedResources = [...module.resources];
    updatedResources.splice(dragIndex, 1);
    updatedResources.splice(hoverIndex, 0, draggedResource);

    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...module, resources: updatedResources } : m
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container my-4">
        <h1 className="text-center">Course Modules</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            placeholder="New module name"
          />
          <button className="btn btn-primary" onClick={addModule}>
            Add Module
          </button>
        </div>
        <ul className="list-group">
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
        </ul>
      </div>
    </DndProvider>
  );
};

export default ModuleList;
