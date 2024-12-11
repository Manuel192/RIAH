"use client"
import React, { useState } from "react";
import { AreaChart, BarChart, Card, Title } from "@tremor/react";
import "../App.css"; // Archivo CSS separado

const UsuarioDetalle = () => {
  const [selectedGraph, setSelectedGraph] = useState("G. Lineal");
  const [graphData, setGraphData] = useState([
    { tiempo: "Ene", valor: 10 },
    { tiempo: "Feb", valor: 20 },
    { tiempo: "Mar", valor: 30 },
  ]);

  return (
    <div className="usuario-detalle-container">
      {/* Título */}
      <h1 className="titulo">Juan Pérez</h1>

      <div className="contenedor-secciones">
        {/* Sección Izquierda */}
        <div className="seccion-derecha">
          <Card>
            <Title>Gráfico del Usuario</Title>
            {selectedGraph === "G. Lineal" ? (
                <AreaChart
                className="h-80"
                data={graphData}
                index="tiempo"
                categories={["valor"]}
                onValueChange={(v) => console.log(v)}
                valueFormatter={(number) =>
                    `${number.toString()}`
                  }
                xAxisLabel="Month"
                yAxisLabel="Spend Category"
                fill="solid"
              />
            ) : (
                <BarChart
                className="mt-12 hidden h-72 sm:block"
                data={graphData}
                index="tiempo"
                categories={['valor']}
                yAxisWidth={70}
                showLegend={false}
              />  
            )}
          </Card>
        </div>
        <div className="seccion-izquierda">
          <div className="campo">
            <h3>JUEGO</h3>
            <select className="dropdown">
              <option value="Juego 1">Juego 1</option>
              <option value="Juego 2">Juego 2</option>
            </select>
          </div>

          <div className="campo">
            <h3>DATO</h3>
            <select className="dropdown">
              <option value="Dato 1">Dato 1</option>
              <option value="Dato 2">Dato 2</option>
            </select>
          </div>

          <div className="campo">
            <h3>GRÁFICO</h3>
            <select
              className="dropdown"
              value={selectedGraph}
              onChange={(e) => setSelectedGraph(e.target.value)}
            >
              <option value="G. Lineal">G. Lineal</option>
              <option value="G. Barras">G. Barras</option>
            </select>
          </div>
        </div>

        {/* Sección Derecha */}
        
      </div>
    </div>
  );
};

export default UsuarioDetalle;
