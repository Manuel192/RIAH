import React, { useState } from "react";

// 🌳 Datos Iniciales
const initialTree = {
  name: "Raíz",
  children: [
    {
      name: "Carpeta 1",
      children: [
        { name: "Archivo 1.1" },
        {
          name: "Carpeta 1.2",
          children: [
            { name: "Archivo 1.2.1" },
            { name: "Archivo 1.2.2" },
          ],
        },
      ],
    },
    {
      name: "Carpeta 2",
      children: [{ name: "Archivo 2.1" }],
    },
  ],
};

// 🌳 Componente Recursivo
const TreeNode = ({ node, onRename, onAddChild }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);

  // 📌 Maneja la edición del nombre
  const handleRename = () => {
    if (newName.trim()) {
      onRename(node, newName);
      setIsEditing(false);
    }
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      {/* 📂 Botón para expandir/cerrar */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <span
          style={{ cursor: "pointer", fontWeight: "bold", color: "blue" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {node.children ? (isOpen ? "📂" : "📁") : "📄"}
        </span>

        {/* 📌 Input para renombrar */}
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>{node.name}</span>
        )}

        {/* ➕ Botón para añadir nuevo hijo */}
        {node.children && (
          <button onClick={() => onAddChild(node)} style={{ marginLeft: "5px" }}>
            ➕
          </button>
        )}
      </div>

      {/* 📌 Renderizado Recursivo de Hijos */}
      {isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} onRename={onRename} onAddChild={onAddChild} />
          ))}
        </div>
      )}
    </div>
  );
};

// 🌳 Componente Principal
const TreeView = () => {
  const [treeData, setTreeData] = useState(initialTree);

  // 📌 Función para renombrar nodos
  const renameNode = (node, newName) => {
    const updateTree = (currentNode) => {
      if (currentNode === node) {
        return { ...currentNode, name: newName };
      }
      if (currentNode.children) {
        return {
          ...currentNode,
          children: currentNode.children.map(updateTree),
        };
      }
      return currentNode;
    };
    setTreeData(updateTree(treeData));
  };

  // 📌 Función para agregar un nuevo nodo hijo
  const addChildNode = (node) => {
    const updateTree = (currentNode) => {
      if (currentNode === node) {
        return {
          ...currentNode,
          children: [...(currentNode.children || []), { name: "Nuevo Nodo" }],
        };
      }
      if (currentNode.children) {
        return {
          ...currentNode,
          children: currentNode.children.map(updateTree),
        };
      }
      return currentNode;
    };
    setTreeData(updateTree(treeData));
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "10px" }}>
      <h2>Árbol de Datos</h2>
      <TreeNode node={treeData} onRename={renameNode} onAddChild={addChildNode} />
    </div>
  );
};

export default TreeView;