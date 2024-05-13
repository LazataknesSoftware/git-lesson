const express = require("express");
const server = express()
const {cwd} = require("process")
const fs = require("fs")
const {resolve: cc}= require("path")
const os = require("os")
const bodyParser = require("body-parser");
const {readFileSync: cat} = require("fs")
server.use(express.static(cc(cwd(),"htmls")))
server.set('view engine','hbs')
server.use(bodyParser.json())
server.set('views',cc(cwd(), 'htmls'))
server.use((req,res,next) => {
	req.ram = os.totalmem() / 1048576
	next()
})
// git
server.get("/",(req,res) => {
	res.sendFile(cc(cwd(),'htmls','main.html'))
	console.log(req.ram + " MB of RAM")
})
server.get("/langs/:lang",(req,res) => {
	try{
		let data = JSON.parse(cat(cc(cwd(),"htmls","static",`${req.params["lang"]}.json`)))
	res.render("page.hbs", {
		language_color: data.color,
		language_name: data.name,
		language_author: data.company,
		language_type: (data.type == "interpreter" ? "интерпретируемый".fontcolor("red") : "компилируемый".fontcolor("green")),
		language_type_casting: (data.type_casting == "weak" ? "слабую".fontcolor("red") : "сильную".fontcolor("green")),
		language_usages: (data.whereused.join(", "))

	})
	}catch{
		res.sendFile(cc(cwd(),'htmls','notfound.html'))
	}})
server.get("/register",(req,res) => {
	res.sendFile(cc(cwd(),"htmls","register.html"))
})
server.post("/addlang",(req,res) => {
	fs.writeFileSync(cc(cwd(),"htmls","static",`${req.body.name}.json`),JSON.stringify(req.body))
})
server.get("/howmany",(req,res) => {
	res.send(fs.readdirSync(cc(cwd(),"htmls","static")).join("||").replaceAll(".json",""))
})
server.listen(8080)
