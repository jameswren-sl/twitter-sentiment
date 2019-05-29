import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Avatar, Card, CardHeader, CardContent } from '@material-ui/core'
import Glass from './Glass'

function UserResults (props) {
  const { user, results } = props

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={user.profileImageUrl} />}
        title={user.name}
      />
      <CardContent align='center'>
        <Glass positive={results.positive || 0} negative={results.negative || 0} />
        <Typography variant='body2'>{ user.name }'s glass is <strong>{ Math.round((0.5 + ((results.positive / 2) - (results.negative / 2))) * 100) }%</strong> full</Typography>
        <Typography variant='caption' align='right'>Analysed { results.tweetCount } Tweets</Typography>
      </CardContent>
    </Card>
  )
}

UserResults.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    profileImageUrl: PropTypes.string
  }),
  results: PropTypes.shape({
    positive: PropTypes.number,
    negative: PropTypes.number
  })
}

export default UserResults
