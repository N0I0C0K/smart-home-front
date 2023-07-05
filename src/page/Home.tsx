import {
  Box,
  Grid,
  IconButton,
  Modal,
  ModalDialog,
  Slider,
  Typography,
} from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import { ItemCard } from '../components/ItemCard'
import { centerManager } from '../store/center'
import { observer } from 'mobx-react-lite'
import { NodeProps, nodeType } from '../props'
import React from 'react'
import SyncIcon from '@mui/icons-material/Sync'

export const Home = observer(() => {
  const [open, setOpen] = React.useState(false)
  const [targetNode, setTargetNode] = React.useState<NodeProps | null>(null)
  const [sliderValue, setSliderValue] = React.useState(0)

  React.useEffect(() => {
    setSliderValue(targetNode?.value ?? 0)
  }, [targetNode])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!targetNode) return
      centerManager.controlNode(targetNode!.id, sliderValue)
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [sliderValue])
  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <Box ml={'auto'}>
        <IconButton
          variant="plain"
          color="neutral"
          size={'lg'}
          onClick={() => {
            centerManager.checkAlive()
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Box mb={10}>
        <Typography level="h2" fontWeight={700}>
          Monky's home
        </Typography>
        <Typography level="body2">
          {centerManager.nodes.length}个设备
        </Typography>
      </Box>
      {centerManager.positions.map((posName) => {
        return (
          <Box key={posName}>
            <Typography
              level="h4"
              fontWeight={600}
              sx={{
                mb: 1,
              }}
            >
              {posName}
            </Typography>
            <Grid container spacing={2}>
              {centerManager.nodes
                .filter((node) => node.position === posName)
                .map((i, v) => {
                  return (
                    <Grid xs={6} key={v}>
                      <ItemCard
                        title={i.name}
                        subtitle={`${i.position} | ${i.value ?? 'none'}`}
                        alive={i.alive}
                        itemType={
                          i._type === nodeType.bool_control ||
                          i._type === nodeType.bool_sensor
                            ? 'bool'
                            : 'number'
                        }
                        value={i.value}
                        onClick={() => {
                          setTargetNode(i)
                          if (i._type === nodeType.bool_control) {
                            centerManager.controlNode(
                              i.id,
                              i.value! > 0 ? 0 : 1
                            )
                          } else if (i._type === nodeType.num_control) {
                            setOpen(true)
                          }
                        }}
                      />
                    </Grid>
                  )
                })}
            </Grid>
          </Box>
        )
      })}
      {/* <Box>
        <Grid container spacing={2}>
          <Grid xs={6}>
            <ItemCard
              title="台灯"
              subtitle="客厅"
              alive={true}
              itemType="bool"
              value={0}
            />
          </Grid>
          <Grid xs={6}>
            <ItemCard
              title="可调光台灯"
              subtitle="客厅"
              alive={true}
              itemType="number"
              value={88}
            />
          </Grid>
        </Grid>
      </Box> */}
      <Box minHeight={'20vh'} />
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ModalDialog
          sx={{
            maxWidth: '100vw',
            height: '40vh',
          }}
        >
          <Typography
            level="h4"
            fontWeight={600}
            sx={{
              mx: 'auto',
              mb: 3,
            }}
          >
            {targetNode?.name}
          </Typography>
          <Slider
            sx={{
              mt: 2,
              '--Slider-trackSize': '60px',
            }}
            value={sliderValue}
            step={1}
            orientation="vertical"
            onChange={(e, v) => {
              setSliderValue(v as number)
            }}
            valueLabelDisplay="on"
          ></Slider>
        </ModalDialog>
      </Modal>
    </Box>
  )
})
