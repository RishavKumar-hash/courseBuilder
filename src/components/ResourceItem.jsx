import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "RESOURCE";

const ResourceItem = ({
  moduleId,
  resource,
  index,
  updateResourceInModule,
  deleteResourceFromModule,
  moveResource,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [resourceName, setResourceName] = useState(resource.name);
  const [resourceType, setResourceType] = useState(resource.type || "link");
  const [resourceLink, setResourceLink] = useState(resource.link || "");
  const [resourceFile, setResourceFile] = useState(null);
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (item.moduleId === moduleId && dragIndex === hoverIndex) {
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
      moveResource(item.moduleId, moduleId, dragIndex, hoverIndex);
      item.index = hoverIndex;
      item.moduleId = moduleId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, moduleId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleUpdate = () => {
    updateResourceInModule(moduleId, resource.id, {
      ...resource,
      name: resourceName,
      type: resourceType,
      link: resourceType === "link" ? resourceLink : null,
      file: resourceType === "file" ? resourceFile : null,
    });
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    setResourceFile(e.target.files[0]);
  };

  return (
    <li
      ref={ref}
      className={`list-group-item d-flex justify-content-between align-items-center ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {isEditing ? (
        <div>
          <input
            type="text"
            className="form-control"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="Resource Name"
          />
          <select
            className="form-select mt-2"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
          >
            <option value="link">Link</option>
            <option value="file">File</option>
          </select>
          {resourceType === "link" && (
            <input
              type="text"
              className="form-control mt-2"
              value={resourceLink}
              onChange={(e) => setResourceLink(e.target.value)}
              placeholder="Resource Link"
            />
          )}
          {resourceType === "file" && (
            <input
              type="file"
              className="form-control mt-2"
              onChange={handleFileChange}
            />
          )}
          <button className="btn btn-success mt-2" onClick={handleUpdate}>
            Save
          </button>
        </div>
      ) : (
        <div>
          <span>{resource.name}</span>
          {resource.type === "link" && (
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              Open Link
            </a>
          )}
          {resource.type === "file" && (
            <span>{resource.file?.name || "No file uploaded"}</span>
          )}
        </div>
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
          onClick={() => deleteResourceFromModule(moduleId, resource.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default ResourceItem;
