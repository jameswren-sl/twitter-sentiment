import config from '../config'

export default {
  async getSentiment (searchTerm) {
    const response = await window.fetch(`${config.endpoint}/sentiment?q=${searchTerm}`)

    if (response.status !== 200) {
      console.error('Failed to get successful response', response)
      throw new Error('Failed to get successful response')
    }

    return response.json()
  },

  async getUserSentiment (userId) {
    const response = await window.fetch(`${config.endpoint}/user?user=${userId}`)

    if (response.status !== 200) {
      console.error('Failed to get successful response', response)
      throw new Error('Failed to get successful response')
    }

    return response.json()
  }
}
