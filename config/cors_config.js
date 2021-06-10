const whitelist = [
  'http://localhost:3000',
  'https://gif-frontend-cuneyt.herokuapp.com'
]
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: 'GET, PUT, PATCH, POST, DELETE'
}

export { corsOptions }
