import React, { useState, useRef } from 'react';
import ResourceList from './ResourceList';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'MODULE';

const ModuleItem = ({
  module,
  index,
  updateModule,
  deleteModule,
  addResourceToModule,
  updateResourceInModule,
  deleteResourceFromModule,
  moveModule,
  moveResource,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [moduleName, setModuleName] = useState(module.name);
  const [newResourceName, setNewResourceName] = useState("");
  const [newResourceType, setNewResourceType] = useState("link");
  const [newResourceLink, setNewResourceLink] = useState("");
  const [newResourceFile, setNewResourceFile] = useState(null);

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveModule(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleUpdate = () => {
    updateModule(module.id, moduleName);
    setIsEditing(false);
  };

  const addResource = () => {
    if (newResourceName.trim() === "") {
      alert("Resource name cannot be empty");
      return;
    }

    const newResource = {
      id: Date.now(),
      name: newResourceName,
      type: newResourceType,
      link: newResourceType === "link" ? newResourceLink : null,
      file: newResourceType === "file" ? newResourceFile : null,
    };

    addResourceToModule(module.id, newResource);
    setNewResourceName("");
    setNewResourceLink("");
    setNewResourceFile(null);
  };

  const handleFileChange = (e) => {
    setNewResourceFile(e.target.files[0]);
  };

  return (
    <li
      ref={ref}
      className={`list-group-item d-flex flex-column ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="d-flex justify-content-between align-items-center">
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
          />
        ) : (
          <h5>{module.name}</h5>
        )}
        <div>
          {isEditing ? (
            <button className="btn btn-success me-2" onClick={handleUpdate}>
              Save
            </button>
          ) : (
            <button
              className="btn btn-secondary me-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={() => deleteModule(module.id)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-3">
        <h6>Add Resource</h6>
        <input
          type="text"
          className="form-control"
          placeholder="Resource Name"
          value={newResourceName}
          onChange={(e) => setNewResourceName(e.target.value)}
        />
        <select
          className="form-select mt-2"
          value={newResourceType}
          onChange={(e) => setNewResourceType(e.target.value)}
        >
          <option value="link">Link</option>
          <option value="file">File</option>
        </select>
        {newResourceType === "link" && (
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Resource Link"
            value={newResourceLink}
            onChange={(e) => setNewResourceLink(e.target.value)}
          />
        )}
        {newResourceType === "file" && (
          <input
            type="file"
            className="form-control mt-2"
            onChange={handleFileChange}
          />
        )}
        <button className="btn btn-primary mt-2" onClick={addResource}>
          Add Resource
        </button>
      </div>
      <ResourceList
        moduleId={module.id}
        resources={module.resources}
        updateResourceInModule={updateResourceInModule}
        deleteResourceFromModule={deleteResourceFromModule}
        moveResource={moveResource}
      />
    </li>
  );
};

export default ModuleItem;

