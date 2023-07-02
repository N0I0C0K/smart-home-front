import * as React from 'react'
import Box from '@mui/joy/Box'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab, { tabClasses } from '@mui/joy/Tab'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Search from '@mui/icons-material/Search'
import Person from '@mui/icons-material/Person'

export function BottomTab() {
  const [index, setIndex] = React.useState(0)
  const colors = ['primary', 'info', 'danger', 'success'] as const
  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100vw',
        display: 'flex',
        bottom: 20,
      }}
    >
      <Tabs
        size='lg'
        aria-label='Bottom Navigation'
        value={index}
        onChange={(event, value) => setIndex(value as number)}
        sx={(theme) => ({
          borderRadius: 'xl',
          //maxWidth: 400,
          mx: 'auto',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          boxShadow: theme.shadow.xl,
          '--Tabs-gap': '8px',
          //'--joy-shadowChannel': theme.vars.palette[colors[index]].darkChannel,
          [`& .${tabClasses.root}`]: {
            boxShadow: 'none',
            borderRadius: 'lg',
            whiteSpace: 'nowrap',
            transition: '0.3s',
            fontWeight: 'lg',
            flex: 1,
            [`&:not(.${tabClasses.selected}):not(:hover)`]: {
              opacity: 0.72,
            },
          },
        })}
      >
        <TabList
          variant='plain'
          sx={{
            '--ListItemDecorator-size': '28px',
          }}
        >
          <Tab
            orientation='vertical'
            {...(index === 0 && { variant: 'soft', color: colors[0] })}
          >
            <ListItemDecorator>
              <HomeOutlined />
            </ListItemDecorator>
            Home
          </Tab>
          <Tab
            orientation='vertical'
            {...(index === 1 && { variant: 'soft', color: colors[1] })}
          >
            <ListItemDecorator>
              <FavoriteBorder />
            </ListItemDecorator>
            Likes
          </Tab>
          <Tab
            orientation='vertical'
            {...(index === 2 && { variant: 'soft', color: colors[2] })}
          >
            <ListItemDecorator>
              <Search />
            </ListItemDecorator>
            Search
          </Tab>
          <Tab
            orientation='vertical'
            {...(index === 3 && { variant: 'soft', color: colors[3] })}
          >
            <ListItemDecorator>
              <Person />
            </ListItemDecorator>
            Profile
          </Tab>
        </TabList>
      </Tabs>
    </Box>
  )
}
