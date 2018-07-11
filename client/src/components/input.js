import React, { Component } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QueryResult from './result';
import config from '../../../app_config.json';

class InputBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: "",
            btnPending: false,
            queryResult: []
        }
    }
    
    handleInputChange(e){
        this.setState({input: e.target.value});
    }

    handleResponse(data){
        this.setState({btnPending: false})
        let success = true;
        let failedMsges = [];
        for(var i = 0; i < data.length; i ++){
            if(data[i].status === "error"){
                success = false;
                if(failedMsges.indexOf(data[i].payload) === -1) failedMsges.push(data[i].payload);
            }
        }
        if(success){
            toast.success(" Sweet query! I got you the results.")
            let mismatches = this.calculateMismatchIndices(data);
            this.setState({queryResult: data.map( (res) => {
                    let data =res.payload.map( (each) => Object.values(each) );
                    return {
                        dbname: res.database,
                        data: data,
                        columns: Object.keys(res.payload[0]),
                        mismatches
                    };
                })
            })
        }else{
            toast.error("Please give me something I can deal with. Here are some complaints I've got for you: [ " + failedMsges.join(". ") + " ]")
        }
    }

    calculateMismatchIndices(data){
        let parsed = data.map((res) => res.payload.map( (each) => Object.values(each)));
        let mismatches = [];
        for(var i = 0; i < parsed[0].length; i++){
            if(JSON.stringify(parsed[0][i]) !== JSON.stringify(parsed[1][i])){
                mismatches.push(i);
            }
        }return mismatches;
    }

    async handleSubmit(e){
        e.preventDefault();
        try{
            this.setState({btnPending: true})
            var response = await fetch("http://localhost:"+ config.API_PORT + "/api/executeQuery", {
                method: 'post',
                headers: {"Content-Type": "application/json"},
                body:JSON.stringify({ query: this.state.input})
            })
            var data = await response.json();
            this.handleResponse(data);
        }catch(error){
            console.log(error)
            toast.error("The API server is either asleep or dead. Please check up on him.")
            this.setState({btnPending: false})
        }
    }

    render(){
        return (
            <div>
                <div className="container p-0">
                <ToastContainer ref = {"toastr"} className = "toast-top-right"/>
                <form onSubmit={(e) => this.handleSubmit(e)} className='inputBar form-inline mt-3'>
                    <input style={{width: "90%"}} onChange={(e) => this.handleInputChange(e)} className='form-control' placeholder='Please enter your SQL query'></input>
                    <button type='submit' style={{width: "9%", marginLeft: "1%"}} className="form-control btn-primary" disabled={this.state.btnPending}>{this.state.btnPending? `...`: `Execute`}</button>
                </form>
                </div>
                
                <QueryResult result = {this.state.queryResult}/>
            </div>
            
        )
    }
}

export default InputBar;