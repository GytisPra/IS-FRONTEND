import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import CreatingTicket from "../ticket-buying/CreatingTicket";

export default function CreateEvent() {
  const [enableTicketCreation, setEnableTicketCreation] =
    useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    if (checked) {
      setEnableTicketCreation(true);
    } else {
      setEnableTicketCreation(false);
    }
  };

  return (
    <>
      <Box
        className="flex w-full flex-col items-center"
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
                />
                <DateTimePicker
                  className="w-full"
                  label="Pabaiga"
                  ampm={false}
                />
              </LocalizationProvider>
            </div>
            <TextField
              id="available-space"
              label="Vietų skaičius"
              variant="standard"
            />
            <FormControlLabel
              control={<Checkbox onChange={handleCheckboxChange} />}
              label="Mokamas"
            />
            <div className={`${enableTicketCreation ? "" : "hidden"}`}>
              <CreatingTicket />
            </div>
          </div>
          <div>
            <iframe
              className=" h-[35rem] w-[40rem]"
              src="/LocationPicker.html"
              title="Embedded HTML"
            ></iframe>
          </div>
        </div>
      </Box>
      <Button
        className="top-0 fixed bottom-0 left-0 w-full bg-gray-800 text-white"
        color="success"
        variant="contained"
        disableElevation
      >
        Sukurti
      </Button>
    </>
  );
}
