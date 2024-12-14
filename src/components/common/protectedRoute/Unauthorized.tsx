import React from "react";

const Unauthorized: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Neautorizuota prieiga</h1>
      <p>Jūs neturite teisės prieiti prie šio puslapio.</p>
    </div>
  );
};

export default Unauthorized;
