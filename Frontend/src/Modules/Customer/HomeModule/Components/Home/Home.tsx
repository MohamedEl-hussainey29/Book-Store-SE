import { Box, Stack } from "@mui/material";
import HomeSlider from "../HomeSlider/HomeSlider";
import HomeCateg from "../HomeCateg/HomeCateg";
import NewRelease from "../NewRelease/NewRelease";
import FeaturedBook from "../FeaturedBook/FeaturedBook";

export default function Home() {
  return (
    <>
      <Box>
        <Stack my={4}><HomeSlider/></Stack>
        <Stack><HomeCateg/></Stack>
        <Stack><NewRelease/></Stack>
        <Stack><FeaturedBook/></Stack>
      </Box>
    </>
  )
}
