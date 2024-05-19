import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModuleList from './components/ModuleList';

const App = () => {
  const [modules, setModules] = useState([]);

  const addModule = (name) => {
    setModules([...modules, { id: Date.now(), name, resources: [] }]);
  };

  const updateModule = (id, name) => {
    setModules(
      modules.map((module) => (module.id === id ? { ...module, name } : module))
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

  const updateResourceInModule = (moduleId, resourceId, updatedResource) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              resources: module.resources.map((resource) =>
                resource.id === resourceId
                  ? { ...resource, ...updatedResource }
                  : resource
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
    const dragModule = modules[dragIndex];
    const newModules = [...modules];
    newModules.splice(dragIndex, 1);
    newModules.splice(hoverIndex, 0, dragModule);
    setModules(newModules);
  };

  const moveResource = (
    sourceModuleId,
    targetModuleId,
    sourceIndex,
    targetIndex
  ) => {
    const sourceModuleIndex = modules.findIndex(
      (module) => module.id === sourceModuleId
    );
    const targetModuleIndex = modules.findIndex(
      (module) => module.id === targetModuleId
    );
    const newModules = [...modules];

    if (sourceModuleId === targetModuleId) {
      const sourceModule = newModules[sourceModuleIndex];
      const [movedResource] = sourceModule.resources.splice(sourceIndex, 1);
      sourceModule.resources.splice(targetIndex, 0, movedResource);
    } else {
      const [movedResource] = newModules[sourceModuleIndex].resources.splice(
        sourceIndex,
        1
      );
      newModules[targetModuleIndex].resources.splice(
        targetIndex,
        0,
        movedResource
      );
    }

    setModules(newModules);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Module Manager</h1>
      <ModuleList
        modules={modules}
        addModule={addModule}
        updateModule={updateModule}
        deleteModule={deleteModule}
        addResourceToModule={addResourceToModule}
        updateResourceInModule={updateResourceInModule}
        deleteResourceFromModule={deleteResourceFromModule}
        moveModule={moveModule}
        moveResource={moveResource}
      />
    </div>
  );
};

export default App;

