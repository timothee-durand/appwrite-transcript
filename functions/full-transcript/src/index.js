const sdk = require('node-appwrite')

const SETTINGS = {
    databaseId: "6353f06c3bbe14ecda56",
    collectionId: "6353f08ecb8b2766d8eb"
}

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

    // You can remove services you don't use
    const database = new sdk.Databases(client)
    const storage = new sdk.Storage(client)

    if (
        !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
        !req.variables['APPWRITE_FUNCTION_PROJECT_ID'] ||
        !req.variables['APPWRITE_FUNCTION_JWT'] ||
        !req.variables['APPWRITE_TRANSCRIPT_BUCKET_ID']
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

    const transcriptId = req.payload
    if (!transcriptId) throw new Error('You must send the transcriptId')

    const transcript = await database.getDocument(
        SETTINGS.databaseId,
        SETTINGS.collectionId,
        transcriptId
    )

    if (!transcript) throw new Error('This transcript does not exist')

    const transcriptFile = await storage.getFileView(
        req.variables['APPWRITE_TRANSCRIPT_BUCKET_ID'],
        transcript.transcriptFileId
    )

    if (!transcriptFile) throw new Error('The transcript file does not exist')
    res.json({
        transcript,
        transcriptFile: JSON.parse(transcriptFile.toString()),
    })
}
