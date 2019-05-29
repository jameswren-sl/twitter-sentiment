import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import theme from './theme'
import SentimentAnalyser from './sentiment/SentimentAnalyser'
import CompareUsers from './user-comparison/CompareUsers'
import TwitterLogo from './assets/Twitter_Logo_WhiteOnBlue.svg'

function App () {
  return (
    <MuiThemeProvider theme={theme} >
      <AppBar position='static'>
        <Toolbar>
          <img src={TwitterLogo} alt='Twitter logo' style={{ width: '60px' }} />
          <Typography variant='h4' color='inherit'>
            Twitter Sentiment Analysis
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 12 }}>
        <Grid container spacing={24}>
          <Grid item xs={12} md={6}>
            <Paper>
              <AppBar position='relative'>
                <Toolbar>
                  <Typography variant='h6' color='inherit'>Sentiment for a Term</Typography>
                </Toolbar>
              </AppBar>
              <div style={{ padding: 12 }} >
                <SentimentAnalyser />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <AppBar position='relative'>
                <Toolbar>
                  <Typography variant='h6' color='inherit'>Who's More Pessimistic?</Typography>
                </Toolbar>
              </AppBar>
              <div style={{ padding: 12 }} >
                <CompareUsers />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </MuiThemeProvider>
  )
}

export default App
