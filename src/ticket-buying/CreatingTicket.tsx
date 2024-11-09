import { Checkbox, FormControlLabel } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const CreatingTicket = () => {
  const [enableVIPTickets, setEnableVIPTickets] = useState<boolean>(false);
  const [enableStandartTickets, setEnableStandartTickets] =
    useState<boolean>(false);

  const handleVIPCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;

    if (checked) {
      setEnableVIPTickets(true);
    } else {
      setEnableVIPTickets(false);
    }
  };

  const handleStandartCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;

    if (checked) {
      setEnableStandartTickets(true);
    } else {
      setEnableStandartTickets(false);
    }
  };

  return (
    <Box
      className="flex flex-col space-y-4"
      sx={{ flexGrow: 1, maxWidth: 500 }}
    >
      <div className="flex w-full items-center space-x-4 justify-between">
        <FormControlLabel
          control={<Checkbox onChange={handleVIPCheckboxChange} />}
          label="V.I.P"
          className="pr-[3.3rem]"
        />
        <TextField
          className="w-max"
          id="ticket-count-VIP"
          label="Bilietų kiekis"
          variant="standard"
          disabled={!enableVIPTickets}
        />
        <TextField
          id="ticket-price-VIP"
          label="Bilieto kaina"
          variant="standard"
          disabled={!enableVIPTickets}
        />
      </div>
      <div className="flex w-full items-center space-x-4 justify-between">
        <FormControlLabel
          control={<Checkbox onChange={handleStandartCheckboxChange} />}
          label="Standartinis"
        />
        <TextField
          className="w-max"
          id="ticket-count"
          label="Bilietų kiekis"
          variant="standard"
          disabled={!enableStandartTickets}
        />
        <TextField
          id="ticket-price"
          label="Bilieto kaina"
          variant="standard"
          disabled={!enableStandartTickets}
        />
      </div>
    </Box>
  );
};
export default CreatingTicket;
