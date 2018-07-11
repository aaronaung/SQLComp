import React, { Component } from 'react';
import InputBar from './input';
import logo from '../img/sqlcomp.png';

class Home extends Component{
    render(){
        return (
            <div className = "home">
                <h1 className='text-center mt-3'><img className='mr-3' src={logo} style={{width: '40px'}}alt='Check img location'></img>SQL Comp Engine</h1>
                <InputBar/>
            </div>
        )
    }
}

export default Home;