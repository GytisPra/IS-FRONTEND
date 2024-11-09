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
import { useEffect, useState } from "react";

export default function CreateEvent() {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("./LocationPicker.html")
      .then((response) => response.text())
      .then((data) => setHtmlContent(data));
  }, []);

  console.log(htmlContent);

  return (
    <>
      <Box
        className="flex w-full flex-col h-min  items-center"
        sx={{ flexGrow: 0 }}
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
              control={<Checkbox defaultChecked />}
              label="Mokamas"
            />
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
