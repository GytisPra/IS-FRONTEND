import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CreateEvent from "./CreateEvent";
import { IEvent } from "../organizers";
import { Button, Container } from "@mui/material";
import EventRowCard from "../components/common/eventRowCard";
import { useNavigate } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const eventsFromBE: IEvent[] = [
  {
    id: 1,
    name: "Renginys 1",
    description: "Aprašymas 1",
    startTime: new Date(),
    attendees: ["Dalyvis 1", "Dalyvis 2"],
    volunteers: [],
    volunteerRequests: [
      { id: 3, email: "3@", name: "Savanoris 3" },
      { id: 1, email: "3@", name: "Savanoris 1" },
      { id: 4, email: "3@", name: "Savanoris 4" },
      { id: 2, email: "3@", name: "Savanoris 2" },
    ],
  },
  {
    id: 2,
    name: "Renginys 2",
    description: "Aprašymas 2",
    startTime: new Date(),
    attendees: ["Dalyvis 1", "Dalyvis 2"],
    volunteers: [],
    volunteerRequests: [
      { id: 3, email: "3@", name: "Savanoris 3" },
      { id: 1, email: "3@", name: "Savanoris 1" },
      { id: 4, email: "3@", name: "Savanoris 4" },
      { id: 2, email: "3@", name: "Savanoris 2" },
    ],
  },
  {
    id: 3,
    name: "Renginys 3",
    description: "Aprašymas 3",
    startTime: new Date(),
    attendees: ["Dalyvis 1", "Dalyvis 2"],
    volunteers: [],
    volunteerRequests: [
      { id: 3, email: "3@", name: "Savanoris 3" },
      { id: 1, email: "3@", name: "Savanoris 1" },
      { id: 4, email: "3@", name: "Savanoris 4" },
      { id: 2, email: "3@", name: "Savanoris 2" },
    ],
  },
];

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="flex h-[70vh] flex-col" sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EventManagement() {
  const [value, setValue] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClick = () => {
    navigate("/edit-demo");
  };

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Sukurti" {...a11yProps(0)} />
          <Tab label="Peržiūrėti visus" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CreateEvent />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Container ref={containerRef}>
          <Box sx={{ minWidth: 120, margin: "50px" }}>
            {eventsFromBE.map((event) => (
              <div key={event.id}>
                <EventRowCard
                  event={event}
                  height={150}
                  button={
                    <Button
                      onClick={handleClick}
                      variant="contained"
                      disableElevation
                    >
                      Redaguoti
                    </Button>
                  }
                />
              </div>
            ))}
          </Box>
        </Container>
      </CustomTabPanel>
    </Container>
  );
}
