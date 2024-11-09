import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import * as React from "react";

const CreatingTicket = () => {
  const [type, setType] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };
  const [event, setEvent] = React.useState("");

  const handleChangeEvent = (event: SelectChangeEvent) => {
    setEvent(event.target.value as string);
  };
  return (
    <Box
      className="flex flex-col space-y-4"
      sx={{ flexGrow: 1, margin: "100px", maxWidth: 500 }}
    >
      <FormControl variant="standard">
        <InputLabel id="demo-simple-select-standard-label">
          Pasirinkite renginį
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={event}
          onChange={handleChangeEvent}
          label="Pasirinkite renginį"
        >
          <MenuItem value={"Standart"}>Renginys 1</MenuItem>
          <MenuItem value={"VIP"}>Renginys 2</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard">
        <InputLabel id="demo-simple-select-standard-label">
          Pasirinkite bilietų tipą
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={type}
          onChange={handleChange}
          label="Bilieto tipas"
        >
          <MenuItem value={"Standart"}>Standartinis</MenuItem>
          <MenuItem value={"VIP"}>V.I.P</MenuItem>
        </Select>
      </FormControl>
      <TextField id="ticket-count" label="Bilietų kiekis" variant="standard" />
      <TextField id="ticket-price" label="Bilieto kaina" variant="standard" />
      <Button color="success" variant="contained" disableElevation>
        Sukurti
      </Button>
    </Box>
  );
};
export default CreatingTicket;
