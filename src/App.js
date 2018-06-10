import React, { Component } from 'react';

"use strict";

class App extends Component {

  render() {
    return (
      <div id="main">
        <Clue />
      </div>
    );
  }
}

class Clue extends React.Component{
  constructor(props){
    super(props);
    this.state = {Clue: '', Answer : '', Category : 'Press button to start!', UserAnswer : '',
      gifSrc: 'https://media0.giphy.com/media/3aGZA6WLI9Jde/giphy.gif', gifType: ""};
    this.getGif = this.getGif.bind(this);
    this.getClue = this.getClue.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.getAnswer = this.getAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Calls API and gets a random gif with a specific tag from Giphy.com
  getGif(gifType){
    let giphyAPI = new XMLHttpRequest();
    let giphyURL = "http://api.giphy.com/v1/gifs/random?tag="+gifType+"&api_key=J8RAnEmGU9cDrO0VuE61GUtCH5a99Us8&limit=10";
    console.log(gifType);
    giphyAPI.onreadystatechange=function()
    {
      if (giphyAPI.readyState===4 && giphyAPI.status===200)
      {
        let a = JSON.parse(giphyAPI.responseText);
        console.log(a.data);
        this.setState({gifSrc: a.data.image_url})
        console.log('lol');

      }
    }.bind(this);

    giphyAPI.open("get", giphyURL, true);
    giphyAPI.send();
  }

  // Gets a randowm Question from the jService API.
  getClue(){
    let jServiceAPI = new XMLHttpRequest();
    let jServiceURL = "http://jservice.io/api/random";
    //jServiceAPI.addEventListener("load",this.handleResponse(jServiceAPI));

    jServiceAPI.onreadystatechange=function()
    {
      if (jServiceAPI.readyState===4 && jServiceAPI.status===200)
      {
        let a = JSON.parse(jServiceAPI.responseText);
        console.log(a[0]);
        let question = a[0].question;
        let answer = a[0].answer;
        let category = a[0].category.title;
        this.setState({Clue: question, Answer : answer, Category: "Category: " + category})
      }
    }.bind(this);

    jServiceAPI.open("get", jServiceURL, true);
    jServiceAPI.send();

    document.getElementById("button-getClue").style.display ='none';
    document.getElementById("startText").style.display ='none';
    document.getElementById("question-div").style.display ='inline-block';


  }

  // checks if the answer is right and displays a gif depending on the answer.
  checkAnswer(){
    this.setState({gifSrc: ''});
    var userAnswer = this.state.UserAnswer.toLowerCase();
    var answer = this.state.Answer.toLowerCase();
    if(answer.includes(" ")){
      var dumbAnswer = answer.split(' ')[1];
      console.log(dumbAnswer);
    }
    if(userAnswer === answer || userAnswer === dumbAnswer){
      this.setState({Category : "Correct"});
      this.getGif('nice');
    }else{
      this.setState({Category : "Wrong Answer, Correct Answer : " + this.state.Answer });
      this.getGif('wrong');
    }
    document.getElementById("startText").style.display ='block';
    document.getElementById("button-getClue").style.display ='inline-block';
    document.getElementById("question-div").style.display ='none';
    this.setState({UserAnswer: ""});
    console.log();

  }

  // when the user clicks 'dont know' button. Gets a 'wrong'-gif.
  getAnswer(){
    this.setState({Category : "Wrong Answer, Correct Answer : " + this.state.Answer });
    document.getElementById("startText").style.display ='block';
    document.getElementById("button-getClue").style.display ='inline-block';
    document.getElementById("question-div").style.display ='none';
    this.setState({UserAnswer: ""});
    this.getGif('wrong')
  }

  // Called when user enters something in the input-element.
  handleChange(event) {
    this.setState({UserAnswer: event.target.value});
  }

  render() {
    return (
        <div id="clue-div">
          <img src={this.state.gifSrc} alt='Gif' />
          <p id="startText">{this.state.Category}</p>
          <button id="button-getClue" className="button-submit" onClick ={this.getClue}>New Clue</button>
          <div id="question-div">
            <h1>{this.state.Category}</h1>
            <h3>{this.state.Clue}</h3>
            <p id="whatIs">Whats is? :</p>
            <input type="text" value={this.state.UserAnswer} onChange={this.handleChange}/>
            <button id="button-answer"  onClick ={this.checkAnswer}>Enter Answer</button>
            <button id="button-dontknow" onClick ={this.getAnswer}>I don't know :(</button>
          </div>
        </div>
    )
  }
}



export default App;
