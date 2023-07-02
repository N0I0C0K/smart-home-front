import { Box, Grid, IconButton, Typography } from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import { ItemCard } from '../components/ItemCard'

const items = [1, 2, 3, 4, 5, 6, 6, 12, 1, 1, 1]

export function Home() {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <Box ml={'auto'}>
        <IconButton variant='plain' color='neutral' size={'lg'}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box mb={10}>
        <Typography level='h2' fontWeight={700}>
          Monky's home
        </Typography>
        <Typography level='body2'>7个设备</Typography>
      </Box>
      <Box>
        <Typography
          level='h4'
          fontWeight={600}
          sx={{
            mb: 1,
          }}
        >
          客厅
        </Typography>
        <Grid container spacing={2}>
          {items.map((v) => {
            return (
              <Grid xs={6}>
                <ItemCard title={`Node ${v}`} subtitle={`Node ${v}`} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Box>
  )
}
