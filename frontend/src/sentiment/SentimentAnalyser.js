import React, { useState } from 'react'
import { TextField, Grid, Divider, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import sentimentService from './sentiment-service'
import ScaleGraph from './ScaleGraph'
import LoadingButton from '../ui/LoadingButton'

const styles = {
  loadingWrapper: {
    position: 'relative',
    display: 'inline',
    width: '100%'
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}

function SentimentAnalyser () {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState({ positive: 0, negative: 0, neutral: 0, mixed: 0, tweetCount: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleEnter = e => {
    if (e.key === 'Enter') {
      analyse()
    }
  }

  const analyse = async () => {
    setLoading(true)
    setError(false)

    try {
      const results = await sentimentService.getSentiment(searchTerm)

      console.log(results)
      setResults(results)
    } catch (error) {
      setError(true)
    }

    setLoading(false)
  }

  return (
    <Grid style={{ padding: 12 }} container direction='column' spacing={24}>
      { error ? 'Failed' : ''}
      <Grid container item spacing={24}>
        <Grid item xs={12} md={10}>
          <TextField placeholder='Enter a term to search on' margin='normal' fullWidth value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={handleEnter} />
        </Grid>
        <Grid item container xs={12} md={2} alignItems='center' justify='center'>
          <LoadingButton onClick={analyse} disabled={!searchTerm} loading={loading} >Analyse</LoadingButton>
        </Grid>
      </Grid>
      <Divider />
      <Grid container item align='center'>
        <Grid item xs>
          <ScaleGraph percentage={results.positive} title='Positive' color='green' />
        </Grid>
        <Grid item xs>
          <ScaleGraph percentage={results.negative} title='Negative' color='red' />
        </Grid>
        <Grid item xs>
          <ScaleGraph percentage={results.neutral} title='Neutral' color='black' />
        </Grid>
        <Grid item xs>
          <ScaleGraph percentage={results.mixed} title='Mixed' color='blue' />
        </Grid>
        { results.tweetCount && <Grid item xs={12} >
          <Typography variant='caption' align='right'>
            Analysed { results.tweetCount } Tweets
          </Typography>
        </Grid> }
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(SentimentAnalyser)
