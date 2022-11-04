/* eslint-env node */
const sdk = require('node-appwrite')
const axios = require('axios')
const { InputFile, ID } = require('node-appwrite')

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client()

  const database = new sdk.Databases(client)
  const storage = new sdk.Storage(client)
  const account = new sdk.Account(client)

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY'] ||
    !req.variables['APPWRITE_FUNCTION_JWT'] ||
    !req.variables['APPWRITE_FUNCTION_DEEPGRAM_KEY']
  ) {
    console.warn(
      'Environment variables are not set. Function cannot use Appwrite SDK.'
    )
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setJWT(req.variables['APPWRITE_FUNCTION_JWT'])
  }
  const payload = JSON.parse(req.payload)
  if (!payload.bucketId || !payload.audioFileId || !payload.name)
    throw new Error(
      'You must send the bucketId, the name and the audioFileId :' + req.payload
    )
  const fileMetadata = await storage.getFile(
    payload.bucketId,
    payload.audioFileId
  )
  const file = await storage.getFileDownload(
    payload.bucketId,
    payload.audioFileId
  )

  try {
    const response = await axios.post(
      'https://api.deepgram.com/v1/listen/?punctuate=true&model=general&language=fr&tier=base&diarize=true',
      file,
      {
        timeout: 1000 * 10, // Wait for 5 seconds
        headers: {
          'Content-Type': fileMetadata.mimeType,
          Authorization: `Token ${req.variables['APPWRITE_FUNCTION_DEEPGRAM_KEY']}`,
        },
      }
    )
    const result = response.data.results.channels[0].alternatives[0]
    const json = InputFile.fromPlainText(
      JSON.stringify(result),
      payload.name + '.json'
    )
    const transcript = await storage.createFile(
      '6353f19415e94ccba2b9',
      ID.unique(),
      json
    )
    const currentUser = await account.get()
    const document = await database.createDocument(
      '6353f06c3bbe14ecda56',
      '6353f08ecb8b2766d8eb',
      'unique()',
      {
        name: payload.name,
        transcriptFileId: transcript.$id,
        audioFileId: payload.audioFileId,
        authorId: currentUser.$id,
      }
    )
    res.json({ data: { ...document, transcript: result } })
  } catch (e) {
    await storage.deleteFile(payload.bucketId, payload.audioFileId)
    throw new Error(e)
  }
}
