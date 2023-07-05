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
import ListIcon from '@mui/icons-material/List'
import { useLocation, useNavigate, useNavigation } from 'react-router-dom'

export function BottomTab() {
  const [index, setIndex] = React.useState(0)
  const goto = useNavigate()
  const colors = ['primary', 'info', 'danger', 'success'] as const
  const tabs: { name: string; path: string; icon: React.ReactElement }[] = [
    {
      name: 'Home',
      path: '/home',
      icon: <HomeOutlined />,
    },
    {
      name: 'Record',
      path: '/record',
      icon: <ListIcon />,
    },
    {
      name: 'Search',
      path: '/search',
      icon: <Search />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <Person />,
    },
  ]

  const { pathname } = useLocation()
  React.useEffect(() => {
    console.log(pathname)

    tabs.some((val, idx) => {
      if (pathname.startsWith(val.path)) {
        setIndex(idx)
        return true
      }
      return false
    })
  }, [pathname])

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
        size="lg"
        aria-label="Bottom Navigation"
        value={index}
        onChange={(event, value) => {
          setIndex(value as number)
          goto(`${tabs[value as number].path}`)
        }}
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
          variant="plain"
          sx={{
            '--ListItemDecorator-size': '28px',
          }}
        >
          {tabs.map((val, idx) => {
            return (
              <Tab
                key={idx}
                orientation="vertical"
                {...(index === idx && { variant: 'soft', color: colors[idx] })}
              >
                <ListItemDecorator>{val.icon}</ListItemDecorator>
                {val.name}
              </Tab>
            )
          })}
        </TabList>
      </Tabs>
    </Box>
  )
}
