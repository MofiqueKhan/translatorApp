const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

const API_KEY = 'q1JK6fA3QSx5QUEGOyvrTxl53EtsRtCI';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`${req.method} request received.`);
    next();
});

app.post('/translate', async (req, res) => {


    // console.log("Received POST request to /translate");
    // console.log("Request body:", req.body);
    const { text } = req.body;
    console.log("Text to translate:", text);
    
    if (!text) {
        console.error('Error: No text provided for translation.');
        return res.status(400).json({ error: 'Text to translate is required' });
    }

    try {
        const response = await axios.post(
            'https://api.apilayer.com/language_translation/translate', 
            {
                q: text, 
                source: 'en',
                target: 'hi'
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': API_KEY
                }
            }
        );

        // console.log("API Full Response:", response.data);

        const rawTranslationString = response.data.translations[0].translation;
        // console.log("Raw Translation String:", rawTranslationString);

        let translatedText;
        try {
            const parsedTranslation = JSON.parse(rawTranslationString);
            translatedText = parsedTranslation.q || rawTranslationString;
        } catch (parseError) {
            console.error('Parsing Error:', parseError);
            translatedText = rawTranslationString;
        }

        console.log("Translated Text to return:", translatedText);

        res.json({ translatedText });
    } catch (error) {
        console.error('Error translating text:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Translation failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
