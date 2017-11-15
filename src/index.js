const app = require('express')()

app.set('view engine', 'ejs')

const stories = [
  {
    id: 1,
    author: 'John Curcio',
    title: 'Chapeuzinho Vermelho',
    genre: 'fantasia',
    createdat: '25-11-2017',
    fragments: [
    	{
			author:"Claudia",
      		data: "Chapeuzinho vermelho era uma garotinha muito levada...",
     		createdat:"26-11-2017",
      		modifiedat:""
      	},
      	{
      		author:"Claudia",
      		data: "E, por isso, acabou sendo levada pelo lobo mau.",
     		createdat:"26-11-2017",
      		modifiedat:""
      	}
    ]
  },
  {
    id: 2,
    author: 'JPaulo',
    title: 'Bela e a Fera',
    genre: 'fantasia',
    createdat: '25-11-2017',
    fragments: [
    	{
			author:"John",
      		data: "Bela...",
     		createdat:"26-11-2017",
      		modifiedat:""
      	},
      	{
      		author:"Tulio",
      		data: "E a fera.",
     		createdat:"26-11-2017",
      		modifiedat:""
      	},
      	{
      		author:"Tulio",
      		data: "se foi",
     		createdat:"26-11-2017",
      		modifiedat:""
      	}
    ]
  }
]

app.get('/', (req, res) => {
  res.render('index', 
  		{ stories: stories }
  	)
})

app.get('/story/:id', (req, res) => {
  const story = stories.filter((stry) => {
    return stry.id == req.params.id
  })[0]

  res.render('story', {
    author: story.author,
    title: story.title,
    genre: story.genre,
	createdat: story.createdat,
	fragments: story.fragments
  })
})

app.listen(8080)

console.log('listening on port 8080')