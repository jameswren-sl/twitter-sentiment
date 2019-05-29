import config from '../config'

export default {
  async getUser (userId) {
    const response = await window.fetch(`${config.endpoint}/user/${userId}`)

    if (response.status !== 200) {
      console.error('Failed to get successful response', response)
      throw new Error('Failed to get successful response')
    }

    return response.json()
  }
}
