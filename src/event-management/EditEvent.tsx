import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import CreatingTicket from "../ticket-buying/CreatingTicket";
import dayjs from "dayjs";

export default function CreateEvent() {
  const [enableTicketCreation, setEnableTicketCreation] =
    useState<boolean>(true);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    if (checked) {
      setEnableTicketCreation(true);
    } else {
      setEnableTicketCreation(false);
    }
  };

  return (
    <Container className="h-full w-min mt-40">
      <Box
        className="flex flex-col items-center justify-center"
        sx={{ flexGrow: 0, height: "100%" }}
      >
        <div className="flex space-x-10">
          <div className="max-w-[32rem] flex justify-center flex-col space-y-4">
            <div className="flex space-x-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="w-full"
                  label="Pradžia"
                  ampm={false}
                  value={dayjs()}
                />
                <DateTimePicker
                  className="w-full"
                  label="Pabaiga"
                  ampm={false}
                  value={dayjs()}
                />
              </LocalizationProvider>
            </div>
            <TextField
              id="available-space"
              label="Vietų skaičius"
              variant="standard"
              value="50"
            />
            <FormControlLabel
              control={
                <Checkbox onChange={handleCheckboxChange} defaultChecked />
              }
              label="Mokamas"
            />
            <div className={`${enableTicketCreation ? "" : "hidden"}`}>
              <CreatingTicket />
            </div>
          </div>
          <div>
            {/* <iframe
                className=" h-[35rem] w-[40rem]"
                src="/LocationPicker.html"
                title="Embedded HTML"
              ></iframe> */}
          </div>
        </div>
        <Button sx={{ marginTop: "1rem" }} variant="contained" disableElevation>
          Atnaujinti
        </Button>
      </Box>
    </Container>
  );
}
