import { Button, Container, Stack } from "@mui/material";

export default function Options() {
  return (
    <Container className="options">
      <Button variant="contained" style={{ width: "100%" }}>Niko kadi</Button>
      <Stack direction="row" spacing={2}>
        <Button style={{ width: "100%" }} variant="contained" color="success">
          Shuffle
        </Button>
        <Button style={{ width: "100%" }} variant="outlined" color="error">
          Exit Game
        </Button>
      </Stack>
    </Container>
  )
}

