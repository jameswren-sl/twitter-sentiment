import React, { useState } from 'react'
import { TextField, Typography, Grid, Divider } from '@material-ui/core'
import sentimentService from '../sentiment/sentiment-service'
import userService from './user-service'
import UserResults from './UserResults'
import GroupedBarChart from './GroupedBarChart'
import LoadingButton from '../ui/LoadingButton'

function CompareUsers () {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
  const [user1Details, setUser1Details] = useState(null)
  const [user2Details, setUser2Details] = useState(null)

  const [user1Results, setUser1Results] = useState({})
  const [user2Results, setUser2Results] = useState({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const groupedBarChartData = [
    { category: 'Positive', data: [user1Results.positive, user2Results.positive]},
    { category: 'Negative', data: [user1Results.negative, user2Results.negative]},
    { category: 'Neutral', data: [user1Results.neutral, user2Results.neutral]},
    { category: 'Mixed', data: [user1Results.mixed, user2Results.mixed]}
  ]

  const compare = async () => {
    setLoading(true)
    setError(false)

    console.log(`Comparing ${user1} and ${user2}`)

    try {
      const [user1Details, user2Details] = await Promise.all([userService.getUser(user1), userService.getUser(user2)])

      setUser1Details(user1Details)
      setUser2Details(user2Details)

      const user1Promise = sentimentService.getUserSentiment(user1)
      const user2Promise = sentimentService.getUserSentiment(user2)

      const [user1Response, user2Response] = await Promise.all([user1Promise, user2Promise])

      setUser1Results(user1Response)
      setUser2Results(user2Response)
    } catch (error) {
      console.error(error)
      setError(true)
    }

    setLoading(false)
  }

  return (
    <div>
      <Grid container alignItems='center' spacing={8}>
        <Grid item>
          <Typography>Compare </Typography>
        </Grid>
        <Grid item xs>
          <TextField margin='dense' fullWidth value={user1} onChange={e => setUser1(e.target.value)} />
        </Grid>
        <Grid item>
          <Typography> with </Typography>
        </Grid>
        <Grid item xs>
          <TextField margin='dense' fullWidth value={user2} onChange={e => setUser2(e.target.value)} />
        </Grid>
        <Grid item md='auto' xs={12}>
          <LoadingButton onClick={compare} disabled={!user1 || !user2} loading={loading}>Compare</LoadingButton>
        </Grid>
      </Grid>

      <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

      { error && <Typography color='error' variant='subtitle2'>Failed to get details</Typography>}

      { user1Details && user2Details && !loading && !error && <Grid container spacing={16}>
        <Grid item xs>
          <UserResults user={user1Details} results={user1Results} />
        </Grid>
        <Grid item xs>
          <UserResults user={user2Details} results={user2Results} />
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <GroupedBarChart data={groupedBarChartData} />
        </Grid>
      </Grid> }
    </div>
  )
}

export default CompareUsers
