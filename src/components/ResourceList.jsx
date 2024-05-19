import React from "react";
import ResourceItem from "./ResourceItem";
import { useDrop } from "react-dnd";

const ItemType = "RESOURCE";

const ResourceList = ({
  moduleId,
  resources,
  updateResourceInModule,
  deleteResourceFromModule,
  moveResource,
}) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        moveResource(item.moduleId, moduleId, item.index);
        item.moduleId = moduleId;
      }
    },
  });

  return (
    <ul ref={drop} className="list-group mt-3">
      {resources.map((resource, index) => (
        <ResourceItem
          key={resource.id}
          moduleId={moduleId}
          resource={resource}
          index={index}
          updateResourceInModule={updateResourceInModule}
          deleteResourceFromModule={deleteResourceFromModule}
          moveResource={moveResource}
        />
      ))}
    </ul>
  );
};

export default ResourceList;
